import { NextRequest, NextResponse } from "next/server";
import { getSummoner } from "@/repositories/summonerRepo";
import { AramScoreService } from "@/services/aramScoreService";
import type { SummonerCollection } from "@/types/schema/SummonerCollection";

// GET /api/summoner/aram-score?region=...&name=...&tagline=...
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url!);
    const name = url.searchParams.get("name");
    const region = url.searchParams.get("region");
    const tagline = url.searchParams.get("tagline");
    if (!name || !region || !tagline) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    const summoner = (await getSummoner(
      region,
      name,
      tagline
    )) as SummonerCollection | null;
    if (!summoner) {
      return NextResponse.json(
        { error: "Summoner not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      aramScore: summoner.aramScore ?? 0,
      aramScoreFirstCalculated: !!summoner.aramScoreFirstCalculated,
      aramScoreLastCheck: summoner.aramScoreLastCheck ?? null,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST /api/summoner/aram-score { region, name, tagline }
export async function POST(req: NextRequest) {
  try {
    const { region, name, tagline } = await req.json();
    if (!name || !region || !tagline) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    const result = await AramScoreService.syncAramScore(region, name, tagline);
    return NextResponse.json({ success: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
