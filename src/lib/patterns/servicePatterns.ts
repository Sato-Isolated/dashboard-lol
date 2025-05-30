/**
 * Standardized service patterns for consistent architecture across features
 *
 * This module provides base classes and interfaces that all feature services should extend.
 * It ensures consistency in service implementation and makes the codebase more maintainable.
 */

import { StandardErrorHandler } from './errorHandling';
import {
  BaseService,
  BaseRepository,
  PaginationParams,
  PaginatedResponse,
} from '../../types/coreTypes';
import { logger } from '@/lib/logger/logger';

/**
 * Base repository class that provides common CRUD operations
 */
export abstract class BaseRepositoryImpl<T, ID = string>
  implements BaseRepository<T, ID>
{
  protected abstract collectionName: string;
  protected abstract featureName: string;

  protected get errorHandler() {
    return StandardErrorHandler.createFeatureHandler(this.featureName);
  }

  abstract findById(id: ID): Promise<T | null>;
  abstract create(
    entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<T>;
  abstract update(id: ID, updates: Partial<T>): Promise<T | null>;
  abstract delete(id: ID): Promise<boolean>;

  /**
   * Common method for handling repository operations with standardized error handling
   */
  protected async executeOperation<R>(
    operation: () => Promise<R>,
    operationName: string,
  ): Promise<R> {
    return this.errorHandler.repository(operation, {
      collection: this.collectionName,
      operation: operationName,
    });
  }

  /**
   * Log repository operations for debugging and monitoring
   */
  protected logOperation(
    operation: string,
    id?: ID,
    metadata?: Record<string, unknown>,
  ) {
    logger.info(`Repository operation: ${operation}`, {
      feature: this.featureName,
      collection: this.collectionName,
      id: id?.toString(),
      ...metadata,
    });
  }
}

/**
 * Base service class that provides common business logic patterns
 */
export abstract class BaseServiceImpl<T, ID = string>
  implements BaseService<T, ID>
{
  protected abstract featureName: string;

  protected get errorHandler() {
    return StandardErrorHandler.createFeatureHandler(this.featureName);
  }

  abstract get(id: ID): Promise<T | null>;
  abstract create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  abstract update(id: ID, data: Partial<T>): Promise<T | null>;
  abstract delete(id: ID): Promise<boolean>;

  /**
   * Common method for handling service operations with standardized error handling
   */
  protected async executeOperation<R>(
    operation: () => Promise<R>,
    operationName: string,
  ): Promise<R> {
    const timerId = logger.startTimer(
      `${this.featureName}_service_${operationName}`,
    );
    try {
      const result = await operation();
      logger.endTimer(timerId);
      return result;
    } catch (error) {
      logger.endTimer(timerId);
      throw error;
    }
  }

  /**
   * Log service operations for debugging and monitoring
   */
  protected logOperation(
    operation: string,
    metadata?: Record<string, unknown>,
  ) {
    logger.info(`Service operation: ${operation}`, {
      feature: this.featureName,
      ...metadata,
    });
  }
}

/**
 * Base API client class for external service integrations
 */
export abstract class BaseApiClient {
  protected abstract serviceName: string;
  protected abstract featureName: string;

  protected get errorHandler() {
    return StandardErrorHandler.createFeatureHandler(this.featureName);
  }

  /**
   * Common method for making API calls with standardized error handling and retry logic
   */
  protected async makeApiCall<R>(
    operation: () => Promise<R>,
    endpoint: string,
    retryOptions?: { maxAttempts?: number; baseDelay?: number },
  ): Promise<R> {
    return this.errorHandler.api(
      operation,
      {
        service: this.serviceName,
        endpoint,
      },
      retryOptions,
    );
  }

  /**
   * Log API operations for debugging and monitoring
   */
  protected logApiCall(
    method: string,
    endpoint: string,
    statusCode?: number,
    duration?: number,
    metadata?: Record<string, unknown>,
  ) {
    logger.logApiCall(
      this.serviceName,
      endpoint,
      method,
      statusCode,
      duration,
      undefined, // error will be logged separately if it occurs
    );

    if (metadata) {
      logger.info('API call metadata', {
        feature: this.featureName,
        service: this.serviceName,
        endpoint,
        method,
        ...metadata,
      });
    }
  }
}

/**
 * Standard pagination helper functions
 */
export class PaginationHelper {
  static calculateOffset(page: number, limit: number): number {
    return Math.max(0, (page - 1) * limit);
  }

  static calculateTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  static createPaginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
  ): PaginatedResponse<T> {
    const totalPages = this.calculateTotalPages(total, limit);

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static validatePaginationParams(params: PaginationParams): PaginationParams {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const offset = params.offset || this.calculateOffset(page, limit);

    return { page, limit, offset };
  }
}

/**
 * Standard data transformation patterns
 */
export class DataTransformationHelper {
  /**
   * Transform API response to internal format with standardized fields
   */
  static transformApiResponse<TApi, TInternal>(
    apiData: TApi,
    transformer: (data: TApi) => TInternal,
  ): TInternal {
    try {
      return transformer(apiData);
    } catch (error) {
      logger.error('Data transformation failed', error as Error, {
        apiData:
          typeof apiData === 'object'
            ? JSON.stringify(apiData)
            : String(apiData),
      });
      throw error;
    }
  }
  /**
   * Add standard timestamps to entities
   */
  static addTimestamps<T>(
    entity: T,
    isUpdate = false,
  ): T & { createdAt: Date; updatedAt: Date } {
    const now = new Date();
    return {
      ...entity,
      createdAt: isUpdate
        ? (entity as T & { createdAt?: Date }).createdAt || now
        : now,
      updatedAt: now,
    };
  }

  /**
   * Remove sensitive fields from entities before sending to client
   */
  static sanitizeForClient<T>(
    entity: T,
    sensitiveFields: (keyof T)[],
  ): Omit<T, keyof T> {
    const sanitized = { ...entity };

    for (const field of sensitiveFields) {
      delete sanitized[field];
    }

    return sanitized;
  }
}

