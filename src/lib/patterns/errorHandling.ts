/**
 * Standardized error handling patterns for the entire application
 *
 * This module provides consistent error handling across all features and services.
 * It builds upon the existing error handling system to provide standardized patterns.
 */

import { NextResponse } from 'next/server';
import {
  AppError,
  ValidationError,
  NotFoundError,
  ExternalAPIError,
  DatabaseError,
  ErrorHandler as BaseErrorHandler,
  RetryHandler,
} from '@/lib/globalErrorHandler';
import { logger } from '@/lib/logger/logger';

/**
 * Standardized error handling patterns for different types of operations
 */
export class StandardErrorHandler {
  /**
   * Handle repository/database operations with consistent error patterns
   */
  static async handleRepositoryOperation<T>(
    operation: () => Promise<T>,
    context: {
      collection: string;
      operation: string;
      feature: string;
    },
  ): Promise<T> {
    const timerId = logger.startTimer(
      `${context.feature}_${context.operation}`,
    );
    try {
      const result = await operation();

      logger.endTimer(timerId);
      return result;
    } catch (error) {
      logger.endTimer(timerId);

      const appError = BaseErrorHandler.handle(error as Error, {
        collection: context.collection,
        operation: context.operation,
        feature: context.feature,
      });

      throw appError;
    }
  }

  /**
   * Handle API service operations with retry logic and circuit breaker
   */
  static async handleApiOperation<T>(
    operation: () => Promise<T>,
    context: {
      service: string;
      endpoint: string;
      feature: string;
    },
    retryOptions?: {
      maxAttempts?: number;
      baseDelay?: number;
    },
  ): Promise<T> {
    const timerId = logger.startTimer(
      `${context.feature}_api_${context.service}`,
    );

    try {
      const result = await RetryHandler.execute(
        operation,
        {
          maxAttempts: retryOptions?.maxAttempts || 3,
          baseDelay: retryOptions?.baseDelay || 1000,
        },
        {
          service: context.service,
          endpoint: context.endpoint,
          feature: context.feature,
        },
      );

      logger.endTimer(timerId);
      return result;
    } catch (error) {
      logger.endTimer(timerId);
      throw error;
    }
  }

  /**
   * Handle component operations with user-friendly error messages
   */
  static async handleComponentOperation<T>(
    operation: () => Promise<T>,
    context: {
      component: string;
      feature: string;
      operation: string;
    },
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const data = await operation();
      return { data, error: null };
    } catch (error) {
      logger.error('Component operation failed', error as Error, {
        component: context.component,
        feature: context.feature,
        operation: context.operation,
      });

      // Convert technical errors to user-friendly messages
      let userMessage = 'An unexpected error occurred';

      if (error instanceof ValidationError) {
        userMessage = error.message;
      } else if (error instanceof NotFoundError) {
        userMessage = 'The requested data was not found';
      } else if (error instanceof ExternalAPIError) {
        userMessage = 'Unable to fetch data from external service';
      } else if (error instanceof DatabaseError) {
        userMessage = 'Unable to access data storage';
      }

      return { data: null, error: userMessage };
    }
  }

  /**
   * Create feature-specific error handlers with pre-configured context
   */
  static createFeatureHandler(featureName: string) {
    return {
      repository: <T>(
        operation: () => Promise<T>,
        context: { collection: string; operation: string },
      ) =>
        this.handleRepositoryOperation(operation, {
          ...context,
          feature: featureName,
        }),

      api: <T>(
        operation: () => Promise<T>,
        context: { service: string; endpoint: string },
        retryOptions?: { maxAttempts?: number; baseDelay?: number },
      ) =>
        this.handleApiOperation(
          operation,
          { ...context, feature: featureName },
          retryOptions,
        ),

      component: <T>(
        operation: () => Promise<T>,
        context: { component: string; operation: string },
      ) =>
        this.handleComponentOperation(operation, {
          ...context,
          feature: featureName,
        }),
    };
  }
}

/**
 * API Route Error Handling Utilities
 * Consolidates simple error handling patterns for Next.js API routes
 */
export class ApiRouteErrorHandler {
  /**
   * Convert any error to appropriate NextResponse with proper status codes
   * Replaces the simple apiErrorHandler function with standardized error handling
   */
  static handleRouteError(error: unknown): NextResponse {
    // If it's already an AppError, use its properties
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: error.message,
          errorCode: error.errorCode,
        },
        { status: error.statusCode },
      );
    }

    // Handle unknown errors by parsing message content
    const message =
      (error as { message?: string })?.message || 'Internal server error';
    let status = 500;

    // Parse message content for status codes (backward compatibility)
    if (message.includes('Unauthorized')) {
      status = 401;
    } else if (message.includes('Forbidden')) {
      status = 403;
    } else if (message.includes('not found')) {
      status = 404;
    } else if (message.includes('Rate limit')) {
      status = 429;
    } else if (message.includes('Unsupported')) {
      status = 415;
    } else if (message.includes('Service unavailable')) {
      status = 503;
    } else if (message.includes('Gateway timeout')) {
      status = 504;
    } else if (message.includes('Bad gateway')) {
      status = 502;
    } else if (message.includes('Method not allowed')) {
      status = 405;
    }

    return NextResponse.json({ error: message }, { status });
  }

  /**
   * Standardized success response helper
   */
  static success<T>(data: T, status = 200): NextResponse {
    return NextResponse.json(data, { status });
  }

  /**
   * Standardized error response helper
   */
  static error(message: string, status = 500): NextResponse {
    return NextResponse.json({ error: message }, { status });
  }
}

// Export all error classes for consistency
export {
  AppError,
  ValidationError,
  NotFoundError,
  ExternalAPIError,
  DatabaseError,
  RetryHandler,
  CircuitBreaker,
} from '@/lib/globalErrorHandler';

