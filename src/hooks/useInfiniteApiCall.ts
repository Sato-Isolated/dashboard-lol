'use client';
import { useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';

export interface UseInfiniteApiCallOptions {
  pageSize?: number;
  cacheKey?: string;
  enabled?: boolean;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
}

export interface UseInfiniteApiCallResult<T> {
  data: T[];
  error: string | null;
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  reset: () => void;
}

/**
 * Generic hook for infinite pagination with SWR
 * Handles common pagination patterns for API calls
 */
export function useInfiniteApiCall<T>(
  getUrl: (pageIndex: number, previousPageData: any) => string | null,
  options: UseInfiniteApiCallOptions = {},
): UseInfiniteApiCallResult<T> {
  const {
    pageSize = 10,
    enabled = true,
    revalidateOnFocus = false,
    revalidateOnReconnect = true,
  } = options;

  const getKey = useCallback(
    (pageIndex: number, previousPageData: any) => {
      if (!enabled) {return null;}

      // Check if we've reached the end
      if (
        previousPageData &&
        previousPageData.data &&
        previousPageData.data.length === 0
      ) {
        return null;
      }

      return getUrl(pageIndex, previousPageData);
    },
    [getUrl, enabled],
  );

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error || 'Error loading data');
    }
    return json;
  };

  const { data, error, isLoading, setSize, size, mutate, isValidating } =
    useSWRInfinite<{ data: T[] }>(getKey, fetcher, {
      revalidateOnFocus,
      revalidateOnReconnect,
    });

  // Flatten all pages into a single array
  const flatData: T[] = data?.flatMap(page => page.data || []) || [];

  // Check if there are more pages available
  const hasMore = data ? data[data.length - 1]?.data.length === pageSize : true;

  const loadMore = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  const reset = useCallback(() => {
    setSize(1);
    mutate();
  }, [setSize, mutate]);

  return {
    data: flatData,
    error: error
      ? error instanceof Error
        ? error.message
        : String(error)
      : null,
    loading: isLoading || isValidating,
    hasMore,
    loadMore,
    refresh,
    reset,
  };
}
