import { MongoService } from '@/lib/api/database/MongoService';
import { logger } from '@/lib/logger/logger';

// Types for MongoDB collection statistics
interface CollectionStats {
  count: number;
  size: number;
  avgObjSize: number;
  storageSize?: number;
  indexes?: number;
  indexSize?: number;
}

// Type for MongoDB profiler data
interface ProfilerData {
  ts: Date;
  op: string;
  ns: string;
  command?: Record<string, unknown>;
  millis: number;
  planSummary?: string;
  execStats?: Record<string, unknown>;
}

/**
 * Database optimization service for managing indexes and query performance
 */
export class DatabaseOptimizationService {
  private static instance: DatabaseOptimizationService;

  public static getInstance(): DatabaseOptimizationService {
    if (!DatabaseOptimizationService.instance) {
      DatabaseOptimizationService.instance = new DatabaseOptimizationService();
    }
    return DatabaseOptimizationService.instance;
  }

  /**
   * Create optimized indexes for all collections
   */
  async createOptimizedIndexes(): Promise<void> {
    try {
      const mongo = MongoService.getInstance();

      // Summoner collection indexes
      await this.createSummonerIndexes(mongo);

      // Match collection indexes
      await this.createMatchIndexes(mongo);

      // Champion mastery indexes
      await this.createChampionMasteryIndexes(mongo);

      logger.info('Database indexes created successfully');
    } catch (error) {
      logger.error('Failed to create database indexes', { error });
      throw error;
    }
  }

  /**
   * Create indexes for summoner collection
   */
  private async createSummonerIndexes(mongo: MongoService): Promise<void> {
    const collection = await mongo.getCollection('summoners');

    // Compound index for common query pattern (region + name + tagline)
    await collection.createIndex(
      { region: 1, name: 1, tagline: 1 },
      {
        unique: true,
        name: 'summoner_identity_unique',
        background: true,
      },
    );

    // Index for PUUID lookups
    await collection.createIndex(
      { puuid: 1 },
      {
        unique: true,
        name: 'summoner_puuid_unique',
        background: true,
      },
    );

    // Index for fetching summoners that need updates
    await collection.createIndex(
      { lastUpdateTimestamp: 1 },
      {
        name: 'summoner_last_update',
        background: true,
      },
    );

    // Index for ARAM score leaderboard
    await collection.createIndex(
      { aramScore: -1 },
      {
        name: 'summoner_aram_score_desc',
        background: true,
      },
    );

    logger.info('Summoner collection indexes created');
  }

  /**
   * Create indexes for match collection
   */
  private async createMatchIndexes(mongo: MongoService): Promise<void> {
    const collection = await mongo.getCollection('matches');

    // Unique index for match ID
    await collection.createIndex(
      { _id: 1 },
      {
        unique: true,
        name: 'match_id_unique',
        background: true,
      },
    );

    // Compound index for participant queries (puuid + gameEndTimestamp)
    await collection.createIndex(
      { 'info.participants.puuid': 1, 'info.gameEndTimestamp': -1 },
      {
        name: 'match_participant_timestamp',
        background: true,
      },
    );

    // Index for game mode filtering
    await collection.createIndex(
      { 'info.gameMode': 1, 'info.gameEndTimestamp': -1 },
      {
        name: 'match_gamemode_timestamp',
        background: true,
      },
    );

    // Index for match duration queries
    await collection.createIndex(
      { 'info.gameDuration': 1 },
      {
        name: 'match_duration',
        background: true,
      },
    );

    // Sparse index for queue type (only for ranked games)
    await collection.createIndex(
      { 'info.queueId': 1 },
      {
        name: 'match_queue_id',
        background: true,
        sparse: true,
      },
    );

    logger.info('Match collection indexes created');
  }

  /**
   * Create indexes for champion mastery optimization
   */
  private async createChampionMasteryIndexes(
    mongo: MongoService,
  ): Promise<void> {
    const collection = await mongo.getCollection('summoners');

    // Index for champion mastery lookups
    await collection.createIndex(
      { championMastery: 1 },
      {
        name: 'summoner_champion_mastery',
        background: true,
        sparse: true,
      },
    );

    logger.info('Champion mastery indexes created');
  }
  /**
   * Analyze collection statistics for optimization insights
   */
  async analyzeCollectionStats(): Promise<{
    summoners: CollectionStats;
    matches: CollectionStats;
  }> {
    try {
      const mongo = MongoService.getInstance();

      const summonersCollection = await mongo.getCollection('summoners');
      const matchesCollection = await mongo.getCollection('matches');

      // Use estimatedDocumentCount instead of stats() since stats() is not available
      const [summonerCount, matchCount] = await Promise.all([
        summonersCollection.estimatedDocumentCount(),
        matchesCollection.estimatedDocumentCount(),
      ]);

      const summonerStats: CollectionStats = {
        count: summonerCount,
        size: 0, // Size estimation not available
        avgObjSize: 0,
      };

      const matchStats: CollectionStats = {
        count: matchCount,
        size: 0, // Size estimation not available
        avgObjSize: 0,
      };

      logger.info('Collection statistics analyzed', {
        summoners: {
          count: summonerStats.count,
        },
        matches: {
          count: matchStats.count,
        },
      });

      return {
        summoners: summonerStats,
        matches: matchStats,
      };
    } catch (error) {
      logger.error('Failed to analyze collection stats', { error });
      throw error;
    }
  }
  /**
   * Get slow query analysis
   */
  async getSlowQueryAnalysis(): Promise<ProfilerData[]> {
    try {
      const mongo = MongoService.getInstance();
      const db = mongo.getDb();

      // Get profiler data for slow queries
      const profilerData = await db
        .collection('system.profile')
        .find({ ts: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }) // Last 24 hours
        .sort({ ts: -1 })
        .limit(100)
        .toArray();

      logger.info('Slow query analysis completed', {
        slowQueries: profilerData.length,
      });

      // Map to ProfilerData type
      return profilerData.map(doc => ({
        ts: doc.ts,
        op: doc.op,
        ns: doc.ns,
        command: doc.command,
        millis: doc.millis,
        planSummary: doc.planSummary,
        execStats: doc.execStats,
      })) as ProfilerData[];
    } catch (error) {
      logger.error('Failed to analyze slow queries', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Optimize collection with aggregation pipeline caching
   */
  async optimizeAggregationPipelines(): Promise<void> {
    try {
      const mongo = MongoService.getInstance();

      // Create views for common aggregation queries
      await this.createOptimizedViews(mongo);

      logger.info('Aggregation pipelines optimized');
    } catch (error) {
      logger.error('Failed to optimize aggregation pipelines', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Create optimized views for common queries
   */
  private async createOptimizedViews(mongo: MongoService): Promise<void> {
    const db = mongo.getDb();

    try {
      // View for summoner leaderboard with ARAM scores
      await db.createCollection('summoner_leaderboard', {
        viewOn: 'summoners',
        pipeline: [
          { $match: { aramScore: { $exists: true, $gt: 0 } } },
          { $sort: { aramScore: -1 } },
          {
            $project: {
              _id: 1,
              region: 1,
              name: 1,
              tagline: 1,
              aramScore: 1,
            },
          },
        ],
      });

      logger.info('Leaderboard view created');
    } catch (error) {
      // View might already exist
      if (
        !(error instanceof Error) ||
        !error.message.includes('already exists')
      ) {
        throw error;
      }
    }

    try {
      // View for recent matches summary
      await db.createCollection('recent_matches_summary', {
        viewOn: 'matches',
        pipeline: [
          {
            $match: {
              'info.gameEndTimestamp': {
                $gte: Date.now() - 7 * 24 * 60 * 60 * 1000,
              },
            },
          },
          {
            $project: {
              _id: 1,
              gameMode: '$info.gameMode',
              gameEndTimestamp: '$info.gameEndTimestamp',
              gameDuration: '$info.gameDuration',
              participants: {
                $map: {
                  input: '$info.participants',
                  as: 'participant',
                  in: {
                    puuid: '$$participant.puuid',
                    championName: '$$participant.championName',
                    kills: '$$participant.kills',
                    deaths: '$$participant.deaths',
                    assists: '$$participant.assists',
                    win: '$$participant.win',
                  },
                },
              },
            },
          },
        ],
      });

      logger.info('Recent matches summary view created');
    } catch (error) {
      // View might already exist
      if (
        !(error instanceof Error) ||
        !error.message.includes('already exists')
      ) {
        throw error;
      }
    }
  }

  /**
   * Cleanup old data to improve performance
   */
  async cleanupOldData(): Promise<void> {
    try {
      const mongo = MongoService.getInstance();

      // Remove matches older than 6 months
      const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
      const matchesCollection = await mongo.getCollection('matches');

      const result = await matchesCollection.deleteMany({
        'info.gameEndTimestamp': { $lt: sixMonthsAgo },
      });

      logger.info('Old data cleanup completed', {
        deletedMatches: result.deletedCount,
        cutoffDate: new Date(sixMonthsAgo).toISOString(),
      });
    } catch (error) {
      logger.error('Failed to cleanup old data', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

export default DatabaseOptimizationService;
