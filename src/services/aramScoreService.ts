import { connectToDatabase } from "@/lib/mongo";
import { getSummoner } from "@/repositories/summonerRepo";
import type { Participant } from "@/types/api/match";

/**
 * Calcule un score ARAM unique pour un joueur sur une partie.
 */
export function computeAramScore(
  participant: Participant,
  teamParticipants: Participant[]
): number {
  // Points de base
  const BASE_WIN = 20;
  const BASE_LOSS = -15;

  // Moyennes d'équipe
  const avgDamage = teamParticipants.reduce((a, p) => a + p.totalDamageDealtToChampions, 0) / teamParticipants.length;
  const avgHeal = teamParticipants.reduce((a, p) => a + (p.challenges?.effectiveHealAndShielding ?? 0), 0) / teamParticipants.length;
  const avgTank = teamParticipants.reduce((a, p) => a + p.totalDamageTaken, 0) / teamParticipants.length;

  // KDA pondéré (évite l'anti-jeu)
  const kda = (participant.kills + participant.assists) / Math.max(1, participant.deaths);
  const kdaScore = Math.min(10, kda * 2);

  // Dégâts infligés (comparé à la moyenne de l'équipe)
  const damageScore = Math.min(10, (participant.totalDamageDealtToChampions / (avgDamage || 1)) * 5);

  // Participation aux kills (0 à 1)
  const killParticipation = participant.challenges?.killParticipation ?? 0;
  const kpScore = Math.round(killParticipation * 8);

  // Soins ou tanking (prend le max des deux, utile pour supports/tanks)
  const healScore = avgHeal > 0 ? Math.min(5, (participant.challenges?.effectiveHealAndShielding ?? 0) / (avgHeal || 1) * 3) : 0;
  const tankScore = avgTank > 0 ? Math.min(5, (participant.totalDamageTaken / (avgTank || 1)) * 3) : 0;
  const supportTankScore = Math.max(healScore, tankScore);

  // Score total
  let points = participant.win
    ? BASE_WIN + kdaScore + damageScore + kpScore + supportTankScore
    : BASE_LOSS + kdaScore + damageScore + kpScore + supportTankScore;

  // Clamp : jamais positif en défaite, jamais plus de 40 en win
  if (participant.win) points = Math.min(points, 40);
  else points = Math.max(Math.min(points, -1), -15);

  return Math.round(points);
}

export class AramScoreService {
  static async shouldCalculateAramScore(summoner: any): Promise<boolean> {
    return !summoner.aramScoreFirstCalculated;
  }

  static async calculateAramScore(region: string, name: string, tagline: string): Promise<number> {
    const summoner = await getSummoner(region, name, tagline);
    if (!summoner || !summoner.puuid) throw new Error("Summoner or puuid not found");
    const puuid = summoner.puuid;
    const db = await connectToDatabase();
    const matches = await db.collection("matches").find({
      "info.gameMode": "ARAM",
      "info.participants.puuid": puuid
    }).toArray();
    let totalScore = 0;
    for (const match of matches) {
      const participant = match.info.participants.find((p: any) => p.puuid === puuid);
      if (!participant) continue;
      // Trouver l'équipe du participant
      const teamId = participant.teamId;
      const teamParticipants = match.info.participants.filter((p: any) => p.teamId === teamId);
      const score = computeAramScore(participant, teamParticipants);
      totalScore += score;
      console.log(`[ARAMScore] Match ${match.metadata?.matchId || "?"} : ${score} points (${participant.win ? "win" : "loss"})`);
    }
    console.log(`[ARAMScore] Calculated for ${name}#${tagline} (puuid: ${puuid}): ${totalScore} total points on ${matches.length} ARAM games`);
    return totalScore;
  }

  static async updateAramScore(region: string, name: string, tagline: string, score: number): Promise<void> {
    const db = await connectToDatabase();
    await db.collection("summoners").updateOne(
      { region, name, tagline },
      {
        $set: {
          aramScore: score,
          aramScoreFirstCalculated: true,
          aramScoreLastCheck: Date.now()
        }
      }
    );
  }

  static async syncAramScore(region: string, name: string, tagline: string) {
    const summoner = await getSummoner(region, name, tagline);
    if (!summoner) throw new Error("Summoner not found");

    // Cast pour accéder aux champs custom
    const aramScoreFirstCalculated = (summoner as any)["aramScoreFirstCalculated"];
    const aramScoreLastCheck = (summoner as any)["aramScoreLastCheck"];
    const aramScore = (summoner as any)["aramScore"];

    if (!aramScoreFirstCalculated) {
      const score = await this.calculateAramScore(region, name, tagline);
      await this.updateAramScore(region, name, tagline, score);
      return {
        aramScore: score,
        aramScoreFirstCalculated: true,
        aramScoreLastCheck: Date.now(),
        calculated: true,
      };
    } else {
      return {
        aramScore: aramScore ?? 0,
        aramScoreFirstCalculated: true,
        aramScoreLastCheck: aramScoreLastCheck ?? null,
        calculated: false,
      };
    }
  }
} 