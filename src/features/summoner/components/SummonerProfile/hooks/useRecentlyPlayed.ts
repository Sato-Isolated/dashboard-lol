import { useMemo } from 'react';
import type { UIRecentlyPlayed } from '@/types/sidebarTypes';
import { useOptimizedFetch } from '@/hooks/useOptimizedFetch';
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
  // Build URL for recently played data
  const recentlyPlayedUrl = useMemo(() => {
    if (!effectiveName || !effectiveRegion || !effectiveTagline) {
      return null;
    }
    return `/api/summoner/recently-played?name=${encodeURIComponent(
      effectiveName,
    )}&region=${encodeURIComponent(
      effectiveRegion,
    )}&tagline=${encodeURIComponent(effectiveTagline)}&limit=${limit}`;
  }, [effectiveName, effectiveRegion, effectiveTagline, limit]);

  // Fetch recently played data
  const {
    data: recentlyPlayedData,
    loading,
    error,
  } = useOptimizedFetch<{ data: UIRecentlyPlayed[] }>(recentlyPlayedUrl, {
    cacheKey: `recently-played:${effectiveRegion}:${effectiveName}:${effectiveTagline}`,
    cacheTTL: 2 * 60 * 1000, // 2 minutes
  });

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
      recentlyPlayed.reduce((acc, p) => acc + p.winrate, 0) /
        recentlyPlayed.length,
    );
  }, [recentlyPlayed]);

  return {
    recentlyPlayed,
    loading,
    error,
    averageWinrate,
  };
};

