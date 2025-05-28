'use client';
import React from 'react';
import { default as MatchCard } from '../MatchCard';
import {
  MatchStatsCard,
  LoadingState,
  ErrorState,
  EmptyState,
  MinimalMatchItem,
  CompactMatchItem,
  PaginationControls,
  LoadMoreControls,
} from './components';
import { useMatchStats } from './hooks/useMatchStats';
import { useMatchPagination } from './hooks/useMatchPagination';
import type { MatchListProps } from './types';

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
  const stats = useMatchStats(matches);
  const {
    displayedMatches,
    currentPage,
    totalPages,
    showAll,
    setShowAll,
    goToNextPage,
    goToPrevPage,
  } = useMatchPagination(matches, enablePagination, maxInitialItems);

  // Loading state
  if (loading) {
    return (
      <LoadingState
        variant={variant}
        showStats={showStats}
        title={title}
        className={className}
      />
    );
  }

  // Error state
  if (error) {
    return <ErrorState error={error} className={className} />;
  }

  // Empty state
  if (!matches || matches.length === 0) {
    return <EmptyState message={emptyStateMessage} className={className} />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h2 className='text-2xl font-bold text-base-content'>{title}</h2>
      )}

      {showStats && variant !== 'minimal' && <MatchStatsCard stats={stats} />}

      <div className='space-y-4'>
        {variant === 'minimal'
          ? displayedMatches.map((match, index) => (
              <MinimalMatchItem key={match.gameId || index} match={match} />
            ))
          : variant === 'compact'
            ? displayedMatches.map((match, index) => (
                <CompactMatchItem
                  key={match.gameId || index}
                  match={match}
                  index={index}
                />
              ))
            : displayedMatches.map((match, index) => (
                <MatchCard key={match.gameId || index} match={match} />
              ))}
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

      {/* Show More / Load More */}
      {!enablePagination && (
        <LoadMoreControls
          matches={matches}
          maxInitialItems={maxInitialItems}
          showAll={showAll}
          onShowAll={() => setShowAll(true)}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          loadingMore={loadingMore}
        />
      )}
    </div>
  );
};

export const MatchList = React.memo(MatchListComponent);
MatchList.displayName = 'MatchList';
