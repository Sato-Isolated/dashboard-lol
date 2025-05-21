// src/scripts/fetchAndStoreMatches.ts
import {
  createAccountService,
  createSummonerService,
  createMatchService,
} from "@/services/lol/riotServiceFactory";
import { insertMatch } from "@/repositories/matchRepo";
import {
  getOrCreateSummoner,
  setFetchOldGames,
  setLastFetchedGameEndTimestamp,
  getSummoner,
} from "@/repositories/summonerRepo";

/**
 * Fetches matches from Riot API for a given summoner and stores them in MongoDB.
 * @param platformRegion Riot platform region (e.g., "euw1")
 * @param name Summoner name
 * @param tagline Riot tagline (e.g., "EUW")
 * @param count Number of matches to fetch (default: 10)
 */
export async function fetchAndStoreMatches(
  platformRegion: string,
  name: string,
  tagline: string,
  count = 10
) {
  // Get account and summoner info
  const accountApi = createAccountService(platformRegion);
  const account = await accountApi.getAccountByRiotId(name, tagline);
  if (!account) throw new Error("Account not found");

  const summonerApi = createSummonerService(platformRegion);
  const summoner = await summonerApi.getSummonerByPuuid(account.puuid);
  if (!summoner) throw new Error("Summoner not found");

  // Get or create summoner doc in DB
  const summonerDoc = await getOrCreateSummoner(
    platformRegion,
    name,
    tagline,
    account.puuid
  );

  // Définir la période : du 9 janvier 2025 à maintenant, ou juste les nouvelles games si fetchOldGames est true
  const now = Math.floor(Date.now() / 1000); // en secondes
  let fromTimestamp: number;
  let toTimestamp: number = now;
  if (!summonerDoc.fetchOldGames) {
    // On fetch tout l'historique jusqu'à janvier 2025
    fromTimestamp = Math.floor(
      new Date("2025-01-09T00:00:00Z").getTime() / 1000
    );
  } else {
    // On fetch uniquement les games récentes
    fromTimestamp =
      summonerDoc.lastFetchedGameEndTimestamp || now - 60 * 60 * 24 * 7; // fallback: 1 semaine
  }
  const options = {
    startTime: fromTimestamp,
    endTime: toTimestamp,
    queue: 450, // ARAM
    count: 100,
  };
  const matchApi = createMatchService(platformRegion);
  let allMatchIds: string[] = [];
  let start = 0;
  const batchSize = 100;
  let keepFetching = true;

  while (keepFetching) {
    const optionsBatch = {
      ...options,
      start,
      count: batchSize,
    };
    let matchIdsBatch: string[] = [];
    try {
      matchIdsBatch = await matchApi.getMatchlistByPuuid(
        account.puuid,
        optionsBatch
      );
    } catch (e: any) {
      if (e.message?.includes("Too Many Requests")) {
        console.warn("Rate limit hit, waiting 10s...");
        await new Promise((res) => setTimeout(res, 10000));
        continue; // retry this batch
      } else {
        console.error(`Error fetching matchlist batch at start=${start}:`, e);
        break;
      }
    }
    if (!matchIdsBatch.length) break;
    allMatchIds.push(...matchIdsBatch);
    if (matchIdsBatch.length < batchSize) {
      keepFetching = false;
    } else {
      start += batchSize;
    }
    // Respect Riot rate limit
    await new Promise((res) => setTimeout(res, 1200));
  }

  let mostRecentGameEnd = summonerDoc.lastFetchedGameEndTimestamp || 0;

  // Fetch and store each match
  for (const matchId of allMatchIds) {
    try {
      const match = await matchApi.getMatchById(matchId);
      await insertMatch(match);
      if (
        match.info?.gameEndTimestamp &&
        match.info.gameEndTimestamp > mostRecentGameEnd
      ) {
        mostRecentGameEnd = match.info.gameEndTimestamp;
      }
      console.log(`Stored match ${matchId}`);
      await new Promise((res) => setTimeout(res, 1200)); // Respect Riot rate limit
    } catch (e: any) {
      if (e.message?.includes("Too Many Requests")) {
        console.warn("Rate limit hit, waiting 10s...");
        await new Promise((res) => setTimeout(res, 10000)); // Wait 10s if 429
        // Optionally: retry here
      } else {
        console.error(`Error storing match ${matchId}:`, e);
      }
    }
  }

  // Si on a fetch tout l'historique, on passe fetchOldGames à true
  if (!summonerDoc.fetchOldGames) {
    await setFetchOldGames(platformRegion, name, tagline, true);
  }
  // On met à jour la date du match le plus récent
  if (mostRecentGameEnd) {
    await setLastFetchedGameEndTimestamp(
      platformRegion,
      name,
      tagline,
      mostRecentGameEnd
    );
  }

  // Retourne le nombre total de matchs stockés
  return { totalFetched: allMatchIds.length };
}

// Example usage (uncomment to run directly)
// fetchAndStoreMatches("euw1", "RafaleDeBlanche", "EUW", 10).then(() => process.exit(0));
