import winston from 'winston';
import { config } from '../config';

// Performance metrics interface
interface PerformanceMetrics {
  startTime: number;
  operation: string;
  metadata?: Record<string, unknown>;
}

// Custom log formats
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

class Logger {
  private winston: winston.Logger;
  private performanceTimers = new Map<string, PerformanceMetrics>();

  constructor() {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: config.get('LOG_LEVEL'),
        format: config.isDevelopment() ? consoleFormat : customFormat,
      }),
    ];

    // Add file transport in production
    if (config.isProduction()) {
      transports.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: customFormat,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: customFormat,
        })
      );
    }

    this.winston = winston.createLogger({
      level: config.get('LOG_LEVEL'),
      format: customFormat,
      transports,
      // Don't exit on handled exceptions
      exitOnError: false,
    });
  }
  info(message: string, meta?: Record<string, unknown>): void {
    this.winston.info(message, meta);
  }

  error(
    message: string,
    error?: Error | unknown,
    meta?: Record<string, unknown>
  ): void {
    const errorMeta = this.formatError(error);
    this.winston.error(message, { ...meta, ...errorMeta });
  }
  warn(message: string, meta?: Record<string, unknown>): void {
    this.winston.warn(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.winston.debug(message, meta);
  }

  // Performance tracking methods
  startTimer(operation: string, metadata?: Record<string, unknown>): string {
    const timerId = `${operation}_${Date.now()}_${Math.random()}`;
    this.performanceTimers.set(timerId, {
      startTime: Date.now(),
      operation,
      metadata,
    });
    return timerId;
  }

  endTimer(timerId: string): void {
    const timer = this.performanceTimers.get(timerId);
    if (!timer) {
      this.warn('Timer not found', { timerId });
      return;
    }

    const duration = Date.now() - timer.startTime;
    /* this.info('Performance metric', {
      operation: timer.operation,
      duration_ms: duration,
      ...timer.metadata,
    }); */

    this.performanceTimers.delete(timerId);
  }

  // Database operation logging
  logDatabaseOperation(
    operation: string,
    collection: string,
    query?: Record<string, unknown>,
    duration?: number,
    resultCount?: number
  ): void {
    this.info('Database operation', {
      operation,
      collection,
      query: query ? this.sanitizeQuery(query) : undefined,
      duration_ms: duration,
      result_count: resultCount,
    });
  }

  // API call logging
  logApiCall(
    service: string,
    endpoint: string,
    method: string,
    statusCode?: number,
    duration?: number,
    error?: Error
  ): void {
    const logLevel =
      error || (statusCode && statusCode >= 400) ? 'error' : 'info';

    this.winston.log(logLevel, 'API call', {
      service,
      endpoint,
      method,
      status_code: statusCode,
      duration_ms: duration,
      error: error ? this.formatError(error) : undefined,
    });
  }

  private formatError(error: Error | unknown): Record<string, unknown> {
    if (error instanceof Error) {
      return {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack,
      };
    }

    if (typeof error === 'string') {
      return { error_message: error };
    }

    return { error: String(error) };
  }
  private sanitizeQuery(
    query: Record<string, unknown>
  ): Record<string, unknown> {
    // Create a copy to avoid modifying original
    const sanitized = JSON.parse(JSON.stringify(query));

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'key', 'secret'];

    const sanitizeObject = (
      obj: Record<string, unknown>
    ): Record<string, unknown> => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      for (const key in obj) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = sanitizeObject(obj[key] as Record<string, unknown>);
        }
      }

      return obj;
    };

    return sanitizeObject(sanitized);
  }
}

// Create singleton instance
export const logger = new Logger();