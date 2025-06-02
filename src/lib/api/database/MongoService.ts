import {
  MongoClient,
  Db,
  Collection,
  MongoClientOptions,
  Document,
  CreateIndexesOptions,
  IndexSpecification,
} from 'mongodb';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger/logger';

interface IndexDefinition {
  collection: string;
  indexes: {
    spec: IndexSpecification;
    options?: CreateIndexesOptions;
  }[];
}

export class MongoService {
  private static instance: MongoService;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private uri: string;
  private dbName: string;
  private isIndexesCreated = false;

  private constructor(uri: string, dbName: string) {
    this.uri = uri;
    this.dbName = dbName;
  }

  public static getInstance(): MongoService {
    if (!MongoService.instance) {
      const uri = config.get('DB_CONN_STRING');
      const dbName = config.get('DB_NAME');
      MongoService.instance = new MongoService(uri, dbName);
    }
    return MongoService.instance;
  }

  public async connect(options?: MongoClientOptions): Promise<Db> {
    const timerId = logger.startTimer('mongodb_connect', {
      method: 'connect',
      class: 'MongoService',
    });

    try {
      if (this.db) {
        logger.endTimer(timerId);
        return this.db;
      }

      const connectionOptions: MongoClientOptions = {
        // Connection pooling settings
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,

        // Monitoring
        monitorCommands: config.isDevelopment(),

        // Retry settings
        retryWrites: true,
        retryReads: true,

        ...options,
      };

      logger.info('Connecting to MongoDB', {
        dbName: this.dbName,
        poolSize: connectionOptions.maxPoolSize,
      });

      this.client = new MongoClient(this.uri, connectionOptions);
      await this.client.connect();
      this.db = this.client.db(this.dbName); // Set up monitoring
      this.setupMonitoring();

      // Create indexes on first connection
      if (!this.isIndexesCreated) {
        await this.createIndexes();
        this.isIndexesCreated = true;
      }

      logger.info('MongoDB connected successfully');
      logger.endTimer(timerId);
      return this.db;
    } catch (error) {
      logger.endTimer(timerId);
      logger.error('Failed to connect to MongoDB', error);
      throw error;
    }
  }
  public async getCollection<T extends Document = Document>(
    name: string,
  ): Promise<Collection<T>> {
    const db = await this.connect();
    return db.collection<T>(name);
  }

  public async aggregateWithOptions<T extends Document>(
    collectionName: string,
    pipeline: Document[],
    options?: {
      hint?: string | Document;
      maxTimeMS?: number;
      allowDiskUse?: boolean;
    },
  ): Promise<T[]> {
    const timerId = logger.startTimer('mongodb_aggregate', {
      method: 'aggregateWithOptions',
      class: 'MongoService',
      collection: collectionName,
      hint: options?.hint,
    });

    const startTime = Date.now();

    try {
      const collection = await this.getCollection<T>(collectionName);
      const cursor = collection.aggregate<T>(pipeline, options);
      const results = await cursor.toArray();

      logger.logDatabaseOperation(
        'aggregate',
        collectionName,
        { pipeline: pipeline.length + ' stages' },
        Date.now() - startTime,
        results.length,
      );

      logger.endTimer(timerId);
      return results;
    } catch (error) {
      logger.endTimer(timerId);
      logger.error(
        `Aggregation failed on collection ${collectionName}`,
        error,
        {
          collection: collectionName,
          duration_ms: Date.now() - startTime,
          pipeline_stages: pipeline.length,
          hint: options?.hint,
        },
      );
      throw error;
    }
  }

  private setupMonitoring(): void {
    if (!this.client || !config.isDevelopment()) {
      return;
    } // Monitor connection pool events
    this.client.on('connectionPoolCreated', event => {
      logger.debug('Connection pool created', {
        address: event.address,
        options: event.options,
      });
    });

    this.client.on('connectionCreated', event => {
      logger.debug('Connection created', {
        connectionId: event.connectionId,
        address: event.address,
      });
    });

    this.client.on('connectionClosed', event => {
      logger.debug('Connection closed', {
        connectionId: event.connectionId,
        reason: event.reason,
      });
    });

    // Monitor command events in development
    this.client.on('commandStarted', event => {
      logger.debug('MongoDB command started', {
        command: event.commandName,
        collection: event.command?.collection || event.command?.$db,
      });
    });

    this.client.on('commandSucceeded', event => {
      logger.debug('MongoDB command succeeded', {
        command: event.commandName,
        duration: event.duration,
      });
    });

    this.client.on('commandFailed', event => {
      logger.warn('MongoDB command failed', {
        command: event.commandName,
        error: event.failure,
        duration: event.duration,
      });
    });
  }

  private async createIndexes(): Promise<void> {
    try {
      logger.info('Creating database indexes');

      const indexDefinitions: IndexDefinition[] = [
        {
          collection: 'summoners',
          indexes: [
            {
              spec: { name: 1, region: 1 },
              options: { name: 'summoner_name_region', unique: true },
            },
            {
              spec: { puuid: 1 },
              options: { name: 'summoner_puuid', unique: true },
            },
            {
              spec: { updatedAt: 1 },
              options: {
                name: 'summoner_updated_at',
                expireAfterSeconds: 86400,
              }, // 24 hours
            },
            {
              spec: { name: 'text' },
              options: { name: 'summoner_name_text' },
            },
          ],
        },
        {
          collection: 'matches',
          indexes: [
            {
              spec: { 'metadata.matchId': 1 },
              options: { name: 'match_id', unique: true },
            },
            {
              spec: { 'metadata.participants': 1 },
              options: { name: 'match_participants' },
            },
            {
              spec: { 'info.gameCreation': -1 },
              options: { name: 'match_game_creation_desc' },
            },
            {
              spec: { 'info.gameCreation': -1, 'metadata.participants': 1 },
              options: { name: 'match_creation_participants' },
            }, // Optimized indexes for Phase 2.1 MongoDB optimization
            {
              spec: {
                'info.participants.puuid': 1,
                'info.gameEndTimestamp': -1,
                'info.queueId': 1,
              },
              options: { name: 'player_matches_optimized_final' },
            },
            {
              spec: { 'info.participants.puuid': 1, 'info.gameCreation': -1 },
              options: { name: 'player_matches_by_creation_final' },
            },
            {
              spec: {
                'info.participants.puuid': 1,
                'info.gameEndTimestamp': -1,
              },
              options: {
                name: 'aram_player_history_final',
                partialFilterExpression: { 'info.queueId': 450 },
              },
            },
            {
              spec: {
                'info.participants.puuid': 1,
                'info.gameCreation': -1,
                'info.queueId': 1,
              },
              options: { name: 'player_date_queue_final' },
            },
          ],
        },
      ];

      for (const indexDef of indexDefinitions) {
        const collection = await this.getCollection(indexDef.collection);

        for (const { spec, options } of indexDef.indexes) {
          try {
            await collection.createIndex(spec, options);
            logger.info('Index created successfully', {
              collection: indexDef.collection,
              index: options?.name || 'unnamed',
              spec,
            });
          } catch (error: unknown) {
            const mongoError = error as { code?: number; message?: string };
            // Index might already exist, log but don't fail
            if (mongoError.code === 85) {
              // IndexOptionsConflict
              logger.warn('Index already exists with different options', {
                collection: indexDef.collection,
                index: options?.name,
                error: mongoError.message,
              });
            } else {
              logger.error('Failed to create index', error, {
                collection: indexDef.collection,
                index: options?.name,
                spec,
              });
            }
          }
        }
      }

      logger.info('Database indexes creation completed');
    } catch (error) {
      logger.error('Failed to create database indexes', error);
      // Don't throw - app should still work without indexes, just slower
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('MongoDB connection not established');
    }
    return this.db;
  }
}
