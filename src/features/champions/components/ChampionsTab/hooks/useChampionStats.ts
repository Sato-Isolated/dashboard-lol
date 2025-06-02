import { useMemo, useCallback } from 'react';
import { useChampionStats as useChampionStatsQuery } from '@/hooks/useTanStackQueries';
import {
  ChampionStats,
  UseChampionStatsParams,
} from '../championsTabTypes';

export const useChampionStats = (params: UseChampionStatsParams) => {
  // Memoize parameters to prevent unnecessary re-renders
  const memoizedParams = useMemo(
    () => ({
      region: params.region,
      name: params.name,
      tagline: params.tagline,
    }),
    [params.region, params.name, params.tagline],
  );
  // Use TanStack Query for champion stats
  const {
    data: statsResponse,
    isLoading: loading,
    error,
    refetch,
  } = useChampionStatsQuery(
    memoizedParams.region,
    memoizedParams.name,
    memoizedParams.tagline,
  );

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
    
    await refetch();
  }, [refetch]);

  return {
    stats,
    loading,
    error: error as Error | null,
    refetch: clearCacheAndRefetch,
  };
};
