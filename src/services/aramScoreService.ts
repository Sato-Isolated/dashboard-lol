import { MongoService } from "@/lib/MongoService";
import { getSummoner } from "@/repositories/summonerRepo";
import type { Participant } from "@/types/api/match";
import type { SummonerCollection } from "@/types/schema/SummonerCollection";
import type { MatchCollection } from "@/types/schema/MatchCollection";

/**
 * Calculates a unique ARAM score for a player in a match.
 */
/**
 * Calculates a custom score for an ARAM participant, based on individual performance
 * and team averages. The score considers win/loss, KDA, damage dealt,
 * kill participation, and support/tank role (healing or damage taken).
 *
 * - Win: base of +20 points, capped at 40.
 * - Loss: base of -20 points, never positive, minimum -40.
 * - Weighted KDA: (kills + assists) / deaths, multiplied by 2, max 10 points.
 * - Damage dealt: compared to team average, max 10 points.
 * - Kill participation: killParticipation * 8, rounded, max 8 points.
 * - Support/Tank: takes the higher score between healing (compared to average) and tanking (damage taken), max 5 points.
 *
 * @param participant The participant whose score is being calculated.
 * @param teamParticipants The participant's team members (for calculating averages).
 * @returns The calculated ARAM score, rounded to the nearest integer.
 */
export function computeAramScore(
  participant: Participant,
  teamParticipants: Participant[]
): number {
  // Stricter base points
  const BASE_WIN = 15;
  const BASE_LOSS = -25;

  // Team averages
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

  // Weighted KDA (stricter)
  const kda =
    (participant.kills + participant.assists) / Math.max(1, participant.deaths);
  const kdaScore = Math.min(7, kda * 1.5);

  // Damage dealt (stricter)
  const damageScore = Math.min(
    7,
    (participant.totalDamageDealtToChampions / (avgDamage || 1)) * 3
  );

  // Kill participation (stricter)
  const killParticipation = participant.challenges?.killParticipation ?? 0;
  const kpScore = Math.round(killParticipation * 6);

  // Healing or tanking (stricter)
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

  // Total score
  let points = participant.win
    ? BASE_WIN + kdaScore + damageScore + kpScore + supportTankScore
    : BASE_LOSS + kdaScore + damageScore + kpScore + supportTankScore;

  // Clamp: never positive on loss, never more than 30 on win
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
    const collection = await mongo.getCollection<MatchCollection>("matches");
    const matches = await collection
      .find({
        "info.gameMode": "ARAM",
        "info.participants.puuid": puuid,
      })
      .toArray();
    let totalScore = 0;
    for (const match of matches) {
      const participant = match.info.participants.find(
        (p: Participant) => p.puuid === puuid
      );
      if (!participant) continue;
      // Find the participant's team
      const teamId = participant.teamId;
      const teamParticipants = match.info.participants.filter(
        (p: Participant) => p.teamId === teamId
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
    const collection = await mongo.getCollection<SummonerCollection>(
      "summoners"
    );
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
    const aramScore = summoner.aramScore;

    // Always recalculate the score to include new matches
    const score = await this.calculateAramScore(region, name, tagline);
    await this.updateAramScore(region, name, tagline, score);

    return {
      aramScore: score,
      aramScoreFirstCalculated: true,
      aramScoreLastCheck: Date.now(),
      calculated: true,
      wasFirstCalculation: !aramScoreFirstCalculated,
      previousScore: aramScore ?? 0,
    };
  }
}
