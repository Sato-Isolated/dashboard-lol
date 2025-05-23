import { NextRequest, NextResponse } from "next/server";
import { fetchAndStoreMasteries } from "@/scripts/fetchAndStoreMasteries";
import { apiErrorHandler } from "@/utils/apiErrorHandler";
import { MongoService } from "@/lib/MongoService";

// POST /api/summoner/masteries : refresh les masteries depuis Riot et stocke en DB
export async function POST(req: NextRequest) {
  try {
    const { region, name, tagline } = await req.json();
    if (!region || !name || !tagline) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    // Correction de l'ordre des paramètres : name, tagline, region
    await fetchAndStoreMasteries(name, tagline, region);
    return NextResponse.json({
      success: true,
      message: "Masteries mises à jour",
    });
  } catch (e: unknown) {
    return apiErrorHandler(e);
  }
}

// GET /api/summoner/masteries : lecture des masteries stockées
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
    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection<any>("summoners");
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
  } catch (e: unknown) {
    return apiErrorHandler(e);
  }
}
