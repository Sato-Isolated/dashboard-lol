import { MongoService } from '@/lib/api/database/MongoService';
import { MatchCollection } from '@/features/matches/types/matchTypes';
import { Match } from '@/types/api/matchTypes';
import { logger } from '@/lib/logger/logger';
import { ValidationError, BaseRepositoryImpl } from '@/lib/patterns';
import { matchIdSchema, puuidSchema } from '@/lib/validation/schemas';

/**
 * Repository for match data operations
 * Implements standardized patterns for consistent error handling and logging
 */
class MatchRepository extends BaseRepositoryImpl<MatchCollection, string> {
  protected readonly collectionName = 'matches';
  protected readonly featureName = 'matches';

  async findById(id: string): Promise<MatchCollection | null> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName,
      );
      return collection.findOne({ _id: id });
    }, 'findById');
  }

  async create(
    entity: Omit<MatchCollection, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MatchCollection> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName,
      );

      const doc = entity as MatchCollection;
      await collection.insertOne(doc);
      return doc;
    }, 'create');
  }

  async update(
    id: string,
    updates: Partial<MatchCollection>,
  ): Promise<MatchCollection | null> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName,
      );

      const result = await collection.findOneAndUpdate(
        { _id: id },
        { $set: updates },
        { returnDocument: 'after' },
      );

      return result || null;
    }, 'update');
  }

  async delete(id: string): Promise<boolean> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName,
      );

      const result = await collection.deleteOne({ _id: id });
      return result.deletedCount > 0;
    }, 'delete');
  }

  /**
   * Insert a match with proper validation and error handling
   */ async insertMatch(match: Match): Promise<void> {
    return this.errorHandler.repository(
      async () => {
        // Validate match data
        const matchIdResult = matchIdSchema.safeParse(match.metadata.matchId);
        if (!matchIdResult.success) {
          throw new ValidationError(
            matchIdResult.error.errors[0]?.message || 'Invalid match ID',
          );
        }

        logger.info('Inserting match', {
          matchId: match.metadata.matchId,
          gameMode: match.info.gameMode,
          gameDuration: match.info.gameDuration,
        });

        const mongo = MongoService.getInstance();
        const collection = await mongo.getCollection<MatchCollection>(
          this.collectionName,
        );

        const matchDoc: MatchCollection = {
          ...match,
          _id: match.metadata.matchId,
        };

        try {
          await collection.insertOne(matchDoc);

          logger.info('Match inserted successfully', {
            matchId: match.metadata.matchId,
          });
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            error.message.includes('duplicate key')
          ) {
            logger.warn('Match already exists', {
              matchId: match.metadata.matchId,
            });
            // Don't throw error for duplicate keys as this is expected
            return;
          } else {
            logger.error('Failed to insert match', error as Error, {
              matchId: match.metadata.matchId,
            });
            throw error;
          }
        }
      },
      { collection: this.collectionName, operation: 'insertMatch' },
    );
  }

  /**
   * Get match by ID with proper error handling
   */
  async getMatchById(matchId: string): Promise<MatchCollection | null> {
    return this.errorHandler.repository(
      async () => {
        // Validate match ID
        const matchIdResult = matchIdSchema.safeParse(matchId);
        if (!matchIdResult.success) {
          throw new ValidationError(
            matchIdResult.error.errors[0]?.message || 'Invalid match ID',
          );
        }

        logger.info('Fetching match by ID', { matchId });

        const mongo = MongoService.getInstance();
        const collection = await mongo.getCollection<MatchCollection>(
          this.collectionName,
        );
        const match = await collection.findOne({ _id: matchId });

        if (match) {
          logger.info('Match found', { matchId });
        } else {
          logger.info('Match not found', { matchId });
        }

        return match;
      },
      { collection: this.collectionName, operation: 'getMatchById' },
    );
  }

  /**
   * Get matches where participants achieved multi-kills
   */
  async getMultiKillMatches(): Promise<MatchCollection[]> {
    return this.executeOperation(async () => {
      logger.info('Fetching multi-kill matches');

      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<MatchCollection>(
        this.collectionName,
      );

      const matches = await collection
        .find({
          $or: [
            { 'info.participants.doubleKills': { $gte: 1 } },
            { 'info.participants.tripleKills': { $gte: 1 } },
            { 'info.participants.quadraKills': { $gte: 1 } },
            { 'info.participants.pentaKills': { $gte: 1 } },
          ],
        })
        .toArray();

      logger.info('Multi-kill matches fetched', { count: matches.length });
      return matches;
    }, 'getMultiKillMatches');
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
