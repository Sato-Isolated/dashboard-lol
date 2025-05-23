import { MongoService } from "@/lib/MongoService";
import { getSummoner } from "@/repositories/summonerRepo";
import type { Participant } from "@/types/api/match";
import type { SummonerCollection } from "@/types/schema/SummonerCollection";

/**
 * Calcule un score ARAM unique pour un joueur sur une partie.
 */
/**
 * Calcule un score personnalisé pour un participant en ARAM, basé sur ses performances individuelles
 * et la moyenne de son équipe. Le score prend en compte la victoire/défaite, le KDA, les dégâts infligés,
 * la participation aux kills, ainsi que le rôle de support ou tank (soins ou dégâts subis).
 *
 * - Victoire : base de +20 points, plafonné à 40.
 * - Défaite : base de -20 points, jamais positif, minimum -40.
 * - KDA pondéré : (kills + assists) / deaths, multiplié par 2, max 10 points.
 * - Dégâts infligés : comparé à la moyenne de l'équipe, max 10 points.
 * - Participation aux kills : killParticipation * 8, arrondi, max 8 points.
 * - Support/Tank : prend le meilleur score entre soins (comparé à la moyenne) et tanking (dégâts subis), max 5 points.
 *
 * @param participant Le participant dont on veut calculer le score.
 * @param teamParticipants Les membres de l'équipe du participant (pour calculer les moyennes).
 * @returns Le score ARAM calculé, arrondi à l'entier le plus proche.
 */
export function computeAramScore(
  participant: Participant,
  teamParticipants: Participant[]
): number {
  // Points de base plus stricts
  const BASE_WIN = 15;
  const BASE_LOSS = -25;

  // Moyennes d'équipe
  const avgDamage =
    teamParticipants.reduce((a, p) => a + p.totalDamageDealtToChampions, 0) /
    teamParticipants.length;
  const avgHeal =
    teamParticipants.reduce(
      (a, p) => a + (p.challenges?.effectiveHealAndShielding ?? 0),
      0
    ) / teamParticipants.length;
  const avgTank =
    teamParticipants.reduce((a, p) => a + p.totalDamageTaken, 0) /
    teamParticipants.length;

  // KDA pondéré (plus strict)
  const kda =
    (participant.kills + participant.assists) / Math.max(1, participant.deaths);
  const kdaScore = Math.min(7, kda * 1.5);

  // Dégâts infligés (plus strict)
  const damageScore = Math.min(
    7,
    (participant.totalDamageDealtToChampions / (avgDamage || 1)) * 3
  );

  // Participation aux kills (plus strict)
  const killParticipation = participant.challenges?.killParticipation ?? 0;
  const kpScore = Math.round(killParticipation * 6);

  // Soins ou tanking (plus strict)
  const healScore =
    avgHeal > 0
      ? Math.min(
          3,
          ((participant.challenges?.effectiveHealAndShielding ?? 0) /
            (avgHeal || 1)) *
            2
        )
      : 0;
  const tankScore =
    avgTank > 0
      ? Math.min(3, (participant.totalDamageTaken / (avgTank || 1)) * 2)
      : 0;
  const supportTankScore = Math.max(healScore, tankScore);

  // Score total
  let points = participant.win
    ? BASE_WIN + kdaScore + damageScore + kpScore + supportTankScore
    : BASE_LOSS + kdaScore + damageScore + kpScore + supportTankScore;

  // Clamp : jamais positif en défaite, jamais plus de 30 en win
  if (participant.win) points = Math.min(points, 30);
  else points = Math.max(Math.min(points, -1), -50);

  return Math.round(points);
}

export class AramScoreService {
  static async shouldCalculateAramScore(
    summoner: SummonerCollection
  ): Promise<boolean> {
    return !summoner.aramScoreFirstCalculated;
  }

  static async calculateAramScore(
    region: string,
    name: string,
    tagline: string
  ): Promise<number> {
    const summoner = await getSummoner(region, name, tagline);
    if (!summoner || !summoner.puuid)
      throw new Error("Summoner or puuid not found");
    const puuid = summoner.puuid;
    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection<any>("matches");
    const matches = await collection
      .find({
        "info.gameMode": "ARAM",
        "info.participants.puuid": puuid,
      })
      .toArray();
    let totalScore = 0;
    for (const match of matches) {
      const participant = match.info.participants.find(
        (p: any) => p.puuid === puuid
      );
      if (!participant) continue;
      // Trouver l'équipe du participant
      const teamId = participant.teamId;
      const teamParticipants = match.info.participants.filter(
        (p: any) => p.teamId === teamId
      );
      const score = computeAramScore(participant, teamParticipants);
      totalScore += score;
    }
    return totalScore;
  }

  static async updateAramScore(
    region: string,
    name: string,
    tagline: string,
    score: number
  ): Promise<void> {
    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection<any>("summoners");
    await collection.updateOne(
      { region, name, tagline },
      {
        $set: {
          aramScore: score,
          aramScoreFirstCalculated: true,
          aramScoreLastCheck: Date.now(),
        },
      }
    );
  }

  static async syncAramScore(region: string, name: string, tagline: string) {
    const summoner = (await getSummoner(
      region,
      name,
      tagline
    )) as SummonerCollection | null;
    if (!summoner) throw new Error("Summoner not found");

    const aramScoreFirstCalculated = summoner.aramScoreFirstCalculated;
    const aramScoreLastCheck = summoner.aramScoreLastCheck;
    const aramScore = summoner.aramScore;

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
