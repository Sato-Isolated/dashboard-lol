// src/app/api/update-matches/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchAndStoreMatches } from "@/scripts/fetchAndStoreMatches";

// POST /api/update-matches
export async function POST(req: NextRequest) {
  try {
    const { region, name, tagline } = await req.json();
    if (!region || !name || !tagline) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    // Lancer la récupération côté serveur (Node)
    await fetchAndStoreMatches(region, name, tagline, 100);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
