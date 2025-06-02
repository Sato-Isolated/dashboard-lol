import { NextResponse } from 'next/server';
import { fetchAndStoreMatches } from '@/lib/data/fetchAndStoreMatches';
import { MongoService } from '@/lib/api/database/MongoService';
import { withValidation } from '@/lib/validation/middleware';
import { logger } from '@/lib/logger/logger';
import { z } from 'zod';

// Utility function to get recently played players
async function getRecentlyPlayed({
  region,
  name,
  tagline,
  limit,
}: {
  region: string;
  name: string;
  tagline: string;
  limit: number;
}) {
  const mongo = MongoService.getInstance();
  const db = await mongo.connect();
  // Find summoner's puuid
  const summoner = await db
    .collection('summoners')
    .findOne({ region, name, tagline });
  if (!summoner || !summoner.puuid) {
    return [];
  }
  const puuid = summoner.puuid; // PHASE 2.1 OPTIMIZATION: Aggregate teammates from matches using optimized pipeline
  const pipeline = [
    // First match: Use optimized index for player's matches
    { $match: { 'info.participants.puuid': puuid } },
    // Sort by recent matches for better query performance
    { $sort: { 'info.gameEndTimestamp': -1 } },
    // Limit to recent games for performance (optimized from 100 to focus on recent data)
    { $limit: 100 },
    // Unwind participants to process each player
    { $unwind: '$info.participants' },
    // Filter out the current player
    { $match: { 'info.participants.puuid': { $ne: puuid } } },
    // Group by teammate PUUID with optimized aggregation
    {
      $group: {
        _id: '$info.participants.puuid',
        name: { $first: '$info.participants.riotIdGameName' },
        tagline: { $first: '$info.participants.riotIdTagline' },
        games: { $sum: 1 },
        wins: {
          $sum: {
            $cond: [{ $eq: ['$info.participants.win', true] }, 1, 0],
          },
        },
      },
    },
    // Sort by games played (most frequent teammates first)
    { $sort: { games: -1 } },
    { $limit: limit },
  ];
  const teammates = await db
    .collection('matches')
    .aggregate(pipeline)
    .toArray();
  // Format output
  return teammates.map(t => ({
    puuid: t._id,
    name: t.name,
    tagline: t.tagline,
    games: t.games,
    wins: t.wins,
    winrate: t.games > 0 ? Math.round((t.wins / t.games) * 100) : 0,
  }));
}

// GET /api/summoner/recently-played?name=...&region=...&tagline=...&limit=5
const getRecentlyPlayedSchema = z.object({
  name: z.string().min(1),
  region: z.string().min(1),
  tagline: z.string().min(1),
  limit: z.coerce.number().min(1).max(20).default(5).optional(),
});

export const GET = withValidation(
  getRecentlyPlayedSchema,
  async (req, validatedData, _context) => {
    const { name, region, tagline, limit = 5 } = validatedData;

    logger.info('Fetching recently played', {
      region,
      name,
      tagline,
      limit,
    });

    const result = await getRecentlyPlayed({
      region,
      name,
      tagline,
      limit,
    });

    return NextResponse.json({ success: true, data: result });
  },
);

// POST /api/summoner/recently-played (triggers a real update)
const postRecentlyPlayedSchema = z.object({
  name: z.string().min(1),
  region: z.string().min(1),
  tagline: z.string().min(1),
});

export const POST = withValidation(
  postRecentlyPlayedSchema,
  async (req, validatedData, _context) => {
    const { region, name, tagline } = validatedData;

    logger.info('Updating recently played matches', {
      region,
      name,
      tagline,
    });

    // Fetch and store recent matches (this updates the DB)
    const { totalFetched } = await fetchAndStoreMatches(region, name, tagline);

    return NextResponse.json({
      success: true,
      message: `Update successful (${totalFetched} matches fetched)`,
      totalFetched,
    });
  },
);
