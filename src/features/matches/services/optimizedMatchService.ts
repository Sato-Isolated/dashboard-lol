// features/matches/services/optimizedMatchService.ts
import { MongoService } from '@/lib/api/database/MongoService';
import { PerformanceLogger } from '@/lib/api/logging/PerformanceLogger';
import type { Match } from '@/types/api/matchTypes';

// Define MatchQueryOptions interface locally for now
interface MatchQueryOptions {
  limit?: number;
  skip?: number;
  queueId?: number;
  fromDate?: Date;
  toDate?: Date;
  gameMode?: string;
  championId?: number;
  outcome?: 'win' | 'lose';
}

export class OptimizedMatchService {
  private mongo: MongoService;

  constructor() {
    this.mongo = MongoService.getInstance();
  }

  /**
   * ✅ Optimized query for player match history
   * Uses composite index: player_matches_optimized
   */
  async getPlayerMatches(
    puuid: string,
    options: MatchQueryOptions = {},
  ): Promise<Match[]> {
    const perfLogger = new PerformanceLogger('get_player_matches', {
      puuid: puuid.substring(0, 8),
      options,
    });

    try {
      const collection = await this.mongo.getCollection<Match>('matches');

      // Construction of optimized aggregation pipeline
      const pipeline = [
        // Stage 1: Match with optimal index
        {
          $match: {
            participants: {
              $elemMatch: { puuid: puuid },
            },
            // Additional filters that use the composite index
            ...(options.queueId && { 'info.queueId': options.queueId }),
            ...(options.fromDate && {
              'info.gameCreation': { $gte: options.fromDate.getTime() },
            }),
            ...(options.toDate && {
              'info.gameCreation': { $lte: options.toDate.getTime() },
            }),
          },
        },

        // Stage 2: Sort using the index
        {
          $sort: { 'info.gameEndTimestamp': -1 },
        },

        // Stage 3: Pagination
        ...(options.skip ? [{ $skip: options.skip }] : []),
        { $limit: options.limit || 20 },

        // Stage 4: Optimized projection (only necessary fields)
        {
          $project: {
            'metadata.matchId': 1,
            'info.gameCreation': 1,
            'info.gameEndTimestamp': 1,
            'info.gameDuration': 1,
            'info.gameMode': 1,
            'info.queueId': 1,
            participants: {
              $filter: {
                input: '$participants',
                as: 'participant',
                cond: { $eq: ['$$participant.puuid', puuid] },
              },
            },
          },
        },
      ];

      const matches = await this.mongo.aggregateWithOptions<Match>(
        'matches',
        pipeline,
        {
          hint: 'player_matches_optimized', // Force the use of our index
          maxTimeMS: 10000,
        },
      );

      perfLogger.success(matches);
      return matches;
    } catch (error) {
      perfLogger.error(error as Error);
      throw error;
    }
  }

  /**
   * ✅ Specialized query for ARAM matches
   * Uses partial index: aram_player_history
   */
  async getPlayerAramMatches(
    puuid: string,
    options: Omit<MatchQueryOptions, 'queueId'> = {},
  ): Promise<Match[]> {
    const perfLogger = new PerformanceLogger('get_player_aram_matches', {
      puuid: puuid.substring(0, 8),
    });

    try {
      // Uses the optimized method with queueId forced to 450 (ARAM)
      const matches = await this.getPlayerMatches(puuid, {
        ...options,
        queueId: 450,
      });

      perfLogger.success(matches);
      return matches;
    } catch (error) {
      perfLogger.error(error as Error);
      throw error;
    }
  }

  /**
   * ✅ Query for match statistics by period
   * Uses index: player_matches_by_creation
   */
  async getPlayerMatchStats(
    puuid: string,
    fromDate: Date,
    toDate?: Date,
  ): Promise<{
    totalMatches: number;
    winRate: number;
    averageKDA: number;
    mostPlayedChampion: string;
    queueDistribution: Record<number, number>;
  }> {
    const perfLogger = new PerformanceLogger('get_player_match_stats', {
      puuid: puuid.substring(0, 8),
      fromDate,
      toDate,
    });

    try {
      const collection = await this.mongo.getCollection('matches');

      const pipeline = [
        // Match with optimized index for dates
        {
          $match: {
            'participants.puuid': puuid,
            'info.gameCreation': {
              $gte: fromDate.getTime(),
              ...(toDate && { $lte: toDate.getTime() }),
            },
          },
        },

        // Unwind to process each participant
        { $unwind: '$participants' },

        // Filter to keep only our player
        {
          $match: {
            'participants.puuid': puuid,
          },
        },

        // Statistics calculations
        {
          $group: {
            _id: null,
            totalMatches: { $sum: 1 },
            totalWins: {
              $sum: {
                $cond: [{ $eq: ['$participants.win', true] }, 1, 0],
              },
            },
            totalKills: { $sum: '$participants.kills' },
            totalDeaths: { $sum: '$participants.deaths' },
            totalAssists: { $sum: '$participants.assists' },
            champions: { $push: '$participants.championName' },
            queues: { $push: '$info.queueId' },
          },
        },

        // Final calculations
        {
          $project: {
            totalMatches: 1,
            winRate: {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$totalWins', '$totalMatches'] },
                    100,
                  ],
                },
                2,
              ],
            },
            averageKDA: {
              $round: [
                {
                  $divide: [
                    { $add: ['$totalKills', '$totalAssists'] },
                    { $max: ['$totalDeaths', 1] },
                  ],
                },
                2,
              ],
            },
            champions: 1,
            queues: 1,
          },
        },
      ];

      const [result] = await this.mongo.aggregateWithOptions(
        'matches',
        pipeline,
        {
          hint: 'player_matches_by_creation',
          maxTimeMS: 15000,
        },
      );

      if (!result) {
        return {
          totalMatches: 0,
          winRate: 0,
          averageKDA: 0,
          mostPlayedChampion: '',
          queueDistribution: {},
        };
      }

      // Post-processing for most played champion and queue distribution
      const championCounts: Record<string, number> = {};
      result.champions.forEach((champ: string) => {
        championCounts[champ] = (championCounts[champ] || 0) + 1;
      });

      const queueDistribution: Record<number, number> = {};
      result.queues.forEach((queue: number) => {
        queueDistribution[queue] = (queueDistribution[queue] || 0) + 1;
      });

      const mostPlayedChampion =
        Object.entries(championCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        '';

      const stats = {
        totalMatches: result.totalMatches,
        winRate: result.winRate,
        averageKDA: result.averageKDA,
        mostPlayedChampion,
        queueDistribution,
      };

      perfLogger.success(stats);
      return stats;
    } catch (error) {
      perfLogger.error(error as Error);
      throw error;
    }
  }

  /**
   * ✅ Query for recent global matches by game mode
   * Uses index: queue_timeline
   */
  async getRecentMatchesByQueue(queueId: number, limit = 50): Promise<Match[]> {
    const perfLogger = new PerformanceLogger('get_recent_matches_by_queue', {
      queueId,
      limit,
    });

    try {
      const collection = await this.mongo.getCollection<Match>('matches');

      const matches = await collection
        .find(
          { 'info.queueId': queueId },
          {
            sort: { 'info.gameEndTimestamp': -1 },
            limit,
            hint: 'queue_timeline',
          },
        )
        .toArray();

      perfLogger.success(matches);
      return matches;
    } catch (error) {
      perfLogger.error(error as Error);
      throw error;
    }
  }

  /**
   * 🔍 Diagnostic method to check index usage
   */
  async explainQuery(
    puuid: string,
    options: MatchQueryOptions = {},
  ): Promise<any> {
    const collection = await this.mongo.getCollection('matches');

    const explanation = await collection
      .find({
        participants: {
          $elemMatch: { puuid: puuid },
        },
        ...(options.queueId && { 'info.queueId': options.queueId }),
      })
      .sort({ 'info.gameEndTimestamp': -1 })
      .limit(20)
      .explain('executionStats');

    return {
      indexUsed: explanation.queryPlanner.winningPlan.inputStage?.indexName,
      executionTimeMs: explanation.executionStats.executionTimeMillis,
      docsExamined: explanation.executionStats.totalDocsExamined,
      docsReturned: explanation.executionStats.totalDocsReturned,
      isOptimal:
        explanation.executionStats.totalDocsReturned /
          explanation.executionStats.totalDocsExamined >
        0.1,
    };
  }
}
