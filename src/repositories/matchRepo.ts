// src/repositories/matchRepo.ts
import { MongoService } from "@/lib/MongoService";
import { MatchCollection } from "@/types/schema/MatchCollection";
import { Match } from "@/types/api/match";

export async function insertMatch(match: Match) {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection<MatchCollection>("matches");

  const matchDoc: MatchCollection = {
    ...match,
    _id: match.metadata.matchId,
  };

  try {
    await collection.insertOne(matchDoc);
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("duplicate key")) {
      // console.warn(`[Mongo] Match ${matchDoc._id} already exists.`);
    } else {
      throw e;
    }
  }
}

export async function getMatchById(
  matchId: string
): Promise<MatchCollection | null> {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection<MatchCollection>("matches");
  return collection.findOne({ _id: matchId });
}

/**
 * Récupère tous les matchs où au moins un participant a fait un double, triple, quadra ou pentakill.
 */
export async function getMultiKillMatches(): Promise<MatchCollection[]> {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection<MatchCollection>("matches");
  return collection
    .find({
      $or: [
        { "info.participants.doubleKills": { $gte: 1 } },
        { "info.participants.tripleKills": { $gte: 1 } },
        { "info.participants.quadraKills": { $gte: 1 } },
        { "info.participants.pentaKills": { $gte: 1 } },
      ],
    })
    .toArray();
}
