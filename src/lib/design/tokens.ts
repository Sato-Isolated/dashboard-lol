/**
 * Centralized design tokens to eliminate duplication across UI components
 * This replaces the repeated sizeConfig objects in LoadingState, ErrorState, and EmptyState
 */

export type ComponentSize = 'sm' | 'md' | 'lg';

export interface SizeConfig {
  container: string;
  icon: string;
  text: string;
  title?: string;
  message?: string;
  button?: string;
  emoji?: string;
}

/**
 * Base size configurations used across all state components
 */
export const sizeTokens: Record<ComponentSize, SizeConfig> = {
  sm: {
    container: 'py-6',
    icon: 'w-6 h-6',
    text: 'text-sm',
    title: 'text-base',
    message: 'text-sm',
    button: 'btn-sm',
  },
  md: {
    container: 'py-8',
    icon: 'w-8 h-8',
    text: 'text-base',
    title: 'text-lg',
    message: 'text-base',
    button: 'btn-md',
  },
  lg: {
    container: 'py-12',
    icon: 'w-12 h-12',
    text: 'text-lg',
    title: 'text-xl',
    message: 'text-lg',
    button: 'btn-lg',
  },
};

/**
 * Specialized configurations for different component types
 */
export const loadingStateTokens: Record<ComponentSize, SizeConfig> = {
  sm: {
    ...sizeTokens.sm,
    container: 'py-8',
  },
  md: {
    ...sizeTokens.md,
    container: 'py-12',
  },
  lg: {
    ...sizeTokens.lg,
    container: 'py-16',
    icon: 'w-12 h-12',
  },
};

export const errorStateTokens: Record<ComponentSize, SizeConfig> = {
  sm: {
    ...sizeTokens.sm,
    icon: 'w-8 h-8',
  },
  md: {
    ...sizeTokens.md,
    icon: 'w-12 h-12',
  },
  lg: {
    ...sizeTokens.lg,
    icon: 'w-16 h-16',
  },
};

export const emptyStateTokens: Record<ComponentSize, SizeConfig> = {
  sm: {
    ...sizeTokens.sm,
    container: 'py-8',
    icon: 'w-10 h-10',
    emoji: 'text-4xl',
  },
  md: {
    ...sizeTokens.md,
    container: 'py-12',
    icon: 'w-16 h-16',
    emoji: 'text-6xl',
  },
  lg: {
    ...sizeTokens.lg,
    container: 'py-16',
    icon: 'w-20 h-20',
    emoji: 'text-8xl',
  },
};

/**
 * Helper function to get size configuration for a component type
 */
export function getSizeConfig(
  componentType: 'loading' | 'error' | 'empty' | 'base',
  size: ComponentSize,
): SizeConfig {
  switch (componentType) {
    case 'loading':
      return loadingStateTokens[size];
    case 'error':
      return errorStateTokens[size];
    case 'empty':
      return emptyStateTokens[size];
    case 'base':
    default:
      return sizeTokens[size];
  }
}
