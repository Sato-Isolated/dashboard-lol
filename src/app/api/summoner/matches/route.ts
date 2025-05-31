import { NextResponse } from 'next/server';
import { fetchAndStoreMatches } from '@/lib/data/fetchAndStoreMatches';
import { MongoService } from '@/lib/api/database/MongoService';
import { z } from 'zod';
import { withValidation, withMiddleware } from '@/lib/validation/middleware';

// Validation schemas
const postMatchesSchema = z.object({
  region: z.string().min(1, 'Region is required'),
  name: z.string().min(1, 'Name is required'),
  tagline: z.string().min(1, 'Tagline is required'),
});

const getMatchesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  region: z.string().min(1, 'Region is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  start: z.string().optional(),
  count: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

// POST /api/summoner/matches: refresh matches from Riot and store in DB
export const POST = withMiddleware(postMatchesSchema, {
  rateLimit: {
    windowMs: 10 * 60 * 1000, // 10 minutes (increased from 5)
    maxRequests: 5, // 5 requests per 10 minutes (reduced from 10 per 5 minutes)
  },
})(async (req, validatedData) => {
  const { region, name, tagline } = validatedData;

  console.log(`[API] Starting match fetch for ${name}#${tagline} in ${region}`);

  try {
    const { totalFetched } = await fetchAndStoreMatches(region, name, tagline);

    console.log(
      `[API] Successfully fetched ${totalFetched} matches for ${name}#${tagline}`
    );
    return NextResponse.json({ success: true, totalFetched });
  } catch (error) {
    console.error(
      `[API] Error fetching matches for ${name}#${tagline}:`,
      error
    );

    // Return appropriate error response
    if (
      error instanceof Error &&
      error.message?.includes('Too Many Requests')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch matches. Please try again later.',
      },
      { status: 500 }
    );
  }
});

// GET /api/summoner/matches: read stored matches
export const GET = withValidation(
  getMatchesSchema,
  async (req, validatedData, _context) => {
    const { name } = validatedData;
    const start = parseInt(validatedData.start || '0', 10);
    const count = parseInt(validatedData.count || '10', 10);
    const from = validatedData.from
      ? parseInt(validatedData.from, 10)
      : undefined;
    const to = validatedData.to ? parseInt(validatedData.to, 10) : undefined;
    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection('matches');

    // PHASE 2.1 OPTIMIZATION: Use optimized query pattern for array field queries
    // Instead of using $elemMatch, query the array field directly for better index usage
    const query: Record<string, unknown> = {
      'info.participants.riotIdGameName': name, // Direct array field query
    };

    if (from || to) {
      const ts: Record<string, number> = {};
      if (from) {
        ts.$gte = from;
      }
      if (to) {
        ts.$lt = to;
      }
      query['info.gameEndTimestamp'] = ts;
    }

    // PHASE 2.1 OPTIMIZATION: Use optimized sort and hint for index usage
    const matches = await collection
      .find(query)
      .sort({ 'info.gameEndTimestamp': -1 }) // Use indexed field for sorting
      .skip(start)
      .limit(count)
      .toArray();

    return NextResponse.json({ success: true, data: matches });
  }
);
