// src/scripts/fetchAndStoreMatches.ts
import {
  createAccountService,
  createSummonerService,
  createMatchService,
} from '@/shared/services/api/riot/riotServiceFactory';
import { insertMatch, getMatchById } from '@/features/matches/services/matchRepository';
import {
  getOrCreateSummoner,
  setFetchOldGames,
  setLastFetchedGameEndTimestamp,
  setLastUpdateTimestamp,
} from '@/features/summoner/services/summonerRepository';

/**
 * Fetches matches from Riot API for a given summoner and stores them in MongoDB.
 * @param platformRegion Riot platform region (e.g., "euw1")
 * @param name Summoner name
 * @param tagline Riot tagline (e.g., "EUW")
 */
export async function fetchAndStoreMatches(
  platformRegion: string,
  name: string,
  tagline: string,
) {
  // Get account and summoner info
  const accountApi = createAccountService(platformRegion);
  const account = await accountApi.getAccountByRiotId(name, tagline);
  if (!account) {throw new Error('Account not found');}

  const summonerApi = createSummonerService(platformRegion);
  const summoner = await summonerApi.getSummonerByPuuid(account.puuid);
  if (!summoner) {throw new Error('Summoner not found');}
  // Get or create summoner doc in DB
  const summonerDoc = await getOrCreateSummoner(
    platformRegion,
    name,
    tagline,
    account.puuid,
  );

  // Record the timestamp of this update
  const updateTimestamp = Math.floor(Date.now() / 1000);
  await setLastUpdateTimestamp(platformRegion, name, tagline, updateTimestamp);

  // Set the period: from January 9, 2025 to now, or just new games if fetchOldGames is true
  const now = Math.floor(Date.now() / 1000); // in seconds
  let fromTimestamp: number;
  const toTimestamp: number = now;
  if (!summonerDoc.fetchOldGames) {
    // Fetch all history up to January 2025
    fromTimestamp = Math.floor(
      new Date('2025-01-09T00:00:00Z').getTime() / 1000,
    );
    console.log(
      `[fetchAndStoreMatches] First time fetch - fetching from ${new Date(
        fromTimestamp * 1000,
      ).toISOString()} to now`,
    );
  } else {
    // Fetch recent games starting from the exact timestamp of the last game
    const lastGameTimestamp = summonerDoc.lastFetchedGameEndTimestamp;

    if (lastGameTimestamp) {
      // Start from the exact timestamp of the last game (+ 1 second to avoid duplicates)
      fromTimestamp = lastGameTimestamp + 1;
      console.log(
        `[fetchAndStoreMatches] Update fetch - last game was at ${new Date(
          lastGameTimestamp * 1000,
        ).toISOString()}, fetching from ${new Date(
          fromTimestamp * 1000,
        ).toISOString()} to now`,
      );
    } else {
      // No previous games found, fallback to 1 week
      fromTimestamp = now - 60 * 60 * 24 * 7;
      console.log(
        `[fetchAndStoreMatches] Update fetch - no previous games found, fetching from ${new Date(
          fromTimestamp * 1000,
        ).toISOString()} to now`,
      );
    }
  }
  const options = {
    startTime: fromTimestamp,
    endTime: toTimestamp,
    queue: 450, // ARAM
    count: 100,
  };
  const matchApi = createMatchService(platformRegion);
  const allMatchIds: string[] = [];
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
        optionsBatch,
      );
    } catch (e: unknown) {
      if (e instanceof Error && e.message?.includes('Too Many Requests')) {
        await new Promise((res) => setTimeout(res, 10000));
        continue; // retry this batch
      } else {
        break;
      }
    }
    if (!matchIdsBatch.length) {break;}
    allMatchIds.push(...matchIdsBatch);
    if (matchIdsBatch.length < batchSize) {
      keepFetching = false;
    } else {
      start += batchSize;
    } // Respect Riot rate limit
    await new Promise((res) => setTimeout(res, 1200));
  }

  console.log(
    `[fetchAndStoreMatches] Found ${allMatchIds.length} match IDs to process`,
  );
  let mostRecentGameEnd = summonerDoc.lastFetchedGameEndTimestamp || 0;

  // Fetch and store each match
  for (const matchId of allMatchIds) {
    try {
      const match = await matchApi.getMatchById(matchId);

      // Check if match already exists to avoid duplicates
      const existing = await getMatchById(match.metadata.matchId);
      if (!existing) {
        await insertMatch(match);
      }

      if (
        match.info?.gameEndTimestamp &&
        match.info.gameEndTimestamp > mostRecentGameEnd
      ) {
        mostRecentGameEnd = match.info.gameEndTimestamp;
      }
      await new Promise((res) => setTimeout(res, 1200)); // Respect Riot rate limit
    } catch (e: unknown) {
      if (e instanceof Error && e.message?.includes('Too Many Requests')) {
        await new Promise((res) => setTimeout(res, 10000)); // Wait 10s if 429
        // Optionally: retry here
      }
    }
  }

  // If we fetched all history, set fetchOldGames to true
  if (!summonerDoc.fetchOldGames) {
    await setFetchOldGames(platformRegion, name, tagline, true);
  }
  // Update the date of the most recent match
  if (mostRecentGameEnd) {
    await setLastFetchedGameEndTimestamp(
      platformRegion,
      name,
      tagline,
      mostRecentGameEnd,
    );
  }

  // Return the total number of stored matches
  return { totalFetched: allMatchIds.length };
}

// Example usage (uncomment to run directly)
// fetchAndStoreMatches("euw1", "RafaleDeBlanche", "EUW").then(() => process.exit(0));
