import { useAsyncData } from '@/hooks';
import type { Mastery } from '../components/MasteryTab/masteryTabTypes';

export interface MasteriesResponse {
  success: boolean;
  data: Mastery[];
}

/**
 * Optimized hook for fetching champion masteries
 */
export function useOptimizedMasteries(
  region?: string,
  name?: string,
  tagline?: string,
) {
  const url =
    region && name && tagline
      ? `/api/masteries?region=${encodeURIComponent(region)}&name=${encodeURIComponent(name)}&tagline=${encodeURIComponent(tagline)}`
      : null;

  return useAsyncData<MasteriesResponse>({
    url,
    cacheKey: `masteries:${region}:${name}:${tagline}`,
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    retryCount: 2,
    staleWhileRevalidate: true,
  });
}
