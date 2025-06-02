/**
 * Standardized service patterns for consistent architecture across features
 *
 * This module provides base classes and interfaces that all feature services should extend.
 * It ensures consistency in service implementation and makes the codebase more maintainable.
 */

import { StandardErrorHandler } from './errorHandling';
import {
  BaseRepository,
} from '../../types/coreTypes';

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
}