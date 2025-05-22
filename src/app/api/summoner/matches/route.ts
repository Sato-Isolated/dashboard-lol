import { NextRequest, NextResponse } from "next/server";
import { fetchAndStoreMatches } from "@/scripts/fetchAndStoreMatches";
import { apiErrorHandler } from "@/utils/apiErrorHandler";
import { connectToDatabase } from "@/lib/mongo";

// POST /api/summoner/matches : refresh les matches depuis Riot et stocke en DB
export async function POST(req: NextRequest) {
  try {
    const { region, name, tagline } = await req.json();
    if (!region || !name || !tagline) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    const { totalFetched } = await fetchAndStoreMatches(region, name, tagline);
    return NextResponse.json({ success: true, totalFetched });
  } catch (e: unknown) {
    return apiErrorHandler(e);
  }
}

// GET /api/summoner/matches : lecture des matches stockés
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url!);
    const name = url.searchParams.get("name");
    const region = url.searchParams.get("region");
    const tagline = url.searchParams.get("tagline");
    const start = parseInt(url.searchParams.get("start") || "0", 10);
    const count = parseInt(url.searchParams.get("count") || "10", 10);
    const from = url.searchParams.get("from")
      ? parseInt(url.searchParams.get("from")!, 10)
      : undefined;
    const to = url.searchParams.get("to")
      ? parseInt(url.searchParams.get("to")!, 10)
      : undefined;

    if (!name || !region || !tagline) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const query: Record<string, unknown> = {
      "info.participants": { $elemMatch: { riotIdGameName: name } },
    };
    if (from || to) {
      const ts: Record<string, number> = {};
      if (from) ts.$gte = from;
      if (to) ts.$lt = to;
      query["info.gameEndTimestamp"] = ts;
    }

    const matches = await db
      .collection("matches")
      .find(query)
      .sort({ "info.gameEndTimestamp": -1 })
      .skip(start)
      .limit(count)
      .toArray();

    return NextResponse.json({ success: true, data: matches });
  } catch (e) {
    return apiErrorHandler(e);
  }
} 