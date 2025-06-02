import { MongoService } from '@/lib/api/database/MongoService';
import { getSummoner } from '@/features/summoner/services/summonerRepository';
import type { Participant } from '@/types/api/matchTypes';
import type { SummonerCollection } from '@/features/summoner/types/summonerTypes';
import type { MatchCollection } from '@/features/matches/types/matchTypes';
import { StandardErrorHandler } from '@/lib/patterns';
import {
  taglineSchema,
  regionSchema,
  summonerNameSchema,
} from '@/lib/validation/schemas';

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
  teamParticipants: Participant[],
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
      0,
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
    (participant.totalDamageDealtToChampions / (avgDamage || 1)) * 3,
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
            2,
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
  if (participant.win) {
    points = Math.min(points, 30);
  } else {
    points = Math.max(Math.min(points, -1), -50);
  }

  return Math.round(points);
}

/**
 * ARAM Score Service implementing standardized patterns
 * Handles calculation and management of ARAM scores for summoners
 */
class AramScoreServiceImpl {
  private readonly featureName = 'aram';
  private readonly collectionName = 'summoners';
  private readonly matchesCollectionName = 'matches';

  private get errorHandler() {
    return StandardErrorHandler.createFeatureHandler(this.featureName);
  }
  /**
   * Common method for handling service operations with standardized error handling
   */
  private async executeOperation<R>(
    operation: () => Promise<R>,
    operationName: string,
  ): Promise<R> {
    return this.errorHandler.repository(operation, {
      collection: this.collectionName,
      operation: operationName,
    });
  }

  /**
   * Calculate ARAM score for a summoner with validation and error handling
   */
  async calculateAramScore(
    region: string,
    name: string,
    tagline: string,
  ): Promise<number> {
    return this.executeOperation(async () => {
      // Validate inputs
      const regionValidation = regionSchema.safeParse(region);
      if (!regionValidation.success) {
        throw new Error(
          regionValidation.error.errors[0]?.message || 'Invalid region',
        );
      }

      const nameValidation = summonerNameSchema.safeParse(name);
      if (!nameValidation.success) {
        throw new Error(
          nameValidation.error.errors[0]?.message || 'Invalid summoner name',
        );
      }
      const taglineValidation = taglineSchema.safeParse(tagline);
      if (!taglineValidation.success) {
        throw new Error(
          taglineValidation.error.errors[0]?.message || 'Invalid tagline',
        );
      }

      // Get summoner data
      const summoner = await getSummoner(region, name, tagline);
      if (!summoner || !summoner.puuid) {
        throw new Error('Summoner or puuid not found');
      }

      const puuid = summoner.puuid;
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.matchesCollectionName,
      );

      // Find ARAM matches for this summoner
      const matches = await collection
        .find({
          'info.gameMode': 'ARAM',
          'info.participants.puuid': puuid,
        })
        .toArray();

      let totalScore = 0;
      for (const match of matches) {
        const participant = match.info.participants.find(
          (p: Participant) => p.puuid === puuid,
        );
        if (!participant) {
          continue;
        }

        // Find the participant's team
        const teamId = participant.teamId;
        const teamParticipants = match.info.participants.filter(
          (p: Participant) => p.teamId === teamId,
        );

        const score = computeAramScore(participant, teamParticipants);
        totalScore += score;
      }

      return totalScore;
    }, 'calculateAramScore');
  }

  /**
   * Update ARAM score for a summoner with validation and error handling
   */ async updateAramScore(
    region: string,
    name: string,
    tagline: string,
    score: number,
  ): Promise<void> {
    return this.executeOperation(async () => {
      // Validate inputs
      const regionValidation = regionSchema.safeParse(region);
      if (!regionValidation.success) {
        throw new Error(
          regionValidation.error.errors[0]?.message || 'Invalid region',
        );
      }
      const nameValidation = summonerNameSchema.safeParse(name);
      if (!nameValidation.success) {
        throw new Error(
          nameValidation.error.errors[0]?.message || 'Invalid summoner name',
        );
      }

      const taglineValidation = taglineSchema.safeParse(tagline);
      if (!taglineValidation.success) {
        throw new Error(
          taglineValidation.error.errors[0]?.message || 'Invalid tagline',
        );
      }

      if (typeof score !== 'number' || isNaN(score)) {
        throw new Error('Invalid score value');
      }

      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );

      await collection.updateOne(
        { region, name, tagline },
        {
          $set: {
            aramScore: score,
            aramScoreFirstCalculated: true,
            aramScoreLastCheck: Date.now(),
          },
        },
      );
    }, 'updateAramScore');
  }
  /**
   * Synchronize ARAM score for a summoner with comprehensive error handling
   */
  async syncAramScore(region: string, name: string, tagline: string) {
    return this.executeOperation(async () => {
      // Validate inputs
      const regionValidation = regionSchema.safeParse(region);
      if (!regionValidation.success) {
        throw new Error(
          regionValidation.error.errors[0]?.message || 'Invalid region',
        );
      }
      const nameValidation = summonerNameSchema.safeParse(name);
      if (!nameValidation.success) {
        throw new Error(
          nameValidation.error.errors[0]?.message || 'Invalid summoner name',
        );
      }

      const taglineValidation = taglineSchema.safeParse(tagline);
      if (!taglineValidation.success) {
        throw new Error(
          taglineValidation.error.errors[0]?.message || 'Invalid tagline',
        );
      }

      const summoner = (await getSummoner(
        region,
        name,
        tagline,
      )) as SummonerCollection | null;
      if (!summoner) {
        throw new Error('Summoner not found');
      }

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
    }, 'syncAramScore');
  }
}

// Create a singleton instance of the service
const aramScoreService = new AramScoreServiceImpl();

// Export legacy static class for backward compatibility
export class AramScoreService {

  static async syncAramScore(region: string, name: string, tagline: string) {
    return aramScoreService.syncAramScore(region, name, tagline);
  }
}
