import { MongoService } from '../api/database/MongoService';
import { logger } from '../logger/logger';
import { IndexSpecification } from 'mongodb';

interface IndexDefinition {
  collection: string;
  indexes: {
    spec: IndexSpecification;
    options?: {
      name?: string;
      unique?: boolean;
      sparse?: boolean;
      background?: boolean;
    };
  }[];
}

// Define all indexes needed for the application
const indexDefinitions: IndexDefinition[] = [
  {
    collection: 'summoners',
    indexes: [
      {
        spec: { name: 1, tagline: 1, region: 1 },
        options: {
          name: 'summoner_identity',
          unique: true,
          background: true,
        },
      },
      {
        spec: { name: 'text' },
        options: {
          name: 'summoner_name_text',
          background: true,
        },
      },
      {
        spec: { aramScore: -1 },
        options: {
          name: 'aram_score_desc',
          sparse: true,
          background: true,
        },
      },
      {
        spec: { region: 1, aramScore: -1 },
        options: {
          name: 'region_aram_score',
          sparse: true,
          background: true,
        },
      },
      {
        spec: { puuid: 1 },
        options: {
          name: 'summoner_puuid',
          unique: true,
          sparse: true,
          background: true,
        },
      },
      {
        spec: { lastUpdated: 1 },
        options: {
          name: 'last_updated',
          background: true,
        },
      },
    ],
  },
  {
    collection: 'matches',
    indexes: [
      {
        spec: { matchId: 1 },
        options: {
          name: 'match_id',
          unique: true,
          background: true,
        },
      },
      {
        spec: { 'info.gameEndTimestamp': -1 },
        options: {
          name: 'game_end_timestamp_desc',
          background: true,
        },
      },
      {
        spec: { 'info.participants.puuid': 1 },
        options: {
          name: 'participant_puuid',
          background: true,
        },
      },
      {
        spec: { 'info.participants.riotIdGameName': 1 },
        options: {
          name: 'participant_game_name',
          background: true,
        },
      },
      {
        spec: {
          'info.participants.riotIdGameName': 1,
          'info.gameEndTimestamp': -1,
        },
        options: {
          name: 'participant_matches_by_date',
          background: true,
        },
      },
      {
        spec: { 'info.gameMode': 1 },
        options: {
          name: 'game_mode',
          background: true,
        },
      },
      {
        spec: { 'info.queueId': 1 },
        options: {
          name: 'queue_id',
          background: true,
        },
      },
    ],
  },
];

async function createIndexes(): Promise<void> {
  try {
    logger.info('Starting index creation process');

    const mongo = MongoService.getInstance();
    await mongo.connect();

    for (const collectionDef of indexDefinitions) {
      logger.info(
        `Creating indexes for collection: ${collectionDef.collection}`,
      );

      try {
        const collection = await mongo.getCollection(collectionDef.collection);

        // Check if collection exists and has documents
        const count = await collection.countDocuments();
        logger.info(
          `Collection ${collectionDef.collection} has ${count} documents`,
        );

        for (const indexDef of collectionDef.indexes) {
          try {
            const indexName =
              indexDef.options?.name || Object.keys(indexDef.spec).join('_');

            logger.info(
              `Creating index: ${indexName} on ${collectionDef.collection}`,
            );

            const result = await collection.createIndex(
              indexDef.spec,
              indexDef.options,
            );
            logger.info(`Index created successfully: ${result}`);
          } catch (indexError: unknown) {
            const error = indexError as { code?: number; message?: string };
            if (error.code === 85) {
              // Index already exists - this is fine
              logger.info(`Index ${indexDef.options?.name} already exists`);
            } else {
              logger.error(
                `Failed to create index ${indexDef.options?.name}`,
                indexError as Error,
              );
            }
          }
        } // List all indexes for the collection
        const indexes = await collection.listIndexes().toArray();
        logger.info(
          `Collection ${collectionDef.collection} now has ${indexes.length} indexes:`,
          { indexNames: indexes.map(idx => idx.name) },
        );
      } catch (collectionError: unknown) {
        logger.error(
          `Error working with collection ${collectionDef.collection}`,
          collectionError as Error,
        );
      }
    }

    logger.info('Index creation process completed successfully');
  } catch (error) {
    logger.error('Failed to create indexes', error);
    throw error;
  }
}

async function dropAllIndexes(): Promise<void> {
  try {
    logger.warn('Starting index removal process');

    const mongo = MongoService.getInstance();
    await mongo.connect();

    for (const collectionDef of indexDefinitions) {
      try {
        const collection = await mongo.getCollection(collectionDef.collection);

        // Don't drop the _id index
        const indexes = await collection.listIndexes().toArray();
        const customIndexes = indexes.filter(idx => idx.name !== '_id_');

        if (customIndexes.length > 0) {
          logger.warn(
            `Dropping ${customIndexes.length} custom indexes from ${collectionDef.collection}`,
          );
          await collection.dropIndexes();
          logger.warn(
            `Indexes dropped for collection: ${collectionDef.collection}`,
          );
        } else {
          logger.info(
            `No custom indexes to drop in collection: ${collectionDef.collection}`,
          );
        }
      } catch (collectionError: unknown) {
        logger.error(
          `Error dropping indexes for collection ${collectionDef.collection}`,
          collectionError as Error,
        );
      }
    }

    logger.warn('Index removal process completed');
  } catch (error) {
    logger.error('Failed to drop indexes', error);
    throw error;
  }
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'drop') {
    dropAllIndexes()
      .then(() => {
        logger.info('Index drop completed');
        process.exit(0);
      })
      .catch(error => {
        logger.error('Index drop failed', error);
        process.exit(1);
      });
  } else {
    createIndexes()
      .then(() => {
        logger.info('Index creation completed');
        process.exit(0);
      })
      .catch(error => {
        logger.error('Index creation failed', error);
        process.exit(1);
      });
  }
}

export { createIndexes, dropAllIndexes, indexDefinitions };
