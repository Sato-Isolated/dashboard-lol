import { NextResponse } from 'next/server';
import { fetchAndStoreMasteries } from '@/lib/data/fetchAndStoreMasteries';
import { MongoService } from '@/lib/api/database/MongoService';
import { z } from 'zod';
import { withValidation, withMiddleware } from '@/lib/validation/middleware';

// Validation schemas
const masteriesBodySchema = z.object({
  region: z.string().min(1, 'Region is required'),
  name: z.string().min(1, 'Name is required'),
  tagline: z.string().min(1, 'Tagline is required'),
});

const masteriesQuerySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  region: z.string().min(1, 'Region is required'),
  tagline: z.string().min(1, 'Tagline is required'),
});

// POST /api/summoner/masteries: refresh masteries from Riot and store in DB
export const POST = withMiddleware(masteriesBodySchema, {
  rateLimit: {
    windowMs: 2 * 60 * 1000, // 2 minutes
    maxRequests: 5, // 5 requests per 2 minutes
  },
})(async (req, validatedData) => {
  const { region, name, tagline } = validatedData;

  // Fix parameter order: name, tagline, region
  await fetchAndStoreMasteries(name, tagline, region);

  return NextResponse.json({
    success: true,
    message: 'Masteries updated',
  });
});

// GET /api/summoner/masteries: read stored masteries
export const GET = withValidation(
  masteriesQuerySchema,
  async (req, validatedData, _context) => {
    const { name, region, tagline } = validatedData;

    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection<{
      championMastery?: Record<
        string,
        { championLevel: number; championPoints: number }
      >;
    }>('summoners');

    const summoner = await collection.findOne({ region, name, tagline });

    if (!summoner || !summoner.championMastery) {
      return NextResponse.json({ success: true, data: [] });
    }

    // championMastery: { [championId]: { championLevel, championPoints } }
    const masteryArr = Object.entries(summoner.championMastery)
      .map(([championId, v]) => {
        const mastery = v as { championLevel: number; championPoints: number };
        return {
          championId: Number(championId),
          championLevel: mastery.championLevel,
          championPoints: mastery.championPoints,
        };
      })
      .sort((a, b) => b.championPoints - a.championPoints);

    return NextResponse.json({ success: true, data: masteryArr });
  },
);
