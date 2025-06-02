import { NextResponse } from 'next/server';
import { fetchSummonerFull } from '@/features/summoner/services/summonerDataService';
import { z } from 'zod';
import { withMiddleware } from '@/lib/validation/middleware';
import { NotFoundError } from '@/lib/globalErrorHandler';

// Validation schema for summoner query
const summonerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  region: z.string().min(1, 'Region is required'),
  tagline: z.string().min(1, 'Tagline is required'),
});

// GET /api/summoner?region=...&name=...&tagline=...
export const GET = withMiddleware(summonerSchema, {
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
})(async (req, validatedData) => {
  const { name, region, tagline } = validatedData;

  const data = await fetchSummonerFull(region, name, tagline);

  if (!data) {
    throw new NotFoundError('Summoner', `${name}#${tagline} in ${region}`);
  }

  return NextResponse.json({ success: true, data });
});
