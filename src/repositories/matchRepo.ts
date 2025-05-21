// src/repositories/matchRepo.ts
import { connectToDatabase } from "@/lib/mongo";
import { MatchCollection } from "@/types/schema/MatchCollection";
import { Match } from "@/types/api/match";

export async function insertMatch(match: Match) {
  const db = await connectToDatabase();
  const collection = db.collection<MatchCollection>("matches");

  const matchDoc: MatchCollection = {
    ...match,
    _id: match.metadata.matchId,
  };

  try {
    await collection.insertOne(matchDoc);
  } catch (e: any) {
    if (e.code === 11000) {
      console.warn(`[Mongo] Match ${matchDoc._id} already exists.`);
    } else {
      throw e;
    }
  }
}

export async function getMatchById(matchId: string): Promise<MatchCollection | null> {
  const db = await connectToDatabase();
  return db.collection<MatchCollection>("matches").findOne({ _id: matchId });
}
