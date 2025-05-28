import { useState, useMemo } from 'react';
import type { UIMatch } from '@/features/matches/types/ui-match.types';
import { DEFAULT_ITEMS_PER_PAGE } from '../constants';

export const useMatchPagination = (
  matches: UIMatch[],
  enablePagination: boolean,
  maxInitialItems?: number
) => {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const displayedMatches = useMemo(() => {
    if (enablePagination) {
      const startIndex = (currentPage - 1) * DEFAULT_ITEMS_PER_PAGE;
      return matches.slice(startIndex, startIndex + DEFAULT_ITEMS_PER_PAGE);
    }

    if (maxInitialItems && !showAll) {
      return matches.slice(0, maxInitialItems);
    }

    return matches;
  }, [matches, enablePagination, currentPage, maxInitialItems, showAll]);

  const totalPages = enablePagination
    ? Math.ceil(matches.length / DEFAULT_ITEMS_PER_PAGE)
    : 1;

  const goToNextPage = () => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  };

  const goToPrevPage = () => {
    setCurrentPage(p => Math.max(1, p - 1));
  };

  return {
    displayedMatches,
    currentPage,
    totalPages,
    showAll,
    setShowAll,
    goToNextPage,
    goToPrevPage,
  };
};
