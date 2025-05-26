/**
 * Optimized API hooks with caching, memoization, and performance monitoring
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { apiCache } from "@/shared/lib/cache/CacheManager";
import { clientLogger } from "@/shared/lib/logger/client-logger";

interface UseOptimizedFetchOptions {
  cacheKey?: string;
  cacheTTL?: number;
  enabled?: boolean;
  staleWhileRevalidate?: boolean;
  dedupe?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export interface UseOptimizedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

/**
 * Optimized fetch hook with caching and performance monitoring
 */
export function useOptimizedFetch<T>(
  url: string | null,
  options: UseOptimizedFetchOptions = {}
): UseOptimizedFetchResult<T> {
  const {
    cacheKey = url || "",
    cacheTTL,
    enabled = true,
    staleWhileRevalidate = true,
    dedupe = true,
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inflightRequests = useRef(new Set<string>());
  const lastSuccessfulFetchRef = useRef<string>("");
  const isFirstRenderRef = useRef(true);  const fetchData = useCallback(
    async (useCache = true) => {
      if (!url || !enabled) {
        setError(null);
        setLoading(false);
        return;
      }

      const timerId = clientLogger.startTimer("api_fetch", { url, cacheKey });

      try {        // Check cache first
        if (useCache && cacheKey) {
          const cached = apiCache.get<T>(cacheKey);
          if (cached) {
            setData(cached);
            setError(null);

            // If stale-while-revalidate, fetch in background
            if (staleWhileRevalidate) {
              fetchData(false); // Fetch without using cache
            }
            clientLogger.endTimer(timerId);
            clientLogger.info("Cache hit", { url, cacheKey });
            return;
          }
        }        // Dedupe concurrent requests
        if (dedupe && inflightRequests.current.has(cacheKey)) {
          clientLogger.endTimer(timerId);
          return;
        }

        inflightRequests.current.add(cacheKey);
        setLoading(true);
        setError(null);

        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        let attempt = 0;
        let lastError: Error | null = null;        while (attempt < retryCount) {
          try {
            // Add timeout monitoring
            const timeoutId = setTimeout(() => {
              if (abortControllerRef.current) {
                abortControllerRef.current.abort();
              }
            }, 10000);

            const response = await fetch(url, {
              signal: abortControllerRef.current.signal,
              headers: {
                "Content-Type": "application/json",
              },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(
                `HTTP ${response.status}: ${response.statusText}`
              );
            }

            const result = await response.json();            // Cache the result
            if (cacheKey) {
              apiCache.set(cacheKey, result, cacheTTL);
            }

            setData(result);
            setError(null);
            clientLogger.endTimer(timerId);
            clientLogger.info("API fetch successful", {
              url,
              cacheKey,
              attempt: attempt + 1,
              cached: !useCache,
            });

            break;
          } catch (err) {
            lastError = err as Error;

            if (err instanceof Error && err.name === "AbortError") {
              break;
            }

            attempt++;

            if (attempt < retryCount) {
              await new Promise((resolve) =>
                setTimeout(resolve, retryDelay * attempt)
              );
            }
          }
        }
        if (lastError && attempt >= retryCount) {
          setError(lastError.message);
          clientLogger.error("API fetch failed after retries", {
            error: lastError.message,
            url,
            cacheKey,
            attempts: attempt,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        clientLogger.error("API fetch error", {
          error: err instanceof Error ? err.message : "Unknown error",
          url,
          cacheKey,
        });
      } finally {
        setLoading(false);
        inflightRequests.current.delete(cacheKey);
        clientLogger.endTimer(timerId);
      }
    },
    [
      url,
      enabled,
      cacheKey,
      cacheTTL,
      staleWhileRevalidate,
      dedupe,
      retryCount,
      retryDelay,
    ]
  );

  const refetch = useCallback(async () => {
    if (cacheKey) {
      apiCache.delete(cacheKey);
    }
    await fetchData(false);
  }, [fetchData, cacheKey]);

  const mutate = useCallback(
    (newData: T) => {
      setData(newData);
      if (cacheKey) {
        apiCache.set(cacheKey, newData, cacheTTL);
      }
    },
    [cacheKey, cacheTTL]
  );
  // Reset state when URL changes or becomes null
  useEffect(() => {
    if (!url) {
      setData(null);
      setError(null);
      setLoading(false);
    }
  }, [url]);  useEffect(() => {
    const fetchKey = `${url}:${enabled}:${cacheKey}`;

    // Only proceed if we have a valid URL and are enabled
    if (!url || !enabled) {
      return;
    }

    // Prevent unnecessary re-fetches of the same data
    if (
      !isFirstRenderRef.current &&
      lastSuccessfulFetchRef.current === fetchKey &&
      data !== null
    ) {
      return;
    }

    // Don't abort if this is just a re-render with the same parameters
    if (
      lastSuccessfulFetchRef.current === fetchKey &&
      inflightRequests.current.has(cacheKey)
    ) {
      return;
    }

    // Only abort if we're actually changing the request
    if (
      abortControllerRef.current &&
      lastSuccessfulFetchRef.current !== fetchKey
    ) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    isFirstRenderRef.current = false;
    lastSuccessfulFetchRef.current = fetchKey;

    fetchData();

    return () => {
      // Only abort on unmount or URL change, not on every re-render
      if (lastSuccessfulFetchRef.current !== fetchKey) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
      }
    };
  }, [url, enabled, cacheKey]);
  return useMemo(
    () => ({
      data,
      loading,
      error,
      refetch,
      mutate,
    }),
    [data, loading, error, refetch, mutate]
  );
}

/**
 * Optimized hook for summoner data with smart caching
 */
export function useOptimizedSummoner(
  region: string,
  name: string,
  tagline: string
) {
  const cacheKey = `summoner:${region}:${name}:${tagline}`;

  return useOptimizedFetch(
    region && name && tagline
      ? `/api/summoner?region=${encodeURIComponent(
          region
        )}&name=${encodeURIComponent(name)}&tagline=${encodeURIComponent(
          tagline
        )}`
      : null,
    {
      cacheKey,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      staleWhileRevalidate: true,
    }
  );
}

/**
 * Optimized hook for match history with pagination caching
 */
export function useOptimizedMatchHistory(
  region: string,
  name: string,
  tagline: string,
  page: number = 0,
  pageSize: number = 10
) {
  const cacheKey = `matches:${region}:${name}:${tagline}:${page}:${pageSize}`;

  return useOptimizedFetch(
    region && name && tagline
      ? `/api/summoner/matches?region=${encodeURIComponent(
          region
        )}&name=${encodeURIComponent(name)}&tagline=${encodeURIComponent(
          tagline
        )}&start=${page * pageSize}&count=${pageSize}`
      : null,
    {
      cacheKey,
      cacheTTL: 2 * 60 * 1000, // 2 minutes
      staleWhileRevalidate: true,
    }
  );
}

/**
 * Optimized hook for champion statistics
 */
export function useOptimizedChampionStats(
  region: string,
  name: string,
  tagline: string
) {
  const cacheKey = `champion-stats:${region}:${name}:${tagline}`;

  const url =
    region && name && tagline && region.trim() && name.trim() && tagline.trim()
      ? `/api/stats/champions?region=${encodeURIComponent(
          region
        )}&name=${encodeURIComponent(name)}&tagline=${encodeURIComponent(
          tagline
        )}`
      : null;

  return useOptimizedFetch(url, {
    cacheKey,
    cacheTTL: 10 * 60 * 1000, // 10 minutes
    staleWhileRevalidate: true,
  });
}

/**
 * Optimized hook for champion masteries
 */
export function useOptimizedMasteries(
  region: string,
  name: string,
  tagline: string
) {
  const cacheKey = `masteries:${region}:${name}:${tagline}`;
  return useOptimizedFetch(
    region && name && tagline && region.trim() && name.trim() && tagline.trim()
      ? `/api/summoner/masteries?region=${encodeURIComponent(
          region
        )}&name=${encodeURIComponent(name)}&tagline=${encodeURIComponent(
          tagline
        )}`
      : null,
    {
      cacheKey,
      cacheTTL: 15 * 60 * 1000, // 15 minutes
      staleWhileRevalidate: true,
    }
  );
}
