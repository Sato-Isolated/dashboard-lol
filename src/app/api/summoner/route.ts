import { NextRequest, NextResponse } from "next/server";
import { fetchSummonerFull } from "@/lib/summoner";

// GET /api/summoner?region=...&name=...&tagline=...
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url!);
    const name = url.searchParams.get("name");
    const region = url.searchParams.get("region");
    const tagline = url.searchParams.get("tagline");
    if (!name || !region || !tagline) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    const data = await fetchSummonerFull(region, name, tagline);
    if (!data) {
      return NextResponse.json({ error: "Summoner not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
} 