'use client';
import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useEffectiveUser } from './useEffectiveUser';

/**
 * Specialized version for user data actions (operations without return data)
 */
export function useUserDataAction() {
  const { effectiveRegion, effectiveName, effectiveTagline } =
    useEffectiveUser();

  const mutation = useMutation<void, Error, (region: string, name: string, tagline: string) => Promise<void>>({
    mutationFn: async (action) => {
      if (!effectiveRegion || !effectiveName || !effectiveTagline) {
        throw new Error('User data not available');
      }
      return await action(effectiveRegion, effectiveName, effectiveTagline);
    },
    retry: 1,
  });

  const executeUserAction = useCallback(
    async (
      action: (region: string, name: string, tagline: string) => Promise<void>,
    ) => {
      return mutation.mutateAsync(action);
    },
    [mutation]
  );

  return {
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    executeUserAction,
    reset: mutation.reset,
    effectiveRegion,
    effectiveName,
    effectiveTagline,
    hasUserData: !!(effectiveRegion && effectiveName && effectiveTagline),
  };
}
