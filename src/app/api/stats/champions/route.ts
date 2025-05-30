import { NextResponse } from 'next/server';
import { MongoService } from '@/lib/api/database/MongoService';
import type { Match } from '@/types/api/matchTypes';
import { z } from 'zod';
import { withValidation } from '@/lib/validation/middleware';
import { NotFoundError } from '@/lib/globalErrorHandler';

// Validation schema
const championsStatsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  region: z.string().min(1, 'Region is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  minGames: z.coerce.number().min(1).default(1).optional(),
});

// GET /api/stats/champions?name=...&region=...&tagline=...&minGames=...
export const GET = withValidation(
  championsStatsSchema,
  async (req, validatedData, _context) => {
    const { name, region, tagline, minGames = 1 } = validatedData;

    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection<{ puuid: string }>(
      'summoners',
    );

    // Find summoner's puuid
    const summoner = await collection.findOne({ region, name, tagline });
    if (!summoner || !summoner.puuid) {
      throw new NotFoundError('Summoner', `${name}#${tagline} in ${region}`);
    }

    const puuid = summoner.puuid; // PHASE 2.1 OPTIMIZATION: Aggregate stats by champion using optimized pipeline
    const pipeline = [
      {
        $match: {
          'info.participants.puuid': puuid,
          'info.gameDuration': { $gte: 300 },
          'info.gameEndedInEarlySurrender': { $ne: true },
        },
      },
      // Unwind participants to process individual player data
      { $unwind: '$info.participants' },
      // Match only the specific player's data
      { $match: { 'info.participants.puuid': puuid } },
      // Group by champion with optimized aggregation
      {
        $group: {
          _id: '$info.participants.championName',
          games: { $sum: 1 },
          wins: {
            $sum: {
              $cond: ['$info.participants.win', 1, 0],
            },
          },
          kills: { $sum: '$info.participants.kills' },
          deaths: { $sum: '$info.participants.deaths' },
          assists: { $sum: '$info.participants.assists' },
          totalDamageDealtToChampions: {
            $sum: '$info.participants.totalDamageDealtToChampions',
          },
          goldEarned: { $sum: '$info.participants.goldEarned' },
        },
      },
      // Filter by minimum games
      {
        $match: {
          games: { $gte: minGames },
        },
      },
      // Sort by games played
      { $sort: { games: -1 } },
    ];

    const matchesCol = await mongo.getCollection<Match>('matches');
    const stats = await matchesCol.aggregate(pipeline).toArray();

    // Format output
    const result = stats.map(s => ({
      champion: s._id,
      games: s.games,
      wins: s.wins,
      losses: s.games - s.wins,
      winRate: ((s.wins / s.games) * 100).toFixed(1),
      kills: s.kills,
      deaths: s.deaths,
      assists: s.assists,
      kda:
        s.deaths === 0
          ? s.kills + s.assists
          : Number(((s.kills + s.assists) / s.deaths).toFixed(2)),
      avgKills: Number((s.kills / s.games).toFixed(1)),
      avgDeaths: Number((s.deaths / s.games).toFixed(1)),
      avgAssists: Number((s.assists / s.games).toFixed(1)),
      avgDamage: s.totalDamageDealtToChampions
        ? Number((s.totalDamageDealtToChampions / s.games).toFixed(0))
        : 0,
      avgGold: s.goldEarned ? Number((s.goldEarned / s.games).toFixed(0)) : 0,
    }));

    return NextResponse.json({
      success: true,
      data: result,
      totalChampions: result.length,
      totalGames: result.reduce((sum, champion) => sum + champion.games, 0),
    });
  },
);
