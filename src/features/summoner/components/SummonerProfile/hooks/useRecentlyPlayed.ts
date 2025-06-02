import { useMemo } from 'react';
import type { UIRecentlyPlayed } from '@/types/sidebarTypes';
import { useRecentlyPlayedQuery } from '@/hooks/useTanStackQueries';
import type {
  UseRecentlyPlayedOptions,
  UseRecentlyPlayedReturn,
} from '../summonerProfileTypes';

export const useRecentlyPlayed = ({
  effectiveName,
  effectiveRegion,
  effectiveTagline,
  limit = 5,
}: UseRecentlyPlayedOptions): UseRecentlyPlayedReturn => {
  // Fetch recently played data using TanStack Query
  const {
    data: recentlyPlayedData,
    isLoading: loading,
    error,
  } = useRecentlyPlayedQuery(effectiveRegion, effectiveName, effectiveTagline, limit);

  // Process data
  const recentlyPlayed = useMemo(
    () => recentlyPlayedData?.data || [],
    [recentlyPlayedData],
  );

  // Calculate average winrate
  const averageWinrate = useMemo(() => {
    if (recentlyPlayed.length === 0) {
      return 0;
    }
    return Math.round(
      recentlyPlayed.reduce(
        (acc: number, p: UIRecentlyPlayed) => acc + p.winrate,
        0,
      ) / recentlyPlayed.length,
    );
  }, [recentlyPlayed]);

  return {
    recentlyPlayed,
    loading,
    error: error?.message || null,
    averageWinrate,
  };
};
