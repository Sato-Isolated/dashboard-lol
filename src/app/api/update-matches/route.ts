// src/app/api/update-matches/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchAndStoreMatches } from "@/scripts/fetchAndStoreMatches";
import { apiErrorHandler } from "@/utils/apiErrorHandler";

// POST /api/update-matches
export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }
    const { region, name, tagline } = await req.json();
    if (!region || !name || !tagline) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    const { totalFetched } = await fetchAndStoreMatches(
      region,
      name,
      tagline,
      100
    );
    return NextResponse.json({ ok: true, totalFetched });
  } catch (e: unknown) {
    return apiErrorHandler(e);
  }
}
