// src/lib/data/fetchAndStoreMatches.ts
import {
  createAccountService,
  createSummonerService,
  createMatchService,
} from '../api/api/riot/riotServiceFactory';
import {
  insertMatch,
  getMatchById,
} from '../../features/matches/services/matchRepository';
import {
  getOrCreateSummoner,
  setFetchOldGames,
  setLastFetchedGameEndTimestamp,
  setLastUpdateTimestamp,
} from '../../features/summoner/services/summonerRepository';

/**
 * Fetches matches from Riot API for a given summoner and stores them in MongoDB.
 * @param platformRegion Riot platform region (e.g., "euw1")
 * @param name Summoner name
 * @param tagline Riot tagline (e.g., "EUW")
 */
export async function fetchAndStoreMatches(
  platformRegion: string,
  name: string,
  tagline: string
) {
  // Get account and summoner info
  const accountApi = createAccountService(platformRegion);
  const account = await accountApi.getAccountByRiotId(name, tagline);
  if (!account) {
    throw new Error('Account not found');
  }

  const summonerApi = createSummonerService(platformRegion);
  const summoner = await summonerApi.getSummonerByPuuid(account.puuid);
  if (!summoner) {
    throw new Error('Summoner not found');
  }
  // Get or create summoner doc in DB
  const summonerDoc = await getOrCreateSummoner(
    platformRegion,
    name,
    tagline,
    account.puuid
  );

  // Record the timestamp of this update
  const updateTimestamp = Math.floor(Date.now() / 1000);
  await setLastUpdateTimestamp(platformRegion, name, tagline, updateTimestamp);

  // Set the period: from January 9, 2025 to now, or just new games if fetchOldGames is true
  let startDate: Date;
  const endDate = new Date(); // today

  if (!summonerDoc.fetchOldGames) {
    // Fetch all history up to January 2025
    startDate = new Date('2025-01-09T00:00:00Z');
    console.log(
      `[fetchAndStoreMatches] First time fetch - fetching from ${startDate.toISOString()} to now`
    );
  } else {
    // Fetch recent games starting from midnight of the day when the last game was played
    const lastGameTimestamp = summonerDoc.lastFetchedGameEndTimestamp;

    if (lastGameTimestamp) {
      // Get the date of the last game and go back to midnight of that day
      const lastGameDate = new Date(lastGameTimestamp * 1000);
      startDate = new Date(lastGameDate);
      startDate.setHours(0, 0, 0, 0); // Set to midnight of that day

      console.log(
        `[fetchAndStoreMatches] Update fetch - last game ended at ${new Date(
          lastGameTimestamp * 1000
        ).toISOString()}, fetching from midnight of that day ${startDate.toISOString()} to now`
      );
    } else {
      // No previous games found, fallback to 1 week
      startDate = new Date(endDate.getTime() - 60 * 60 * 24 * 7 * 1000);
      console.log(
        `[fetchAndStoreMatches] Update fetch - no previous games found, fetching from ${startDate.toISOString()} to now`
      );
    }
  }

  // Generate list of days to scan (day by day approach)
  const daysToScan: Array<{ start: number; end: number; dateStr: string }> = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);

    daysToScan.push({
      start: Math.floor(dayStart.getTime() / 1000),
      end: Math.floor(dayEnd.getTime() / 1000),
      dateStr: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(
    `[fetchAndStoreMatches] Scanning ${daysToScan.length} days individually to ensure complete coverage`
  );

  const matchApi = createMatchService(platformRegion);
  const allMatchIds: string[] = [];
  const seenMatchIds = new Set<string>(); // To avoid duplicates

  // Scan each day individually
  for (let dayIndex = 0; dayIndex < daysToScan.length; dayIndex++) {
    const day = daysToScan[dayIndex];
    console.log(
      `[fetchAndStoreMatches] Scanning day ${dayIndex + 1}/${daysToScan.length}: ${day.dateStr}`
    );

    const options = {
      startTime: day.start,
      endTime: day.end,
      queue: 450, // ARAM
      count: 100,
    };

    let start = 0;
    const batchSize = 100;
    let keepFetchingDay = true;

    while (keepFetchingDay) {
      const optionsBatch = {
        ...options,
        start,
        count: batchSize,
      };
      let matchIdsBatch: string[] = [];
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount <= maxRetries) {
        try {
          matchIdsBatch = await matchApi.getMatchlistByPuuid(
            account.puuid,
            optionsBatch
          );
          break; // Success, exit retry loop
        } catch (e: unknown) {
          if (e instanceof Error && e.message?.includes('Too Many Requests')) {
            retryCount++;
            const backoffTime = Math.min(
              10000 * Math.pow(2, retryCount - 1),
              60000
            ); // Exponential backoff, max 60s
            console.log(
              `[fetchAndStoreMatches] Rate limit hit for day ${day.dateStr}, retry ${retryCount}/${maxRetries} in ${backoffTime}ms`
            );
            await new Promise(res => setTimeout(res, backoffTime));

            if (retryCount > maxRetries) {
              console.error(
                `[fetchAndStoreMatches] Max retries exceeded for day ${day.dateStr}, batch starting at ${start}`
              );
              keepFetchingDay = false; // Stop fetching this day if we can't get this batch
              break;
            }
          } else {
            console.error(
              `[fetchAndStoreMatches] Unexpected error during day ${day.dateStr} batch fetch:`,
              e
            );
            keepFetchingDay = false;
            break;
          }
        }
      }

      if (!matchIdsBatch.length) {
        break; // No more matches for this day
      }

      // Add unique matches to our collection
      const newMatches = matchIdsBatch.filter(id => !seenMatchIds.has(id));
      newMatches.forEach(id => seenMatchIds.add(id));
      allMatchIds.push(...newMatches);

      console.log(
        `[fetchAndStoreMatches] Day ${day.dateStr}: Found ${matchIdsBatch.length} matches (${newMatches.length} new)`
      );

      if (matchIdsBatch.length < batchSize) {
        keepFetchingDay = false; // Reached end of matches for this day
      } else {
        start += batchSize;
      }

      // Rate limiting between batches within a day
      await new Promise(res => setTimeout(res, 2000)); // 2 second delay
    }

    // Rate limiting between days (more conservative)
    if (dayIndex < daysToScan.length - 1) {
      console.log(
        `[fetchAndStoreMatches] Waiting 4 seconds before scanning next day...`
      );
      await new Promise(res => setTimeout(res, 4000)); // 4 second delay between days
    }
  }

  console.log(
    `[fetchAndStoreMatches] Found ${allMatchIds.length} unique match IDs to process across ${daysToScan.length} days`
  );
  let mostRecentGameEnd = summonerDoc.lastFetchedGameEndTimestamp || 0;

  // Fetch and store each match with improved error handling
  for (const matchId of allMatchIds) {
    let retryCount = 0;
    const maxMatchRetries = 2;
    let matchProcessed = false;

    while (retryCount <= maxMatchRetries && !matchProcessed) {
      try {
        const match = await matchApi.getMatchById(matchId);

        // Check if match already exists to avoid duplicates
        const existing = await getMatchById(match.metadata.matchId);
        if (!existing) {
          await insertMatch(match);
          console.log(`[fetchAndStoreMatches] Stored new match: ${matchId}`);
        } else {
          console.log(
            `[fetchAndStoreMatches] Match already exists: ${matchId}`
          );
        }

        if (
          match.info?.gameEndTimestamp &&
          match.info.gameEndTimestamp > mostRecentGameEnd
        ) {
          // gameEndTimestamp from Riot API comes in milliseconds, convert to seconds for consistent storage
          // This ensures compatibility with our database schema which stores timestamps in seconds
          const timestampInSeconds = match.info.gameEndTimestamp > 10000000000 
            ? Math.floor(match.info.gameEndTimestamp / 1000) // Convert from milliseconds to seconds
            : match.info.gameEndTimestamp; // Already in seconds

          mostRecentGameEnd = timestampInSeconds;
        }

        matchProcessed = true;

        // Enhanced rate limiting for individual match requests
        console.log(
          `[fetchAndStoreMatches] Waiting 2.5 seconds before next match...`
        );
        await new Promise(res => setTimeout(res, 2500)); // Increased from 1200ms to 2500ms
      } catch (e: unknown) {
        retryCount++;

        if (e instanceof Error && e.message?.includes('Too Many Requests')) {
          const backoffTime = Math.min(
            15000 * Math.pow(2, retryCount - 1),
            120000
          ); // Exponential backoff, max 2 minutes
          console.log(
            `[fetchAndStoreMatches] Rate limit hit for match ${matchId}, retry ${retryCount}/${maxMatchRetries} in ${backoffTime}ms`
          );
          await new Promise(res => setTimeout(res, backoffTime));
        } else {
          console.error(
            `[fetchAndStoreMatches] Error processing match ${matchId}:`,
            e
          );
          break; // Don't retry for non-rate-limit errors
        }

        if (retryCount > maxMatchRetries) {
          console.error(
            `[fetchAndStoreMatches] Max retries exceeded for match ${matchId}, skipping`
          );
          break;
        }
      }
    }
  }

  // If we fetched all history, set fetchOldGames to true
  if (!summonerDoc.fetchOldGames && allMatchIds.length > 0) {
    await setFetchOldGames(platformRegion, name, tagline, true);
    console.log(
      `[fetchAndStoreMatches] Set fetchOldGames to true for ${name}#${tagline}`
    );
  }

  // Update the date of the most recent match
  if (
    mostRecentGameEnd &&
    mostRecentGameEnd > (summonerDoc.lastFetchedGameEndTimestamp || 0)
  ) {
    await setLastFetchedGameEndTimestamp(
      platformRegion,
      name,
      tagline,
      mostRecentGameEnd
    );
    console.log(
      `[fetchAndStoreMatches] Updated lastFetchedGameEndTimestamp to ${new Date(mostRecentGameEnd * 1000).toISOString()}`
    );
  }

  console.log(
    `[fetchAndStoreMatches] Completed: ${allMatchIds.length} matches processed for ${name}#${tagline}`
  );

  // Return the total number of stored matches
  return { totalFetched: allMatchIds.length };
}