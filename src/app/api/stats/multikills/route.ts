import { NextResponse } from "next/server";
import { getMultiKillMatches } from "@/repositories/matchRepo";

export async function GET() {
  try {
    const matches = await getMultiKillMatches();

    // Pour chaque match, on extrait les badges de chaque participant
    const matchesWithBadges = matches.map((match) => {
      const participantsWithBadges = match.info.participants.map((p) => {
        const badges: string[] = [];
        if (p.doubleKills && p.doubleKills > 0) badges.push("doublekill");
        if (p.tripleKills && p.tripleKills > 0) badges.push("triplekill");
        if (p.quadraKills && p.quadraKills > 0) badges.push("quadrakill");
        if (p.pentaKills && p.pentaKills > 0) badges.push("pentakill");
        return {
          summonerName: p.summonerName,
          puuid: p.puuid,
          badges,
        };
      });
      return {
        matchId: match.metadata.matchId,
        participants: participantsWithBadges,
      };
    });

    return NextResponse.json({ matches: matchesWithBadges });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
