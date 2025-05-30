'use client';
import React from 'react';
import { AnimatedContainer } from '@/components/common/ui/motion/MotionComponents';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface AsyncStateProps {
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error state
   */
  error?: string | Error | null;
  /**
   * Whether data is empty
   */
  isEmpty?: boolean;
  /**
   * Data to check for emptiness (alternative to isEmpty)
   */
  data?: any[] | Record<string, any> | null;
  /**
   * Children to render when not loading, error, or empty
   */
  children: React.ReactNode;
  /**
   * Custom loading component props
   */
  loadingProps?: Partial<React.ComponentProps<typeof LoadingState>>;
  /**
   * Custom error component props
   */
  errorProps?: Partial<React.ComponentProps<typeof ErrorState>>;
  /**
   * Custom empty component props
   */
  emptyProps?: Partial<React.ComponentProps<typeof EmptyState>>;
  /**
   * Retry function for error state
   */
  onRetry?: () => void;
  /**
   * Whether to animate state transitions
   */
  animate?: boolean;
  /**
   * Container className
   */
  className?: string;
}

/**
 * Utility function to check if data is empty
 */
const isDataEmpty = (data: any): boolean => {
  if (data === null || data === undefined) {
    return true;
  }
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  if (typeof data === 'object') {
    return Object.keys(data).length === 0;
  }
  return false;
};

/**
 * Container component that handles async states (loading, error, empty, content)
 * This consolidates the common pattern of handling these states across the app
 */
export const AsyncStateContainer: React.FC<AsyncStateProps> = ({
  loading = false,
  error = null,
  isEmpty,
  data,
  children,
  loadingProps = {},
  errorProps = {},
  emptyProps = {},
  onRetry,
  animate = true,
  className = '',
}) => {
  // Determine if data is empty
  const dataIsEmpty = isEmpty !== undefined ? isEmpty : isDataEmpty(data); // Show loading state
  if (loading) {
    return (
      <AnimatedContainer
        key='loading'
        variant={animate ? 'fadeIn' : undefined}
        className={className}
      >
        <LoadingState {...loadingProps} />
      </AnimatedContainer>
    );
  }

  // Show error state
  if (error) {
    return (
      <AnimatedContainer
        key='error'
        variant={animate ? 'scaleIn' : undefined}
        className={className}
      >
        <ErrorState error={error} onRetry={onRetry} {...errorProps} />
      </AnimatedContainer>
    );
  }

  // Show empty state
  if (dataIsEmpty) {
    return (
      <AnimatedContainer
        key='empty'
        variant={animate ? 'slideUp' : undefined}
        className={className}
      >
        <EmptyState {...emptyProps} />
      </AnimatedContainer>
    );
  }

  // Show content
  return (
    <AnimatedContainer
      key='content'
      variant={animate ? 'slideUp' : undefined}
      className={className}
    >
      {children}
    </AnimatedContainer>
  );
};

export default AsyncStateContainer;
