import { config } from '@/lib/config';
import { logger } from '@/lib/logger/logger';
import {
  RetryHandler,
  CircuitBreaker,
  RateLimitError,
  ExternalAPIError,
} from '@/lib/globalErrorHandler';
import { regionSchema, regionalRegionSchema } from '@/lib/validation/schemas';

interface RateLimitConfig {
  perSecond: number;
  perTwoMinutes: number;
}

interface RateLimitState {
  requestsThisSecond: number;
  requestsThisTwoMinutes: number;
  lastSecondReset: number;
  lastTwoMinutesReset: number;
}

export abstract class RiotApiClient {
  protected readonly apiKey: string;
  protected readonly baseUrl: string;
  private readonly circuitBreaker: CircuitBreaker;

  private readonly rateLimits: RateLimitConfig = {
    perSecond: config.get('RIOT_API_RATE_LIMIT_PER_SECOND'),
    perTwoMinutes: config.get('RIOT_API_RATE_LIMIT_PER_MINUTE'),
  };

  private rateLimitState: RateLimitState = {
    requestsThisSecond: 0,
    requestsThisTwoMinutes: 0,
    lastSecondReset: Date.now(),
    lastTwoMinutesReset: Date.now(),
  };

  private readonly SECOND_MS = 1000;
  private readonly TWO_MINUTES_MS = 120000;
  private readonly RATE_LIMIT_CHECK_INTERVAL_MS = 100; // Increased from 50ms
  private readonly MIN_DELAY_BETWEEN_REQUESTS_MS = 2000; // 2 seconds minimum delay

  constructor(region: string, customRateLimits?: Partial<RateLimitConfig>) {
    // Validate region - accept both platform regions and regional regions
    const platformRegionValidation = regionSchema.safeParse(region);
    const regionalRegionValidation = regionalRegionSchema.safeParse(region);

    if (
      !platformRegionValidation.success &&
      !regionalRegionValidation.success
    ) {
      throw new Error(
        `Invalid region: ${region}. Must be a valid platform region (e.g., 'euw1', 'na1') or regional region (e.g., 'europe', 'americas')`
      );
    }

    const key = config.get('RIOT_API_KEY');
    this.apiKey = key;
    this.baseUrl = `https://${region}.api.riotgames.com`;
    this.circuitBreaker = new CircuitBreaker(5, 60000, `RiotAPI_${region}`);

    if (customRateLimits) {
      this.rateLimits = { ...this.rateLimits, ...customRateLimits };
    }

    logger.info('RiotApiClient initialized', {
      region,
      baseUrl: this.baseUrl,
      rateLimits: this.rateLimits,
    });
  }

  private resetRateLimitCountersIfNeeded(): void {
    const now = Date.now();

    if (now - this.rateLimitState.lastSecondReset >= this.SECOND_MS) {
      this.rateLimitState.requestsThisSecond = 0;
      this.rateLimitState.lastSecondReset = now;
    }

    if (now - this.rateLimitState.lastTwoMinutesReset >= this.TWO_MINUTES_MS) {
      this.rateLimitState.requestsThisTwoMinutes = 0;
      this.rateLimitState.lastTwoMinutesReset = now;
    }
  }

  private isRateLimited(): boolean {
    return (
      this.rateLimitState.requestsThisSecond >= this.rateLimits.perSecond ||
      this.rateLimitState.requestsThisTwoMinutes >=
        this.rateLimits.perTwoMinutes
    );
  }
  private async waitForRateLimit(): Promise<void> {
    while (this.isRateLimited()) {
      await new Promise(resolve =>
        setTimeout(resolve, this.RATE_LIMIT_CHECK_INTERVAL_MS)
      );
      this.resetRateLimitCountersIfNeeded();
    }

    // Always wait minimum delay between requests
    await new Promise(resolve =>
      setTimeout(resolve, this.MIN_DELAY_BETWEEN_REQUESTS_MS)
    );
  }

  private incrementRateLimitCounters(): void {
    this.rateLimitState.requestsThisSecond++;
    this.rateLimitState.requestsThisTwoMinutes++;
  }

  private async enforceRateLimit(): Promise<void> {
    this.resetRateLimitCountersIfNeeded();
    await this.waitForRateLimit();
    this.incrementRateLimitCounters();
  }
  protected async fetch<T>(endpoint: string): Promise<T> {
    const fullUrl = `${this.baseUrl}${endpoint}`;

    return await this.circuitBreaker.execute(async () => {
      return await RetryHandler.execute(
        async () => {
          await this.enforceRateLimit();

          const startTime = Date.now();

          logger.info('Making API request', {
            service: 'RiotAPI',
            endpoint,
            url: fullUrl,
          });

          try {
            const response = await fetch(fullUrl, {
              headers: {
                'X-Riot-Token': this.apiKey,
              },
              next: { revalidate: 60 }, // Cache for 60 seconds
            });

            const duration = Date.now() - startTime;

            if (!response.ok) {
              await this.handleHttpError(response, endpoint, duration);
            }

            const data = await this.parseResponse<T>(response);

            logger.logApiCall(
              'RiotAPI',
              endpoint,
              'GET',
              response.status,
              duration
            );

            return data;
          } catch (error) {
            const duration = Date.now() - startTime;

            logger.logApiCall(
              'RiotAPI',
              endpoint,
              'GET',
              undefined,
              duration,
              error as Error
            );

            throw error;
          }
        },
        {
          maxAttempts: 3,
          baseDelay: 1000,
          retryCondition: (error: Error) => {
            // Retry on network errors and 5xx status codes, but not on 4xx
            return (
              !error.message.includes('401') &&
              !error.message.includes('403') &&
              !error.message.includes('404') &&
              !error.message.includes('429')
            ); // Don't retry rate limits
          },
        },
        {
          service: 'RiotAPI',
          endpoint,
          url: fullUrl,
        }
      );
    });
  }

  private async handleHttpError(
    response: Response,
    endpoint: string,
    duration: number
  ): Promise<never> {
    const errorBody = await response.text().catch(() => 'No error details');

    logger.warn('API request failed', {
      service: 'RiotAPI',
      endpoint,
      status: response.status,
      statusText: response.statusText,
      duration,
      errorBody: errorBody.substring(0, 500), // Limit error body length
    });

    switch (response.status) {
      case 429:
        // Parse Retry-After header if available
        const retryAfter = response.headers.get('Retry-After');
        const retryAfterSeconds = retryAfter ? parseInt(retryAfter) : undefined;
        throw new RateLimitError('Rate limit exceeded', retryAfterSeconds);

      case 401:
        throw new ExternalAPIError(
          'RiotAPI',
          'Unauthorized: Invalid API key',
          401,
          endpoint
        );

      case 403:
        throw new ExternalAPIError(
          'RiotAPI',
          'Forbidden: API key lacks required permissions',
          403,
          endpoint
        );

      case 404:
        throw new ExternalAPIError(
          'RiotAPI',
          'Resource not found',
          404,
          endpoint
        );

      case 500:
      case 502:
      case 503:
      case 504:
        throw new ExternalAPIError(
          'RiotAPI',
          `Server error: ${response.statusText}`,
          response.status,
          endpoint
        );

      default:
        throw new ExternalAPIError(
          'RiotAPI',
          `HTTP ${response.status}: ${response.statusText}. Details: ${errorBody}`,
          response.status,
          endpoint
        );
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const text = await response.text();

    if (!text.trim()) {
      throw new Error('Received empty response body');
    }

    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${
          error instanceof Error ? error.message : 'Unknown parsing error'
        }`
      );
    }
  }
}
