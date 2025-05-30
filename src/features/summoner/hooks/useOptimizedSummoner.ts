import { useAsyncData } from '@/hooks';

/**
 * Optimized hook for fetching summoner data
 */
export function useOptimizedSummoner(
  region?: string,
  name?: string,
  tagline?: string,
) {
  const url =
    region && name && tagline
      ? `/api/summoner?region=${encodeURIComponent(region)}&name=${encodeURIComponent(name)}&tagline=${encodeURIComponent(tagline)}`
      : null;

  return useAsyncData({
    url,
    cacheKey: `summoner:${region}:${name}:${tagline}`,
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    retryCount: 2,
    staleWhileRevalidate: true,
  });
}

/**
 * Optimized hook for fetching match history
 */
export function useOptimizedMatchHistory(
  region?: string,
  puuid?: string,
  count = 20,
) {
  const url =
    region && puuid
      ? `/api/matches?region=${encodeURIComponent(region)}&puuid=${encodeURIComponent(puuid)}&count=${count}`
      : null;

  return useAsyncData({
    url,
    cacheKey: `match-history:${region}:${puuid}:${count}`,
    cacheTTL: 2 * 60 * 1000, // 2 minutes
    retryCount: 2,
    staleWhileRevalidate: true,
  });
}
