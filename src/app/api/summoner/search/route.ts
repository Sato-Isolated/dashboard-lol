import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }
  const db = await connectToDatabase();
  const collection = db.collection("summoners");
  // Search by name (case-insensitive, starts with)
  const users = await collection
    .find({ name: { $regex: `^${q}`, $options: "i" } })
    .project({ name: 1, tagline: 1, region: 1, _id: 0 })
    .limit(8)
    .toArray();
  return NextResponse.json(users);
}
