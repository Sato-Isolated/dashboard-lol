import { NextResponse } from 'next/server';
import { MongoService } from '@/lib/api/database/MongoService';
import { z } from 'zod';
import { withValidation } from '@/lib/validation/middleware';

// Validation schema for leaderboard query
const leaderboardSchema = z.object({
  platform: z.string().optional(),
  limit: z.string().optional(),
});

// GET /api/aram-score-leaderboard?platform=euw1&limit=100
export const GET = withValidation(
  leaderboardSchema,
  async (req, validatedData, _context) => {
    const platform = validatedData.platform || 'euw1';
    const limit = validatedData.limit
      ? Math.min(parseInt(validatedData.limit), 1000)
      : 100;

    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection('summoners');

    // Get the top players by aramScore for the platform
    const leaderboard = await collection
      .find({ region: platform, aramScore: { $exists: true } })
      .sort({ aramScore: -1 })
      .limit(limit)
      .project({ _id: 0, name: 1, tagline: 1, aramScore: 1, region: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      leaderboard,
      platform,
      count: leaderboard.length,
    });
  },
);
