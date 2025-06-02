import { z } from 'zod';

// Load environment variables
if (typeof window === 'undefined') {
  // Only load dotenv on server side
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv-safe').config({
    allowEmptyValues: true,
    silent: false,
  });
}

// Configuration schema with validation
const configSchema = z.object({
  // Database
  DB_CONN_STRING: z.string().min(1, 'Database connection string is required'),
  DB_NAME: z.string().min(1, 'Database name is required'),

  // Riot API
  RIOT_API_KEY: z.string().min(1, 'Riot API key is required'),
  RIOT_API_BASE_URL: z.string().url().default('https://na1.api.riotgames.com'),

  // Development mode
  DEV_MODE_MOCK_API: z
    .string()
    .transform(val => val === 'true')
    .default('false'),

  // Application
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.string().transform(Number).default('3000'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Rate Limiting
  RIOT_API_RATE_LIMIT_PER_SECOND: z.string().transform(Number).default('20'),
  RIOT_API_RATE_LIMIT_PER_MINUTE: z.string().transform(Number).default('100'),

  // Cache Settings (for future Redis implementation)
  CACHE_TTL_SUMMONER: z.string().transform(Number).default('3600'), // 1 hour
  CACHE_TTL_MATCHES: z.string().transform(Number).default('1800'), // 30 minutes
  CACHE_TTL_RANKINGS: z.string().transform(Number).default('300'), // 5 minutes
});

type Config = z.infer<typeof configSchema>;

class ConfigService {
  private static instance: ConfigService;
  private config: Config;

  private constructor() {
    try {
      // Load environment variables
      const env = {
        DB_CONN_STRING: process.env.DB_CONN_STRING,
        DB_NAME: process.env.DB_NAME,
        RIOT_API_KEY: process.env.RIOT_API_KEY,
        RIOT_API_BASE_URL: process.env.RIOT_API_BASE_URL,
        DEV_MODE_MOCK_API: process.env.DEV_MODE_MOCK_API,
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        LOG_LEVEL: process.env.LOG_LEVEL,
        RIOT_API_RATE_LIMIT_PER_SECOND:
          process.env.RIOT_API_RATE_LIMIT_PER_SECOND,
        RIOT_API_RATE_LIMIT_PER_MINUTE:
          process.env.RIOT_API_RATE_LIMIT_PER_MINUTE,
        CACHE_TTL_SUMMONER: process.env.CACHE_TTL_SUMMONER,
        CACHE_TTL_MATCHES: process.env.CACHE_TTL_MATCHES,
        CACHE_TTL_RANKINGS: process.env.CACHE_TTL_RANKINGS,
      };

      // Validate configuration
      this.config = configSchema.parse(env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingFields = error.errors.map(
          e => `${e.path.join('.')}: ${e.message}`,
        );
        throw new Error(
          `Configuration validation failed:\n${missingFields.join('\n')}`,
        );
      }
      throw error;
    }
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  public getAll(): Config {
    return { ...this.config };
  }

  public isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  public isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }
}

export const config = ConfigService.getInstance();
export type { Config };
