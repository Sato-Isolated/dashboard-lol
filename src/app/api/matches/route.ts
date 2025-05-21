// src/app/api/matches/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

// GET /api/matches?name=RafaleDeBlanche&region=euw1&tagline=EUW&start=0&count=10&from=timestamp&to=timestamp
export async function GET(req: NextRequest) {
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

  try {
    const db = await connectToDatabase();
    const query: Record<string, unknown> = {
      "info.participants": { $elemMatch: { riotIdGameName: name } },
    };
    if (from || to) {
      query["info.gameEndTimestamp"] = {};
      if (from) query["info.gameEndTimestamp"].$gte = from;
      if (to) query["info.gameEndTimestamp"].$lt = to;
    }

    const matches = await db
      .collection("matches")
      .find(query)
      .sort({ "info.gameEndTimestamp": -1 })
      .skip(start)
      .limit(count)
      .toArray();

    return NextResponse.json(matches);
  } catch {
    // Fallback explicite si la DB ou l'API est en erreur
    return NextResponse.json(
      {
        error:
          "Impossible de récupérer les matchs. L'API Riot ou la base de données est peut-être indisponible. Réessayez plus tard.",
      },
      { status: 502 }
    );
  }
}
