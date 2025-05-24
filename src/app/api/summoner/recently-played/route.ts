import { NextRequest, NextResponse } from "next/server";
import { apiErrorHandler } from "@/utils/apiErrorHandler";
import { fetchAndStoreMatches } from "@/scripts/fetchAndStoreMatches";
import { MongoService } from "@/lib/MongoService";

// Utility function to get recently played players
async function getRecentlyPlayed({
  region,
  name,
  tagline,
  limit,
}: {
  region: string;
  name: string;
  tagline: string;
  limit: number;
}) {
  const mongo = MongoService.getInstance();
  const db = await mongo.connect();
  // Find summoner's puuid
  const summoner = await db
    .collection("summoners")
    .findOne({ region, name, tagline });
  if (!summoner || !summoner.puuid) {
    return [];
  }
  const puuid = summoner.puuid;
  // Aggregate teammates from matches
  const pipeline = [
    { $match: { "info.participants.puuid": puuid } },
    { $sort: { "info.gameEndTimestamp": -1 } },
    { $limit: 100 }, // last 100 games for performance
    { $unwind: "$info.participants" },
    { $match: { "info.participants.puuid": { $ne: puuid } } },
    { $sort: { "info.participants.puuid": 1, "info.gameEndTimestamp": -1 } },
    {
      $group: {
        _id: "$info.participants.puuid",
        name: { $first: "$info.participants.riotIdGameName" },
        tagline: { $first: "$info.participants.riotIdTagline" },
        games: { $sum: 1 },
        wins: {
          $sum: {
            $cond: [{ $eq: ["$info.participants.win", true] }, 1, 0],
          },
        },
      },
    },
    { $sort: { games: -1 } },
    { $limit: limit },
  ];
  const teammates = await db
    .collection("matches")
    .aggregate(pipeline)
    .toArray();
  // Format output
  return teammates.map((t) => ({
    puuid: t._id,
    name: t.name,
    tagline: t.tagline,
    games: t.games,
    wins: t.wins,
    winrate: t.games > 0 ? Math.round((t.wins / t.games) * 100) : 0,
  }));
}

// GET /api/summoner/recently-played?name=...&region=...&tagline=...&limit=5
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url!);
    const name = url.searchParams.get("name");
    const region = url.searchParams.get("region");
    const tagline = url.searchParams.get("tagline");
    const limit = parseInt(url.searchParams.get("limit") || "5", 10);
    if (!name || !region || !tagline) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    // Décodage des paramètres pour supporter les espaces et caractères spéciaux
    const decodedName = decodeURIComponent(name);
    const decodedTagline = decodeURIComponent(tagline);
    const result = await getRecentlyPlayed({
      region,
      name: decodedName,
      tagline: decodedTagline,
      limit,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (e: unknown) {
    return apiErrorHandler(e);
  }
}

// POST /api/summoner/recently-played (triggers a real update)
export async function POST(req: NextRequest) {
  try {
    const { region, name, tagline } = await req.json();
    if (!region || !name || !tagline) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    // Fetch and store recent matches (this updates the DB)
    const { totalFetched } = await fetchAndStoreMatches(region, name, tagline);
    return NextResponse.json({
      success: true,
      message: `Update successful (${totalFetched} matches fetched)`,
      totalFetched,
    });
  } catch (e: unknown) {
    return apiErrorHandler(e);
  }
}
