import { logger } from '@/lib/logger/logger';

export class PerformanceLogger {
  private timerId: string;
  private operation: string;
  private startTime: number;
  private metadata?: Record<string, unknown>;

  constructor(operation: string, metadata?: Record<string, unknown>) {
    this.operation = operation;
    this.metadata = metadata;
    this.startTime = Date.now();
    this.timerId = logger.startTimer(operation, metadata);
  }

  success<T>(result?: T): void {
    const duration = Date.now() - this.startTime;
    logger.endTimer(this.timerId);

    logger.info(`Operation ${this.operation} completed successfully`, {
      operation: this.operation,
      duration_ms: duration,
      result_count: Array.isArray(result) ? result.length : undefined,
      ...this.metadata,
    });
  }

  error(error: Error): void {
    const duration = Date.now() - this.startTime;
    logger.endTimer(this.timerId);

    logger.error(`Operation ${this.operation} failed`, error, {
      operation: this.operation,
      duration_ms: duration,
      ...this.metadata,
    });
  }

  warn(message: string, additionalMeta?: Record<string, unknown>): void {
    logger.warn(`${this.operation}: ${message}`, {
      operation: this.operation,
      ...this.metadata,
      ...additionalMeta,
    });
  }

  log(message: string, additionalMeta?: Record<string, unknown>): void {
    logger.info(`${this.operation}: ${message}`, {
      operation: this.operation,
      ...this.metadata,
      ...additionalMeta,
    });
  }
}
