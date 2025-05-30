'use client';
import { useCallback } from 'react';
import { useEffectiveUser } from './useEffectiveUser';
import { useAsyncOperation, useAsyncAction } from './useAsyncOperation';

/**
 * Hook that combines useEffectiveUser with async operations
 * Perfect for operations that need user context (region, name, tagline)
 */
export function useUserDataOperation<T = void>() {
  const { effectiveRegion, effectiveName, effectiveTagline } =
    useEffectiveUser();
  const { loading, error, data, execute, reset } = useAsyncOperation<
    T,
    [string, string, string]
  >();
  const executeWithUserData = useCallback(
    async (
      operation: (region: string, name: string, tagline: string) => Promise<T>,
    ): Promise<T | null> => {
      if (!effectiveRegion || !effectiveName || !effectiveTagline) {
        throw new Error('User data not available');
      }

      return execute(
        operation,
        effectiveRegion,
        effectiveName,
        effectiveTagline,
      );
    },
    [execute, effectiveRegion, effectiveName, effectiveTagline],
  );

  return {
    loading,
    error,
    data,
    executeWithUserData,
    reset,
    // Also expose the user data for convenience
    effectiveRegion,
    effectiveName,
    effectiveTagline,
    hasUserData: !!(effectiveRegion && effectiveName && effectiveTagline),
  };
}

/**
 * Specialized version for user data actions (operations without return data)
 */
export function useUserDataAction() {
  const { effectiveRegion, effectiveName, effectiveTagline } =
    useEffectiveUser();
  const { loading, error, executeAction, reset } =
    useAsyncAction<[string, string, string]>();

  const executeUserAction = useCallback(
    async (
      action: (region: string, name: string, tagline: string) => Promise<void>,
    ): Promise<boolean> => {
      if (!effectiveRegion || !effectiveName || !effectiveTagline) {
        throw new Error('User data not available');
      }

      return executeAction(
        action,
        effectiveRegion,
        effectiveName,
        effectiveTagline,
      );
    },
    [executeAction, effectiveRegion, effectiveName, effectiveTagline],
  );

  return {
    loading,
    error,
    executeUserAction,
    reset,
    effectiveRegion,
    effectiveName,
    effectiveTagline,
    hasUserData: !!(effectiveRegion && effectiveName && effectiveTagline),
  };
}
