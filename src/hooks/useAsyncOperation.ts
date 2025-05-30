'use client';
import { useState, useCallback } from 'react';

/**
 * Generic hook for handling async operations with loading and error states
 * Useful for operations like data updates, form submissions, etc.
 */
export function useAsyncOperation<T = void, P extends any[] = []>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (
      operation: (...params: P) => Promise<T>,
      ...params: P
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await operation(...params);
        setData(result);
        return result;
      } catch (e: unknown) {
        const errorMessage =
          e instanceof Error ? e.message : 'An error occurred';
        setError(errorMessage);
        setData(null);
        throw e; // Re-throw for caller to handle if needed
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
}

/**
 * Specialized version for operations that don't return data but might have side effects
 */
export function useAsyncAction<P extends any[] = []>() {
  const { loading, error, execute, reset } = useAsyncOperation<void, P>();

  const executeAction = useCallback(
    async (
      action: (...params: P) => Promise<void>,
      ...params: P
    ): Promise<boolean> => {
      try {
        await execute(action, ...params);
        return true;
      } catch {
        return false;
      }
    },
    [execute],
  );

  return {
    loading,
    error,
    executeAction,
    reset,
  };
}
