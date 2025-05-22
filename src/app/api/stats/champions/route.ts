import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

// GET /api/stats/champions?name=...&region=...&tagline=...
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url!);
    const name = url.searchParams.get("name");
    const region = url.searchParams.get("region");
    const tagline = url.searchParams.get("tagline");
    if (!name || !region || !tagline) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    const db = await connectToDatabase();
    // Find summoner's puuid
    const summoner = await db
      .collection("summoners")
      .findOne({ region, name, tagline });
    if (!summoner || !summoner.puuid) {
      return NextResponse.json([], { status: 404 });
    }
    const puuid = summoner.puuid;
    // Aggregate stats by champion
    const pipeline = [
      { $match: {
          "info.participants.puuid": puuid,
          "info.gameDuration": { $gte: 300 },
          "info.gameEndedInEarlySurrender": { $ne: true }
        }
      },
      { $unwind: "$info.participants" },
      { $match: { "info.participants.puuid": puuid } },
      {
        $group: {
          _id: "$info.participants.championName",
          games: { $sum: 1 },
          wins: {
            $sum: {
              $cond: ["$info.participants.win", 1, 0],
            },
          },
          kills: { $sum: "$info.participants.kills" },
          deaths: { $sum: "$info.participants.deaths" },
          assists: { $sum: "$info.participants.assists" },
        },
      },
      { $sort: { games: -1 } },
    ];
    const stats = await db.collection("matches").aggregate(pipeline).toArray();
    // Format output
    const result = stats.map((s) => ({
      champion: s._id,
      games: s.games,
      wins: s.wins,
      kills: s.kills,
      deaths: s.deaths,
      assists: s.assists,
      kda: s.deaths === 0 ? s.kills + s.assists : (s.kills + s.assists) / s.deaths,
    }));
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
} 