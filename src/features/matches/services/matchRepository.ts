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
   * Get matches for a specific participant (by PUUID)
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

        logger.info("Fetching matches by PUUID", { puuid, limit });

        const mongo = MongoService.getInstance();
        const collection = await mongo.getCollection<MatchCollection>(
          this.collectionName
        );

        let query = collection.find({ "metadata.participants": puuid });

        if (limit) {
          query = query.limit(limit);
        }

        const matches = await query.toArray();

        logger.info("Matches fetched by PUUID", {
          puuid,
          count: matches.length,
          limit,
        });

        return matches;
      },
      { collection: this.collectionName, operation: "getMatchesByPuuid" }
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
