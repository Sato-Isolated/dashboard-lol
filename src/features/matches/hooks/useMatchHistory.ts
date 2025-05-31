import { useCallback, useEffect, useRef } from 'react';
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

  // Add a safety timeout to prevent stuck loading states
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Safety mechanism: if loading takes too long, log a warning
  useEffect(() => {
    if (isFetchingNextPage) {
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Set a timeout to warn about long loading times
      loadingTimeoutRef.current = setTimeout(() => {
        console.warn('Load more operation taking longer than expected. This might indicate an issue.');
        console.log('Current state:', {
          isFetchingNextPage,
          hasNextPage,
          dataPages: data?.pages?.length,
          error: error?.message,
        });
      }, 10000); // 10 seconds warning
    } else {
      // Clear timeout when loading completes
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isFetchingNextPage, hasNextPage, data?.pages?.length, error?.message]);

  // Map raw Match data to UIMatch - flatten all pages
  const matches: UIMatch[] = data?.pages?.flatMap(page => 
    page.data.map((match: Match) => mapRiotMatchToUIMatch(match, effectiveName))
  ) || [];
  const fetchMatches = useCallback(
    (resetPagination = false) => {
      console.log('fetchMatches called with reset:', resetPagination);
      console.log('Current state:', {
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        matchesCount: matches.length,
        pagesCount: data?.pages?.length,
      });
      
      if (resetPagination) {
        refetch();
      } else {
        fetchNextPage();
      }
    },
    [refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, matches.length, data?.pages?.length],
  );
    const result = {
    matches,
    error: error?.message || null,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    hasMore: !!hasNextPage,
    fetchMatches,
  };

  // Debug log for hasMore changes
  console.log('useMatchHistory result:', {
    matchesCount: result.matches.length,
    loading: result.loading,
    loadingMore: result.loadingMore,
    hasMore: result.hasMore,
    error: result.error,
  });

  return result;
}
