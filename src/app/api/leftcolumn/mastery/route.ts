import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

// GET /api/leftcolumn/mastery?name=...&region=...&tagline=...
export async function GET(req: NextRequest) {
  const url = new URL(req.url!);
  const name = url.searchParams.get("name");
  const region = url.searchParams.get("region");
  const tagline = url.searchParams.get("tagline");
  if (!name || !region || !tagline) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  const db = await connectToDatabase();
  const summoner = await db
    .collection("summoners")
    .findOne({ region, name, tagline });
  // DEBUG LOG
  console.log("[API mastery] Query:", { region, name, tagline });
  console.log("[API mastery] Summoner found:", summoner);
  if (!summoner || !summoner.championMastery) {
    return NextResponse.json([]);
  }
  // championMastery: { [championId]: { championLevel, championPoints } }
  const masteryArr = Object.entries(summoner.championMastery)
    .map(([championId, v]: any) => ({
      championId: Number(championId),
      championLevel: v.championLevel,
      championPoints: v.championPoints,
    }))
    .sort((a, b) => b.championPoints - a.championPoints)
    .slice(0, 3);
  return NextResponse.json(masteryArr);
}
