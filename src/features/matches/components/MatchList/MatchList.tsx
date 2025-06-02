'use client';
import React, { useMemo } from 'react';
import {
  MatchStatsCard,
  MinimalMatchItem,
  CompactMatchItem,
  PaginationControls,
  LoadMoreControls,
  StableMatchCard,
} from './components';
import AsyncStateContainer from '@/components/common/ui/states/AsyncStateContainer';
import { useMatchStats, useMatchPagination, useMatchVisibility } from './hooks';
import type { MatchListProps } from './matchListTypes';

const MatchListComponent: React.FC<MatchListProps> = ({
  matches,
  loading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  variant = 'default',
  showStats = true,
  maxInitialItems,
  enablePagination = false,
  className = '',
  emptyStateMessage = 'No matches found',
  title = 'Match History',
}) => {
  const { displayMatches, shouldShowContent } = useMatchVisibility(
    matches,
    loading,
    error,
  );

  const stats = useMatchStats(displayMatches);
  const {
    displayedMatches,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
  } = useMatchPagination(displayMatches, enablePagination, maxInitialItems);
  // Memoize stable matches to prevent rerender issues
  const stableMatches = useMemo(() => {
    if (!displayedMatches || displayedMatches.length === 0) {
      return [];
    }

    return displayedMatches.map((match, idx) => ({
      ...match,
      // Create composite stable key
      stableKey:
        match.gameId ||
        `${match.champion}-${match.result}-${idx}-${match.date}`,
    }));
  }, [displayedMatches]);

  // Check if data should be considered empty
  const isEmpty = useMemo(() => {
    if (!shouldShowContent && !loading) {
      return true;
    }
    return false;
  }, [shouldShowContent, loading]);

  return (
    <AsyncStateContainer
      loading={loading && (!displayMatches || displayMatches.length === 0)}
      error={error && !shouldShowContent ? error : null}
      isEmpty={isEmpty}
      loadingProps={{
        message: 'Loading matches...',
        size: 'lg',
      }}
      errorProps={{
        error: error || 'Failed to load matches',
      }}
      emptyProps={{
        type: 'matches',
        message: emptyStateMessage,
      }}
      className={className}
      animate={true}
    >
      <div className={`space-y-4 ${className}`}>
        {title && (
          <h2 className='text-2xl font-bold text-base-content'>{title}</h2>
        )}
        {showStats && variant !== 'minimal' && stableMatches.length > 0 && (
          <MatchStatsCard stats={stats} />
        )}
        <div className='space-y-4 min-h-[200px]'>
          {variant === 'minimal'
            ? stableMatches.map(match => (
                <MinimalMatchItem key={match.stableKey} match={match} />
              ))
            : variant === 'compact'
              ? stableMatches.map((match, index) => (
                  <CompactMatchItem
                    key={match.stableKey}
                    match={match}
                    index={index}
                  />
                ))
              : stableMatches.map((match, index) => (
                  <StableMatchCard
                    key={match.stableKey}
                    match={match}
                    index={index}
                    isVisible={!loading}
                  />
                ))}

          {loading && stableMatches.length > 0 && (
            <div className='text-center py-4'>
              <div className='loading loading-spinner loading-md'></div>
            </div>
          )}
        </div>
        {/* Pagination */}
        {enablePagination && totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={goToNextPage}
            onPrevPage={goToPrevPage}
          />
        )}
        {/* Load More */}
        {!enablePagination && (
          <LoadMoreControls
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            loadingMore={loadingMore}
          />
        )}
      </div>
    </AsyncStateContainer>
  );
};

export const MatchList = React.memo(MatchListComponent);
MatchList.displayName = 'MatchList';
