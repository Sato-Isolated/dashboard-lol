import { useCallback } from 'react';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';
import { mapRiotMatchToUIMatch } from '@/lib/utils/helpers';
import { useEffectiveUser } from '@/hooks/useEffectiveUser';
import { useMatchHistoryInfinite } from '@/hooks/useTanStackQueries';
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

  const { 
    data, 
    error, 
    isLoading, 
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch
  } = useMatchHistoryInfinite(
    effectiveRegion, 
    effectiveName, 
    effectiveTagline,
    PAGE_SIZE
  );

  // Map raw Match data to UIMatch - flatten all pages
  const matches: UIMatch[] = data?.pages?.flatMap(page => 
    page.data.map((match: Match) => mapRiotMatchToUIMatch(match, effectiveName))
  ) || [];

  const fetchMatches = useCallback(
    (resetPagination = false) => {
      console.log('fetchMatches called with reset:', resetPagination);
      if (resetPagination) {
        refetch();
      } else {
        fetchNextPage();
      }
    },
    [refetch, fetchNextPage],
  );
  
  return {
    matches,
    error: error?.message || null,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    hasMore: !!hasNextPage,
    fetchMatches,
  };
}
