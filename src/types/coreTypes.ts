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
export * from './index';


export interface BaseRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: ID, updates: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}

// Common UI component prop types to reduce duplication
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SizeVariantProps {
    size?: 'sm' | 'md' | 'lg';
}

export interface StateComponentProps
  extends BaseComponentProps,
    SizeVariantProps {
  fullHeight?: boolean;
}
