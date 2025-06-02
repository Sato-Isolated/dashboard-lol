import { logger } from '@/lib/logger/logger';

// Error context interface
interface ErrorContext {
  collection?: string;
  service?: string;
  endpoint?: string;
  [key: string]: unknown;
}

// Custom error classes
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode: string;

  constructor(
    message: string,
    statusCode = 500,
    errorCode = 'INTERNAL_ERROR',
    isOperational = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';

    if (field) {
      this.message = `${field}: ${message}`;
    }
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter?: number;

  constructor(message = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ExternalAPIError extends AppError {
  public readonly service: string;
  public readonly endpoint?: string;
  public readonly originalError?: Error;

  constructor(
    service: string,
    message: string,
    statusCode = 503,
    endpoint?: string,
    originalError?: Error,
  ) {
    super(`${service} API error: ${message}`, statusCode, 'EXTERNAL_API_ERROR');
    this.name = 'ExternalAPIError';
    this.service = service;
    this.endpoint = endpoint;
    this.originalError = originalError;
  }
}

export class DatabaseError extends AppError {
  public readonly operation: string;
  public readonly collection?: string;
  constructor(operation: string, message: string, collection?: string) {
    super(`Database ${operation} failed: ${message}`, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
    this.operation = operation;
    this.collection = collection;
  }
}

// Error handler utility
export class ErrorHandler {
  public static handle(error: Error, context?: ErrorContext): AppError {
    // If it's already an AppError, just log and return
    if (error instanceof AppError) {
      logger.error(`Application error: ${error.message}`, error, {
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        ...context,
      });
      return error;
    } // Handle MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      const dbError = new DatabaseError(
        'operation',
        error.message,
        context?.collection as string,
      );

      logger.error('Database error occurred', error, context);
      return dbError;
    }

    // Handle network errors
    if (
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNREFUSED')
    ) {
      const apiError = new ExternalAPIError(
        context?.service || 'Unknown',
        'Network connection failed',
        503,
        context?.endpoint,
        error,
      );

      logger.error('Network error occurred', error, context);
      return apiError;
    }

    // Handle timeout errors
    if (error.message.includes('timeout') || error.name === 'TimeoutError') {
      const timeoutError = new ExternalAPIError(
        context?.service || 'Unknown',
        'Request timeout',
        504,
        context?.endpoint,
        error,
      );

      logger.error('Timeout error occurred', error, context);
      return timeoutError;
    }

    // Default to internal server error
    logger.error('Unhandled error occurred', error, context);
    return new AppError(
      'An unexpected error occurred',
      500,
      'INTERNAL_ERROR',
      false,
    );
  }

  public static isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }
}

// Retry mechanism with exponential backoff
export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryCondition?: (error: Error) => boolean;
}

export class RetryHandler {
  private static defaultOptions: Required<RetryOptions> = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryCondition: (error: Error) => {
      // Retry on network errors, timeouts, and 5xx errors
      return (
        error.message.includes('ENOTFOUND') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('timeout') ||
        (error instanceof ExternalAPIError && error.statusCode >= 500)
      );
    },
  };
  public static async execute<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {},
    context?: ErrorContext,
  ): Promise<T> {
    const opts = { ...this.defaultOptions, ...options };
    let lastError: Error;

    for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
      try {
        const result = await operation();

        if (attempt > 1) {
          logger.info('Operation succeeded after retry', {
            attempt,
            maxAttempts: opts.maxAttempts,
            ...context,
          });
        }

        return result;
      } catch (error) {
        lastError = error as Error;

        // Don't retry if it's the last attempt
        if (attempt === opts.maxAttempts) {
          break;
        }

        // Check if we should retry this error
        if (!opts.retryCondition(lastError)) {
          logger.info('Error not retryable, failing immediately', {
            error: lastError.message,
            attempt,
            ...context,
          });
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          opts.baseDelay * Math.pow(opts.backoffMultiplier, attempt - 1),
          opts.maxDelay,
        );

        logger.warn('Operation failed, retrying', {
          error: lastError.message,
          attempt,
          nextAttempt: attempt + 1,
          maxAttempts: opts.maxAttempts,
          delayMs: delay,
          ...context,
        });

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // All attempts failed
    logger.error('Operation failed after all retry attempts', lastError!, {
      maxAttempts: opts.maxAttempts,
      ...context,
    });

    throw ErrorHandler.handle(lastError!, context);
  }
}

// Circuit breaker pattern for external services
export class CircuitBreaker {
  private failures = 0;
  private nextAttempt = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly maxFailures = 5,
    private readonly resetTimeout = 60000, // 1 minute
    private readonly name = 'CircuitBreaker',
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new AppError(
          `Circuit breaker is OPEN for ${this.name}`,
          503,
          'CIRCUIT_BREAKER_OPEN',
        );
      }

      this.state = 'HALF_OPEN';
      logger.info('Circuit breaker transitioning to HALF_OPEN', {
        name: this.name,
      });
    }

    try {
      const result = await operation();

      if (this.state === 'HALF_OPEN') {
        this.reset();
        logger.info('Circuit breaker reset to CLOSED', { name: this.name });
      }

      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordFailure(): void {
    this.failures++;

    if (this.failures >= this.maxFailures) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;

      logger.warn('Circuit breaker opened', {
        name: this.name,
        failures: this.failures,
        resetTime: new Date(this.nextAttempt).toISOString(),
      });
    }
  }

  private reset(): void {
    this.failures = 0;
    this.state = 'CLOSED';
    this.nextAttempt = 0;
  }
}
