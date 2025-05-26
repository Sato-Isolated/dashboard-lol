import { NextResponse } from "next/server";
import { fetchAndStoreMatches } from "@/scripts/fetchAndStoreMatches";
import { MongoService } from "@/shared/services/database/MongoService";
import { z } from "zod";
import { withValidation, withMiddleware } from "@/shared/lib/validation/middleware";

// Validation schemas
const postMatchesSchema = z.object({
  region: z.string().min(1, "Region is required"),
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
});

const getMatchesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  region: z.string().min(1, "Region is required"),
  tagline: z.string().min(1, "Tagline is required"),
  start: z.string().optional(),
  count: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

// POST /api/summoner/matches: refresh matches from Riot and store in DB
export const POST = withMiddleware(postMatchesSchema, {
  rateLimit: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10, // 10 requests per 5 minutes (heavy operation)
  },
})(async (req, validatedData) => {
  const { region, name, tagline } = validatedData;

  const { totalFetched } = await fetchAndStoreMatches(region, name, tagline);

  return NextResponse.json({ success: true, totalFetched });
});

// GET /api/summoner/matches: read stored matches
export const GET = withValidation(
  getMatchesSchema,
  async (req, validatedData, _context) => {
    const { name } = validatedData;
    const start = parseInt(validatedData.start || "0", 10);
    const count = parseInt(validatedData.count || "10", 10);
    const from = validatedData.from
      ? parseInt(validatedData.from, 10)
      : undefined;
    const to = validatedData.to ? parseInt(validatedData.to, 10) : undefined;

    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection("matches");

    const query: Record<string, unknown> = {
      "info.participants": { $elemMatch: { riotIdGameName: name } },
    };

    if (from || to) {
      const ts: Record<string, number> = {};
      if (from) ts.$gte = from;
      if (to) ts.$lt = to;
      query["info.gameEndTimestamp"] = ts;
    }

    const matches = await collection
      .find(query)
      .sort({ "info.gameEndTimestamp": -1 })
      .skip(start)
      .limit(count)
      .toArray();

    return NextResponse.json({ success: true, data: matches });
  }
);
