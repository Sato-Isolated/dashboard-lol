/**
 * Standardized TypeScript interfaces and types for the entire application
 *
 * This module provides consistent type definitions that are used across all features.
 * It ensures type safety and consistency throughout the codebase.
 *
 * Architecture Guidelines:
 * - All feature-specific types should extend from these base types
 * - API response types are defined in the shared/types/api directory
 * - Database collection types are defined in each feature's types directory
 * - UI/Component types are defined in the shared/types directory or feature-specific types
 */

// Re-export all shared types for easy access
export * from "./index";

// Base interfaces that other types should extend
export interface BaseEntity {
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface BaseApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
  readonly requestId?: string;
}

export interface BaseRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  create(entity: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: ID, updates: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}

export interface BaseService<T, ID = string> {
  get(id: ID): Promise<T | null>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}

// Pagination interfaces
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// Validation interfaces
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  field?: string;
}

export interface PaginatedResponse<T> extends BaseApiResponse<T[]> {
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
    readonly hasNext: boolean;
    readonly hasPrev: boolean;
  };
}

// Error handling types
export interface ErrorContext {
  readonly feature?: string;
  readonly component?: string;
  readonly operation?: string;
  readonly userId?: string;
  readonly requestId?: string;
  readonly metadata?: Record<string, unknown>;
}

// Loading and status types
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly lastUpdated?: Date;
}

export interface ComponentState<T> extends AsyncState<T> {
  readonly refetch: () => void;
  readonly reset: () => void;
}
