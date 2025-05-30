'use client';
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import useSWR from 'swr';
import { apiCache } from '@/lib/cache/CacheManager';
import { clientLogger } from '@/lib/logger/clientLogger';
import type { AsyncState } from '@/types/coreTypes';

interface UseAsyncDataOptions<T> {
  // Fetch options
  url?: string | null;
  enabled?: boolean;

  // Cache options
  cacheKey?: string;
  cacheTTL?: number;
  useSWR?: boolean;
  staleWhileRevalidate?: boolean;
  dedupe?: boolean;

  // Retry options
  retryCount?: number;
  retryDelay?: number;

  // Custom operation
  operation?: () => Promise<T>;

  // Dependencies for operation
  dependencies?: React.DependencyList;

  // Auto-execute on mount
  immediate?: boolean;
}

export interface UseAsyncDataResult<T> extends AsyncState<T> {
  execute: () => Promise<void>;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
  reset: () => void;
}

/**
 * Unified hook for all async data operations
 */
export function useAsyncData<T = unknown>(
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataResult<T> {
  const {
    url,
    enabled = true,
    cacheKey = url || '',
    cacheTTL,
    useSWR: shouldUseSWR = false,
    staleWhileRevalidate = true,
    dedupe = true,    retryCount = 3,
    retryDelay = 1000,
    operation,
    immediate = true,
  } = options;

  // Base async state
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for request management
  const abortControllerRef = useRef<AbortController | null>(null);
  const inflightRequests = useRef(new Set<string>());

  // Default fetcher for URLs
  const defaultFetcher = async (url: string) => {
    const res = await fetch(url, {
      signal: abortControllerRef.current?.signal,
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  };

  // SWR integration for URLs
  const swrKey = shouldUseSWR && url ? [url, cacheKey] : null;
  const {
    data: swrData,
    error: swrError,
    isLoading: swrLoading,
    mutate: swrMutate,
  } = useSWR<T>(swrKey, ([url]) => defaultFetcher(url), {
    revalidateOnFocus: false,
  });  // Memoize configuration to prevent unnecessary updates and re-renders
  const config = useMemo(() => ({
    enabled,
    operation,
    url,
    cacheKey,
    cacheTTL,
    shouldUseSWR,
    staleWhileRevalidate,
    dedupe,
    retryCount,
    retryDelay,
  }), [
    enabled,
    operation,
    url,
    cacheKey,
    cacheTTL,
    shouldUseSWR,
    staleWhileRevalidate,
    dedupe,
    retryCount,
    retryDelay,
  ]);

  // Use a ref to store the latest config for executeOperation
  const configRef = useRef(config);
  configRef.current = config;
  // Main execution function - simplified dependencies
  const executeOperation = useCallback(
    async (useCache = true) => {
      const config = configRef.current;

      if (!config.enabled) {
        return;
      }

      const operationToRun =
        config.operation ||
        (config.url ? () => defaultFetcher(config.url!) : null);
      if (!operationToRun) {
        return;
      }

      const timerId = clientLogger.startTimer('async_operation', {
        url: config.url,
        cacheKey: config.cacheKey,
      });

      try {
        // Check cache first (only for non-SWR operations)
        if (!config.shouldUseSWR && useCache && config.cacheKey) {
          const cached = apiCache.get<T>(config.cacheKey);
          if (cached) {
            setData(cached);
            setError(null);

            if (config.staleWhileRevalidate) {
              executeOperation(false); // Background refresh
            }

            clientLogger.endTimer(timerId);
            return;
          }
        }

        // Dedupe concurrent requests
        if (config.dedupe && inflightRequests.current.has(config.cacheKey)) {
          clientLogger.endTimer(timerId);
          return;
        }

        inflightRequests.current.add(config.cacheKey);
        setLoading(true);
        setError(null);

        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        // Retry logic
        let attempt = 0;
        let lastError: Error | null = null;

        while (attempt < config.retryCount) {
          try {
            const result = await operationToRun();

            // Cache the result (only for non-SWR operations)
            if (!config.shouldUseSWR && config.cacheKey) {
              apiCache.set(config.cacheKey, result, config.cacheTTL);
            }

            setData(result);
            setError(null);

            clientLogger.endTimer(timerId);
            clientLogger.info('Async operation successful', {
              url: config.url,
              cacheKey: config.cacheKey,
              attempt: attempt + 1,
            });

            break;
          } catch (err) {
            lastError = err as Error;

            if (err instanceof Error && err.name === 'AbortError') {
              break;
            }

            attempt++;
            if (attempt < config.retryCount) {
              await new Promise(resolve =>
                setTimeout(resolve, config.retryDelay * attempt)
              );
            }
          }
        }

        if (lastError && attempt >= config.retryCount) {
          setError(lastError.message);
          clientLogger.error('Async operation failed after retries', {
            error: lastError.message,
            url: config.url,
            cacheKey: config.cacheKey,
            attempts: attempt,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        clientLogger.error('Async operation error', {
          error: err instanceof Error ? err.message : 'Unknown error',
          url: config.url,
          cacheKey: config.cacheKey,
        });
      } finally {
        setLoading(false);
        inflightRequests.current.delete(config.cacheKey);
        clientLogger.endTimer(timerId);
      }
    },
    [] // No dependencies - use configRef for all values
  );
  // Sync SWR state when using SWR - modern approach with direct state updates
  const swrSyncedState = useMemo(() => {
    if (!shouldUseSWR) {
      return null; // Don't sync if not using SWR
    }

    return {
      data: swrData ?? null,
      loading: swrLoading,
      error: swrError
        ? swrError instanceof Error
          ? swrError.message
          : String(swrError)
        : null,
    };
  }, [shouldUseSWR, swrData, swrLoading, swrError]);

  // Apply SWR state synchronously when needed
  if (shouldUseSWR && swrSyncedState) {
    if (data !== swrSyncedState.data && swrSyncedState.data !== undefined) {
      setData(swrSyncedState.data);
    }
    if (loading !== swrSyncedState.loading) {
      setLoading(swrSyncedState.loading);
    }
    if (error !== swrSyncedState.error) {
      setError(swrSyncedState.error);
    }
  }  // Auto-execute on mount - optimized with useRef to avoid re-executions
  const hasExecutedRef = useRef(false);
  const lastUrlRef = useRef(url);
  
  // Reset execution flag when URL changes
  if (lastUrlRef.current !== url) {
    lastUrlRef.current = url;
    hasExecutedRef.current = false;
  }
  
  if (immediate && !shouldUseSWR && enabled && !hasExecutedRef.current) {
    hasExecutedRef.current = true;
    executeOperation();
  }

  // Cleanup on unmount - optimized using existing abort controller
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refetch = useCallback(async () => {
    const config = configRef.current;

    if (config.shouldUseSWR) {
      await swrMutate();
    } else {
      if (config.cacheKey) {
        apiCache.delete(config.cacheKey);
      }
      await executeOperation(false);
    }
  }, [swrMutate, executeOperation]);

  const mutate = useCallback(
    (newData: T) => {
      const config = configRef.current;

      if (config.shouldUseSWR) {
        swrMutate(newData, false);
      } else {
        setData(newData);
        if (config.cacheKey) {
          apiCache.set(config.cacheKey, newData, config.cacheTTL);
        }
      }
    },
    [swrMutate]
  );

  const reset = useCallback(() => {
    const config = configRef.current;

    setData(null);
    setLoading(false);
    setError(null);
    if (config.cacheKey) {
      apiCache.delete(config.cacheKey);
    }
  }, []);
  return {
    data,
    loading,
    error,
    execute: executeOperation,
    refetch,
    mutate,
    reset,
  };
}
