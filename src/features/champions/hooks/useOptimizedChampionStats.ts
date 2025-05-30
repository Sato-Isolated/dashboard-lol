import { useAsyncData } from '@/hooks';
import type { ChampionStatsResponse } from '../components/ChampionsTab/championsTabTypes';

/**
 * Optimized hook for fetching champion statistics
 */
export function useOptimizedChampionStats(
  region?: string,
  name?: string,
  tagline?: string,
) {
  const url =
    region && name && tagline
      ? `/api/champion-stats?region=${encodeURIComponent(region)}&name=${encodeURIComponent(name)}&tagline=${encodeURIComponent(tagline)}`
      : null;

  return useAsyncData<ChampionStatsResponse>({
    url,
    cacheKey: `champion-stats:${region}:${name}:${tagline}`,
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    retryCount: 2,
    staleWhileRevalidate: true,
  });
}
