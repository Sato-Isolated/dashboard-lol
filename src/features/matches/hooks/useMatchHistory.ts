import { useCallback } from 'react';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';
import { mapRiotMatchToUIMatch } from '@/lib/utils/helpers';
import { useEffectiveUser } from '@/hooks/useEffectiveUser';
import { useInfiniteApiCall } from '@/hooks/useInfiniteApiCall';
import type { Match } from '@/types/api/matchTypes';

const PAGE_SIZE = 10;

export function useMatchHistory(): {
  matches: UIMatch[];
  error: string | null;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  fetchMatches: (reset?: boolean) => void;
} {
  const { effectiveName, effectiveRegion, effectiveTagline } =
    useEffectiveUser();

  const getUrl = useCallback(
    (pageIndex: number, previousPageData: { data: Match[] } | null) => {
      if (!effectiveName || !effectiveRegion || !effectiveTagline) {
        return null;
      }

      if (
        previousPageData &&
        previousPageData.data &&
        previousPageData.data.length === 0
      ) {
        return null; // no more pages
      }

      return `/api/summoner/matches?name=${encodeURIComponent(
        effectiveName,
      )}&region=${encodeURIComponent(
        effectiveRegion,
      )}&tagline=${encodeURIComponent(effectiveTagline)}&start=${
        pageIndex * PAGE_SIZE
      }&count=${PAGE_SIZE}`;
    },
    [effectiveName, effectiveRegion, effectiveTagline],
  );
  const { data, error, loading, loadingMore, hasMore, loadMore, reset } =
    useInfiniteApiCall<Match>(getUrl, {
      pageSize: PAGE_SIZE,
      enabled: !!(effectiveName && effectiveRegion && effectiveTagline),
    });

  // Map raw Match data to UIMatch
  const matches: UIMatch[] = data.map(match =>
    mapRiotMatchToUIMatch(match, effectiveName),
  );

  const fetchMatches = useCallback(
    (resetPagination = false) => {
      console.log('fetchMatches called with reset:', resetPagination);
      if (resetPagination) {
        reset();
      } else {
        loadMore();
      }
    },
    [reset, loadMore],
  );
  return {
    matches,
    error,
    loading,
    loadingMore,
    hasMore,
    fetchMatches,
  };
}
