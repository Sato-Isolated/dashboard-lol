import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { apiErrorHandler } from "@/utils/apiErrorHandler";

// GET /api/leftcolumn/recently-played?name=...&region=...&tagline=...&limit=5
export async function GET(req: NextRequest) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }
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
    const db = await connectToDatabase();
    // Find summoner's puuid
    const summoner = await db
      .collection("summoners")
      .findOne({ region, name, tagline });
    // DEBUG LOG
    console.log("[API recently-played] Query:", { region, name, tagline });
    console.log("[API recently-played] Summoner found:", summoner);
    if (!summoner || !summoner.puuid) {
      return NextResponse.json([], { status: 404 });
    }
    const puuid = summoner.puuid;
    // Aggregate teammates from matches
    const pipeline = [
      { $match: { "info.participants.puuid": puuid } },
      { $sort: { "info.gameEndTimestamp": -1 } },
      { $limit: 100 }, // recent 100 games for performance
      { $unwind: "$info.participants" },
      { $match: { "info.participants.puuid": { $ne: puuid } } },
      {
        $group: {
          _id: {
            name: "$info.participants.riotIdGameName",
            tagline: "$info.participants.riotIdTagline",
          },
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
    const result = teammates.map((t) => ({
      name: t._id.name,
      tagline: t._id.tagline,
      games: t.games,
      wins: t.wins,
      winrate: t.games > 0 ? Math.round((t.wins / t.games) * 100) : 0,
    }));
    return NextResponse.json(result);
  } catch (e: unknown) {
    return apiErrorHandler(e);
  }
}
