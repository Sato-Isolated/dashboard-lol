import { useState, useMemo, useCallback } from 'react';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';
import { DEFAULT_ITEMS_PER_PAGE } from '../constants';

export const useMatchPagination = (
  matches: UIMatch[],
  enablePagination: boolean,
  maxInitialItems?: number,
) => {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize displayed matches to prevent unnecessary recalculations
  const displayedMatches = useMemo(() => {
    // Ensure matches is valid array
    if (!Array.isArray(matches) || matches.length === 0) {
      return [];
    }

    if (enablePagination) {
      const startIndex = (currentPage - 1) * DEFAULT_ITEMS_PER_PAGE;
      const endIndex = startIndex + DEFAULT_ITEMS_PER_PAGE;
      return matches.slice(startIndex, endIndex);
    }

    if (maxInitialItems && !showAll) {
      return matches.slice(0, maxInitialItems);
    }

    return matches;
  }, [matches, enablePagination, currentPage, maxInitialItems, showAll]);

  const totalPages = useMemo(() => {
    if (!enablePagination || !matches.length) {
      return 1;
    }
    return Math.ceil(matches.length / DEFAULT_ITEMS_PER_PAGE);
  }, [enablePagination, matches.length]);

  const goToNextPage = useCallback(() => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage(p => Math.max(1, p - 1));
  }, []);

  // Reset page when matches change significantly
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    displayedMatches,
    currentPage,
    totalPages,
    showAll,
    setShowAll,
    goToNextPage,
    goToPrevPage,
    resetPage,
  };
};
