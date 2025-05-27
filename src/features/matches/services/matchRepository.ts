import { MongoService } from "@/shared/services/database/MongoService";
import { MatchCollection } from "@/features/matches/types/match.types";
import { Match } from "@/shared/types/api/match.types";
import { logger } from "@/shared/lib/logger/logger";
import { ValidationHelper, ValidationError } from "@/shared/lib/patterns";
import { BaseRepositoryImpl } from "@/shared/lib/patterns";

/**
 * Repository for match data operations
 * Implements standardized patterns for consistent error handling and logging
 */
class MatchRepository extends BaseRepositoryImpl<MatchCollection, string> {
  protected readonly collectionName = "matches";
  protected readonly featureName = "matches";

  async findById(id: string): Promise<MatchCollection | null> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName
      );
      return collection.findOne({ _id: id });
    }, "findById");
  }

  async create(
    entity: Omit<MatchCollection, "id" | "createdAt" | "updatedAt">
  ): Promise<MatchCollection> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName
      );

      const doc = entity as MatchCollection;
      await collection.insertOne(doc);
      return doc;
    }, "create");
  }

  async update(
    id: string,
    updates: Partial<MatchCollection>
  ): Promise<MatchCollection | null> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName
      );

      const result = await collection.findOneAndUpdate(
        { _id: id },
        { $set: updates },
        { returnDocument: "after" }
      );

      return result || null;
    }, "update");
  }

  async delete(id: string): Promise<boolean> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName
      );

      const result = await collection.deleteOne({ _id: id });
      return result.deletedCount > 0;
    }, "delete");
  }

  /**
   * Insert a match with proper validation and error handling
   */
  async insertMatch(match: Match): Promise<void> {
    return this.errorHandler.repository(
      async () => {
        // Validate match data
        const matchIdValidation = ValidationHelper.validateString(
          match.metadata.matchId,
          "matchId",
          10,
          50
        );
        if (!matchIdValidation.isValid) {
          throw new ValidationError(
            matchIdValidation.error || "Invalid match ID"
          );
        }

        logger.info("Inserting match", {
          matchId: match.metadata.matchId,
          gameMode: match.info.gameMode,
          gameDuration: match.info.gameDuration,
        });

        const mongo = MongoService.getInstance();
        const collection = await mongo.getCollection<MatchCollection>(
          this.collectionName
        );

        const matchDoc: MatchCollection = {
          ...match,
          _id: match.metadata.matchId,
        };

        try {
          await collection.insertOne(matchDoc);

          logger.info("Match inserted successfully", {
            matchId: match.metadata.matchId,
          });
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            error.message.includes("duplicate key")
          ) {
            logger.warn("Match already exists", {
              matchId: match.metadata.matchId,
            });
            // Don't throw error for duplicate keys as this is expected
            return;
          } else {
            logger.error("Failed to insert match", error as Error, {
              matchId: match.metadata.matchId,
            });
            throw error;
          }
        }
      },
      { collection: this.collectionName, operation: "insertMatch" }
    );
  }

  /**
   * Get match by ID with proper error handling
   */
  async getMatchById(matchId: string): Promise<MatchCollection | null> {
    return this.errorHandler.repository(
      async () => {
        // Validate match ID
        const matchIdValidation = ValidationHelper.validateString(
          matchId,
          "matchId",
          10,
          50
        );
        if (!matchIdValidation.isValid) {
          throw new ValidationError(
            matchIdValidation.error || "Invalid match ID"
          );
        }

        logger.info("Fetching match by ID", { matchId });

        const mongo = MongoService.getInstance();
        const collection = await mongo.getCollection<MatchCollection>(
          this.collectionName
        );
        const match = await collection.findOne({ _id: matchId });

        if (match) {
          logger.info("Match found", { matchId });
        } else {
          logger.info("Match not found", { matchId });
        }

        return match;
      },
      { collection: this.collectionName, operation: "getMatchById" }
    );
  }

  /**
   * Get matches where participants achieved multi-kills
   */
  async getMultiKillMatches(): Promise<MatchCollection[]> {
    return this.executeOperation(async () => {
      logger.info("Fetching multi-kill matches");

      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName
      );

      const matches = await collection
        .find({
          $or: [
            { "info.participants.doubleKills": { $gte: 1 } },
            { "info.participants.tripleKills": { $gte: 1 } },
            { "info.participants.quadraKills": { $gte: 1 } },
            { "info.participants.pentaKills": { $gte: 1 } },
          ],
        })
        .toArray();

      logger.info("Multi-kill matches fetched", { count: matches.length });
      return matches;
    }, "getMultiKillMatches");
  }
  /**
   * Get matches for a specific participant (by PUUID) - OPTIMIZED for Phase 2.1
   */
  async getMatchesByPuuid(
    puuid: string,
    limit?: number
  ): Promise<MatchCollection[]> {
    return this.errorHandler.repository(
      async () => {
        // Validate PUUID
        const puuidValidation = ValidationHelper.validateString(
          puuid,
          "puuid",
          78,
          78
        );
        if (!puuidValidation.isValid) {
          throw new ValidationError(
            puuidValidation.error || "Invalid PUUID format"
          );
        }

        logger.info("Fetching matches by PUUID (optimized)", { puuid, limit });

        const mongo = MongoService.getInstance();
        const collection = await mongo.getCollection<MatchCollection>(
          this.collectionName
        );

        // PHASE 2.1 OPTIMIZATION: Use optimized query pattern that leverages indexes
        // Query structure: { "info.participants.puuid": puuid } instead of metadata.participants
        // This allows MongoDB to use our optimized compound indexes
        let query = collection
          .find({ "info.participants.puuid": puuid })
          .sort({ "info.gameEndTimestamp": -1 }); // Sort by most recent first

        if (limit) {
          query = query.limit(limit);
        }

        const matches = await query.toArray();

        logger.info("Matches fetched by PUUID (optimized)", {
          puuid,
          count: matches.length,
          limit,
          optimization: "Phase2.1_IndexOptimized",
        });

        return matches;
      },
      { collection: this.collectionName, operation: "getMatchesByPuuid" }
    );
  }

  /**
   * Get matches for a specific participant with queue filter (ARAM, Ranked, etc.) - OPTIMIZED
   */
  async getMatchesByPuuidAndQueue(
    puuid: string,
    queueId: number,
    limit?: number
  ): Promise<MatchCollection[]> {
    return this.errorHandler.repository(
      async () => {
        // Validate PUUID
        const puuidValidation = ValidationHelper.validateString(
          puuid,
          "puuid",
          78,
          78
        );
        if (!puuidValidation.isValid) {
          throw new ValidationError(
            puuidValidation.error || "Invalid PUUID format"
          );
        }

        logger.info("Fetching matches by PUUID and queue (optimized)", {
          puuid,
          queueId,
          limit,
        });

        const mongo = MongoService.getInstance();
        const collection = await mongo.getCollection<MatchCollection>(
          this.collectionName
        );

        // PHASE 2.1 OPTIMIZATION: Use optimized compound index
        // This query will use the participants_puuid_queue_end_time index
        let query = collection
          .find({
            "info.participants.puuid": puuid,
            "info.queueId": queueId,
          })
          .sort({ "info.gameEndTimestamp": -1 });

        if (limit) {
          query = query.limit(limit);
        }

        const matches = await query.toArray();

        logger.info("Matches fetched by PUUID and queue (optimized)", {
          puuid,
          queueId,
          count: matches.length,
          limit,
          optimization: "Phase2.1_CompoundIndexOptimized",
        });

        return matches;
      },
      {
        collection: this.collectionName,
        operation: "getMatchesByPuuidAndQueue",
      }
    );
  }

  /**
   * Get recent matches for a player within date range - OPTIMIZED
   */
  async getRecentMatchesByPuuid(
    puuid: string,
    startTimestamp?: number,
    endTimestamp?: number,
    limit?: number
  ): Promise<MatchCollection[]> {
    return this.errorHandler.repository(
      async () => {
        // Validate PUUID
        const puuidValidation = ValidationHelper.validateString(
          puuid,
          "puuid",
          78,
          78
        );
        if (!puuidValidation.isValid) {
          throw new ValidationError(
            puuidValidation.error || "Invalid PUUID format"
          );
        }

        logger.info("Fetching recent matches by PUUID (optimized)", {
          puuid,
          startTimestamp,
          endTimestamp,
          limit,
        });

        const mongo = MongoService.getInstance();
        const collection = await mongo.getCollection<MatchCollection>(
          this.collectionName
        );

        // Build optimized query
        const filter: Record<string, unknown> = {
          "info.participants.puuid": puuid,
        };

        // Add date range filter
        if (startTimestamp || endTimestamp) {
          const ts: Record<string, number> = {};
          if (startTimestamp) ts.$gte = startTimestamp;
          if (endTimestamp) ts.$lte = endTimestamp;
          filter["info.gameCreation"] = ts;
        }

        // PHASE 2.1 OPTIMIZATION: Use optimized compound index
        // This will use the player_matches_by_creation_fixed index
        let query = collection.find(filter).sort({ "info.gameCreation": -1 });

        if (limit) {
          query = query.limit(limit);
        }

        const matches = await query.toArray();

        logger.info("Recent matches fetched by PUUID (optimized)", {
          puuid,
          startTimestamp,
          endTimestamp,
          count: matches.length,
          limit,
          optimization: "Phase2.1_DateRangeOptimized",
        });

        return matches;
      },
      { collection: this.collectionName, operation: "getRecentMatchesByPuuid" }
    );
  }

  /**
   * Get recent matches within a date range
   */
  async getRecentMatches(
    startTimestamp?: number,
    endTimestamp?: number,
    limit?: number
  ): Promise<MatchCollection[]> {
    return this.executeOperation(async () => {
      logger.info("Fetching recent matches", {
        startTimestamp,
        endTimestamp,
        limit,
      });

      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName
      );
      const filter: Record<
        string,
        { $gte?: number; $lte?: number } | number | string
      > = {};

      if (startTimestamp || endTimestamp) {
        filter["info.gameStartTimestamp"] = {};
        if (startTimestamp) {
          filter["info.gameStartTimestamp"].$gte = startTimestamp;
        }
        if (endTimestamp) {
          filter["info.gameStartTimestamp"].$lte = endTimestamp;
        }
      }

      let query = collection
        .find(filter)
        .sort({ "info.gameStartTimestamp": -1 });

      if (limit) {
        query = query.limit(limit);
      }

      const matches = await query.toArray();

      logger.info("Recent matches fetched", {
        count: matches.length,
        filter: JSON.stringify(filter),
        limit,
      });

      return matches;
    }, "getRecentMatches");
  }
}

// Create a singleton instance of the repository
const matchRepository = new MatchRepository();

// Export repository instance and methods for backward compatibility
export { matchRepository };

// Export legacy functions for backward compatibility
export const insertMatch = matchRepository.insertMatch.bind(matchRepository);
export const getMatchById = matchRepository.getMatchById.bind(matchRepository);
export const getMultiKillMatches =
  matchRepository.getMultiKillMatches.bind(matchRepository);
