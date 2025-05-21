import { NextRequest, NextResponse } from "next/server";
import { fetchAndStoreMasteries } from "@/scripts/fetchAndStoreMasteries";
import { apiErrorHandler } from "@/utils/apiErrorHandler";

// POST /api/update-masteries
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
    // Correction de l'ordre des paramètres : name, tagline, region
    const result = await fetchAndStoreMasteries(name, tagline, region);
    return NextResponse.json({ success: true, result });
  } catch (e: unknown) {
    return apiErrorHandler(e);
  }
}
