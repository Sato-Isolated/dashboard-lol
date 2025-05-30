'use client';
import { useCallback, useMemo } from 'react';
import { useMatchHistory } from '@/features/matches/hooks/useMatchHistory';
import { useEffectiveUser } from '@/hooks/useEffectiveUser';

export const useMatchHistoryData = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();

  const {
    matches,
    error: parseError,
    loading,
    loadingMore,
    hasMore,
    fetchMatches,
  } = useMatchHistory();

  // Memoize fetch callback to prevent unnecessary re-renders
  const handleFetchMatches = useCallback(
    (isRefresh: boolean) => {
      fetchMatches(isRefresh);
    },
    [fetchMatches],
  );

  // Memoize load more callback
  const handleLoadMore = useCallback(() => {
    console.log('handleLoadMore called');
    handleFetchMatches(false);
  }, [handleFetchMatches]);

  // Memoize error message computation
  const errorMessage = useMemo(() => {
    if (!parseError) {
      return null;
    }
    return parseError.includes('Riot') || parseError.includes('base de données')
      ? "Impossible de récupérer les matchs. L'API Riot ou la base de données est peut-être indisponible. Réessayez plus tard."
      : parseError;
  }, [parseError]);
  return {
    matches,
    loading,
    loadingMore,
    hasMore,
    errorMessage,
    effectiveName,
    effectiveRegion,
    effectiveTagline,
    handleFetchMatches,
    handleLoadMore,
  };
};
