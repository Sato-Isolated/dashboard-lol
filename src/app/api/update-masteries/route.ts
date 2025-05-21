import { NextRequest, NextResponse } from "next/server";
import { fetchAndStoreMasteries } from "@/scripts/fetchAndStoreMasteries";

// POST /api/update-masteries
export async function POST(req: NextRequest) {
  const { region, name, tagline } = await req.json();
  if (!region || !name || !tagline) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  try {
    // Correction de l'ordre des paramètres : name, tagline, region
    const result = await fetchAndStoreMasteries(name, tagline, region);
    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
