import { NextResponse } from 'next/server';
import { getSummoner } from '@/features/summoner/services/summonerRepository';
import { AramScoreService } from '@/features/aram/services/aramScoreService';
import type { SummonerCollection } from '@/features/summoner/types/summonerTypes';
import { withValidation } from '@/lib/validation/middleware';
import { logger } from '@/lib/logger/logger';
import { z } from 'zod';

// GET /api/summoner/aram-score?region=...&name=...&tagline=...
const aramScoreGetSchema = z.object({
  name: z.string().min(1),
  region: z.string().min(1),
  tagline: z.string().min(1),
});

export const GET = withValidation(
  aramScoreGetSchema,
  async (req, validatedData, _context) => {
    const { name, region, tagline } = validatedData;

    logger.info('Fetching ARAM score', { region, name, tagline });

    const summoner = (await getSummoner(
      region,
      name,
      tagline,
    )) as SummonerCollection | null;

    if (!summoner) {
      return NextResponse.json(
        { error: 'Summoner not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      aramScore: summoner.aramScore ?? 0,
      aramScoreFirstCalculated: !!summoner.aramScoreFirstCalculated,
      aramScoreLastCheck: summoner.aramScoreLastCheck ?? null,
    });
  },
);

// POST /api/summoner/aram-score { region, name, tagline }
const aramScorePostSchema = z.object({
  name: z.string().min(1),
  region: z.string().min(1),
  tagline: z.string().min(1),
});

export const POST = withValidation(
  aramScorePostSchema,
  async (req, validatedData, _context) => {
    const { region, name, tagline } = validatedData;

    logger.info('Syncing ARAM score', { region, name, tagline });

    const result = await AramScoreService.syncAramScore(region, name, tagline);

    return NextResponse.json({ success: true, ...result });
  },
);
