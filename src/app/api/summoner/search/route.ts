import { NextResponse } from 'next/server';
import { MongoService } from '@/lib/api/database/MongoService';
import { z } from 'zod';
import { withValidation } from '@/lib/validation/middleware';
import { logger } from '@/lib/logger/logger';

// Validation schema for search query
const searchSchema = z.object({
  q: z
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .optional()
    .default(''),
});

export const GET = withValidation(
  searchSchema,
  async (req, validatedData, _context) => {
    const { q } = validatedData;

    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection('summoners');

    // Search by name (case-insensitive, starts with)
    const users = await collection
      .find({ name: { $regex: `^${q.toLowerCase()}`, $options: 'i' } })
      .project({ name: 1, tagline: 1, region: 1, _id: 0 })
      .limit(8)
      .toArray();

    logger.info('Summoner search completed', {
      query: q,
      resultsCount: users.length,
    });

    return NextResponse.json(users);
  },
);
