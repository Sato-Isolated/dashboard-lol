import { useMemo, useCallback } from 'react';
import { useOptimizedChampionStats } from '@/shared/hooks/useOptimizedFetch';
import { apiCache } from '@/shared/lib/cache/CacheManager';
import {
  ChampionStats,
  ChampionStatsResponse,
  UseChampionStatsParams,
} from '../types';
import type { UseOptimizedFetchResult } from '@/shared/hooks/useOptimizedFetch';

export const useChampionStats = (params: UseChampionStatsParams) => {
  // Memoize parameters to prevent unnecessary re-renders
  const memoizedParams = useMemo(
    () => ({
      region: params.region,
      name: params.name,
      tagline: params.tagline,
    }),
    [params.region, params.name, params.tagline]
  );

  // Use optimized fetch for champion stats
  const {
    data: statsResponse,
    loading,
    error,
    refetch,
  } = useOptimizedChampionStats(
    memoizedParams.region,
    memoizedParams.name,
    memoizedParams.tagline
  ) as UseOptimizedFetchResult<ChampionStatsResponse>;

  const stats = useMemo<ChampionStats[]>(() => {
    // Handle both direct array and wrapped response format
    if (Array.isArray(statsResponse)) {
      return statsResponse;
    }
    if (
      statsResponse &&
      typeof statsResponse === 'object' &&
      'data' in statsResponse
    ) {
      return (statsResponse as any).data || [];
    }
    return [];
  }, [statsResponse]);

  // Clear cache and refetch
  const clearCacheAndRefetch = useCallback(async () => {
    apiCache.clearChampionsAndMasteriesCache();
    await refetch();
  }, [refetch]);

  return {
    stats,
    loading,
    error,
    refetch: clearCacheAndRefetch,
  };
};
