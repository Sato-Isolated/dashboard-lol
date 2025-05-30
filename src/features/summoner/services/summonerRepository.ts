import { MongoService } from '@/lib/api/database/MongoService';
import { SummonerCollection } from '@/features/summoner/types/summonerTypes';
import { logger } from '@/lib/logger/logger';
import { ValidationError, BaseRepositoryImpl } from '@/lib/patterns';
import {
  puuidSchema,
  regionSchema,
  summonerNameSchema,
} from '@/lib/validation/schemas';

/**
 * Repository for summoner data operations
 * Implements standardized patterns for consistent error handling and logging
 */
class SummonerRepository extends BaseRepositoryImpl<
  SummonerCollection,
  string
> {
  protected readonly collectionName = 'summoners';
  protected readonly featureName = 'summoner';

  async findById(id: string): Promise<SummonerCollection | null> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );
      return collection.findOne({
        _id: new (await import('mongodb')).ObjectId(id),
      });
    }, 'findById');
  }

  async create(
    entity: Omit<SummonerCollection, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SummonerCollection> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );

      const doc: SummonerCollection = {
        ...entity,
        _id: new (await import('mongodb')).ObjectId(),
      };

      await collection.insertOne(doc);
      return doc;
    }, 'create');
  }

  async update(
    id: string,
    updates: Partial<SummonerCollection>,
  ): Promise<SummonerCollection | null> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );

      const result = await collection.findOneAndUpdate(
        { _id: new (await import('mongodb')).ObjectId(id) },
        { $set: updates },
        { returnDocument: 'after' },
      );

      return result || null;
    }, 'update');
  }

  async delete(id: string): Promise<boolean> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );

      const result = await collection.deleteOne({
        _id: new (await import('mongodb')).ObjectId(id),
      });
      return result.deletedCount > 0;
    }, 'delete');
  }

  /**
   * Find summoner by region, name, and tagline
   */
  async findByIdentity(
    region: string,
    name: string,
    tagline: string,
  ): Promise<SummonerCollection | null> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );
      return collection.findOne({ region, name, tagline });
    }, 'findByIdentity');
  }

  /**
   * Get or create summoner with validation and standardized error handling
   */
  async getOrCreate(
    region: string,
    name: string,
    tagline: string,
    puuid: string,
  ): Promise<SummonerCollection> {
    return this.errorHandler.repository(
      async () => {
        // Validate inputs using standardized validation
        // Region
        const regionResult = regionSchema.safeParse(region);
        if (!regionResult.success) {
          throw new ValidationError(
            regionResult.error.errors[0]?.message || 'Invalid region',
          );
        }
        // Name
        const nameResult = summonerNameSchema.safeParse(name);
        if (!nameResult.success) {
          throw new ValidationError(
            nameResult.error.errors[0]?.message || 'Invalid summoner name',
          );
        }
        // PUUID
        const puuidResult = puuidSchema.safeParse(puuid);
        if (!puuidResult.success) {
          throw new ValidationError(
            puuidResult.error.errors[0]?.message || 'Invalid PUUID format',
          );
        }

        logger.info('Getting or creating summoner', {
          region,
          name,
          tagline,
          puuid,
        });

        // Try to find existing summoner
        let summoner = await this.findByIdentity(region, name, tagline);

        if (!summoner) {
          logger.info('Summoner not found, creating new record', {
            region,
            name,
            tagline,
          });

          const doc: SummonerCollection = {
            _id: new (await import('mongodb')).ObjectId(),
            puuid,
            region,
            name,
            tagline,
            fetchOldGames: false,
            lastFetchedGameEndTimestamp: undefined,
          };

          const mongo = MongoService.getInstance();
          const collection = await mongo.getCollection<SummonerCollection>(
            this.collectionName,
          );
          await collection.insertOne(doc);
          summoner = doc;

          logger.info('Summoner created successfully', {
            region,
            name,
            tagline,
            summonerId: summoner._id,
          });
        } else {
          logger.info('Summoner found in database', {
            region,
            name,
            tagline,
            summonerId: summoner._id,
          });
        }

        return summoner;
      },
      { collection: this.collectionName, operation: 'getOrCreate' },
    );
  }

  /**
   * Update champion mastery for a summoner
   */
  async updateChampionMastery(
    region: string,
    name: string,
    tagline: string,
    championId: number,
    championLevel: number,
    championPoints: number,
  ): Promise<void> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );

      await collection.updateOne(
        { region, name, tagline },
        {
          $set: {
            [`championMastery.${championId}`]: {
              championLevel,
              championPoints,
            },
          },
        },
      );
    }, 'updateChampionMastery');
  }

  /**
   * Set fetch old games flag
   */
  async setFetchOldGames(
    region: string,
    name: string,
    tagline: string,
    value: boolean,
  ): Promise<void> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );

      await collection.updateOne(
        { region, name, tagline },
        { $set: { fetchOldGames: value } },
      );
    }, 'setFetchOldGames');
  }

  /**
   * Set last fetched game end timestamp
   */
  async setLastFetchedGameEndTimestamp(
    region: string,
    name: string,
    tagline: string,
    timestamp: number,
  ): Promise<void> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );

      await collection.updateOne(
        { region, name, tagline },
        { $set: { lastFetchedGameEndTimestamp: timestamp } },
      );
    }, 'setLastFetchedGameEndTimestamp');
  }

  /**
   * Set ARAM score for a summoner
   */
  async setAramScore(
    region: string,
    name: string,
    tagline: string,
    aramScore: number,
  ): Promise<void> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );

      await collection.updateOne(
        { region, name, tagline },
        { $set: { aramScore } },
      );
    }, 'setAramScore');
  }

  /**
   * Set last update timestamp
   */
  async setLastUpdateTimestamp(
    region: string,
    name: string,
    tagline: string,
    timestamp: number,
  ): Promise<void> {
    return this.executeOperation(async () => {
      const mongo = MongoService.getInstance();
      const collection = await mongo.getCollection<SummonerCollection>(
        this.collectionName,
      );

      await collection.updateOne(
        { region, name, tagline },
        { $set: { lastUpdateTimestamp: timestamp } },
      );
    }, 'setLastUpdateTimestamp');
  }
}

// Create a singleton instance of the repository
const summonerRepository = new SummonerRepository();

// Export repository instance and methods for backward compatibility
export { summonerRepository };

// Export legacy functions for backward compatibility
export const getOrCreateSummoner =
  summonerRepository.getOrCreate.bind(summonerRepository);
export const insertOrUpdateChampionMastery =
  summonerRepository.updateChampionMastery.bind(summonerRepository);
export const setFetchOldGames =
  summonerRepository.setFetchOldGames.bind(summonerRepository);
export const setLastFetchedGameEndTimestamp =
  summonerRepository.setLastFetchedGameEndTimestamp.bind(summonerRepository);
export const getSummoner =
  summonerRepository.findByIdentity.bind(summonerRepository);
export const setAramScore =
  summonerRepository.setAramScore.bind(summonerRepository);
export const setLastUpdateTimestamp =
  summonerRepository.setLastUpdateTimestamp.bind(summonerRepository);
