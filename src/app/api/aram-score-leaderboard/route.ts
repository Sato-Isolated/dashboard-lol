import { NextRequest, NextResponse } from "next/server";
import { MongoService } from "@/lib/MongoService";

// GET /api/aram-score-leaderboard?platform=euw1
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url!);
    const platform = url.searchParams.get("platform") || "euw1";
    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection("summoners");
    // On récupère les 100 meilleurs joueurs par aramScore pour la plateforme
    const leaderboard = await collection
      .find({ region: platform, aramScore: { $exists: true } })
      .sort({ aramScore: -1 })
      .limit(100)
      .project({ _id: 0, name: 1, aramScore: 1 })
      .toArray();
    return NextResponse.json({ success: true, leaderboard });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
