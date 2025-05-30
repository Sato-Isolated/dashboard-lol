'use client';
import { useCallback, useState, useEffect } from 'react';
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
  loadingMore: boolean;
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

  // Local state to track loading more
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: any) => {
      if (!enabled) {
        return null;
      }

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
  // hasMore = true if no data loaded yet OR if last page has exactly pageSize items
  // hasMore = false if last page has less than pageSize items (indicating end of data)
  const hasMore =
    data && data.length > 0
      ? data[data.length - 1]?.data?.length === pageSize
      : true; // Allow loading when no data yet

  // Distinguish between initial loading and loading more
  const isLoadingInitial = isLoading && (!data || data.length === 0);

  const loadMore = useCallback(() => {
    console.log(
      'loadMore called, current size:',
      size,
      'current data length:',
      flatData.length,
    );
    setIsLoadingMore(true);
    setSize(size + 1);
  }, [setSize, size, flatData.length]);

  // Reset loadingMore when data changes (new page loaded)
  useEffect(() => {
    if (data && isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [data, isLoadingMore]);

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
    loading: isLoadingInitial,
    loadingMore: isLoadingMore,
    hasMore,
    loadMore,
    refresh,
    reset,
  };
}
