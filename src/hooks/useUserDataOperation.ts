'use client';
import { useCallback, useState } from 'react';
import { useEffectiveUser } from './useEffectiveUser';
import { useAsyncData } from './useAsyncData';

/**
 * Hook that combines useEffectiveUser with async operations
 * Perfect for operations that need user context (region, name, tagline)
 */
export function useUserDataOperation<T = void>() {
  const { effectiveRegion, effectiveName, effectiveTagline } =
    useEffectiveUser();

  const [currentOperation, setCurrentOperation] = useState<
    (() => Promise<T>) | null
  >(null);

  const { loading, error, data, execute, reset } = useAsyncData<T>({
    operation: currentOperation || undefined,
    immediate: false,
  });

  const executeWithUserData = useCallback(
    async (
      operation: (region: string, name: string, tagline: string) => Promise<T>,
    ) => {
      if (!effectiveRegion || !effectiveName || !effectiveTagline) {
        throw new Error('User data not available');
      }

      // Set the operation and execute it
      setCurrentOperation(
        () => () => operation(effectiveRegion, effectiveName, effectiveTagline),
      );
      await execute();
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

  const [currentAction, setCurrentAction] = useState<
    (() => Promise<void>) | null
  >(null);

  const { loading, error, execute, reset } = useAsyncData<void>({
    operation: currentAction || undefined,
    immediate: false,
  });

  const executeUserAction = useCallback(
    async (
      action: (region: string, name: string, tagline: string) => Promise<void>,
    ) => {
      if (!effectiveRegion || !effectiveName || !effectiveTagline) {
        throw new Error('User data not available');
      }

      setCurrentAction(
        () => () => action(effectiveRegion, effectiveName, effectiveTagline),
      );
      await execute();
    },
    [execute, effectiveRegion, effectiveName, effectiveTagline],
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
