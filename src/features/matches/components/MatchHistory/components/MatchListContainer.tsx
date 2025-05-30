'use client';
import React, { useRef, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import SectionCard from '@/components/common/ui/SectionCard';
import AsyncStateContainer from '@/components/common/ui/states/AsyncStateContainer';
import { containerVariants } from '../constants';
import { useMatchVisibility } from '../../MatchList/hooks/useMatchVisibility';
import { StableMatchCard } from '../../MatchList/components/StableMatchCard';
import { LoadMoreControls } from '../../MatchList/components/LoadMoreControls';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';

interface MatchListContainerProps {
  matches: UIMatch[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  errorMessage: string | null;
  effectiveName: string | null;
  effectiveRegion: string | null;
  effectiveTagline: string | null;
  onRetry: () => void;
  onLoadMore: () => void;
}

const MatchListContainerComponent: React.FC<MatchListContainerProps> = ({
  matches,
  loading,
  loadingMore,
  hasMore,
  errorMessage,
  effectiveName,
  effectiveRegion,
  effectiveTagline,
  onRetry,
  onLoadMore,
}) => {
  // State management for scroll position tracking
  const previousMatchCountRef = useRef(0);
  const lastMatchElementRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollToLastMatchRef = useRef(false);

  // Debug logs
  console.log(
    'MatchListContainer - matches:',
    matches.length,
    'hasMore:',
    hasMore,
    'loading:',
    loading,
    'loadingMore:',
    loadingMore
  );

  // Use visibility hook to prevent matches from disappearing during rerenders
  const { displayMatches, shouldShowContent } = useMatchVisibility(
    matches,
    loading,
    errorMessage
  );

  // Memoize content condition to prevent unnecessary re-evaluations
  const hasValidUser = useMemo(() => {
    return effectiveName && effectiveRegion && effectiveTagline;
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  // Memoize matches with stable keys - NO SIDE EFFECTS HERE
  const stableMatches = useMemo(() => {
    if (!displayMatches || displayMatches.length === 0) {
      return [];
    }

    return displayMatches.map((match, idx) => ({
      ...match,
      // Ensure stable key by creating composite key
      stableKey:
        match.gameId ||
        `match-${idx}-${match.champion}-${match.result}-${match.date}`,
    }));
  }, [displayMatches]);

  // Optimization: handle scroll logic directly in useMemo
  const shouldScroll = useMemo(() => {
    const currentCount = stableMatches.length;
    const previousCount = previousMatchCountRef.current;

    const result =
      currentCount > previousCount &&
      previousCount > 0 &&
      !loadingMore &&
      lastMatchElementRef.current;

    // Update refs after calculation
    previousMatchCountRef.current = currentCount;

    if (result) {
      shouldScrollToLastMatchRef.current = true;
    }

    return result;
  }, [stableMatches.length, loadingMore]);

  // Determine empty state condition
  const isEmpty = useMemo(() => {
    if (!hasValidUser) {
      return true;
    }
    if (!shouldShowContent) {
      return false;
    }
    return stableMatches.length === 0 && !loading;
  }, [hasValidUser, shouldShowContent, stableMatches.length, loading]);

  // Stable callback ref for tracking the last match element
  const lastMatchCallbackRef = useCallback((element: HTMLDivElement | null) => {
    lastMatchElementRef.current = element;

    // Execute scroll if needed
    if (shouldScrollToLastMatchRef.current && element) {
      console.log(
        `Scrolling to previous last match. Current count: ${previousMatchCountRef.current}`
      );

      // Use requestAnimationFrame for smooth scrolling after DOM update
      requestAnimationFrame(() => {
        if (element && shouldScrollToLastMatchRef.current) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          });
          shouldScrollToLastMatchRef.current = false;
        }
      });
    }
  }, []); // No dependencies to prevent recreations

  // Memoize the index of the last match before loading more
  const lastMatchIndex = useMemo(() => {
    return previousMatchCountRef.current - 1;
  }, [stableMatches.length]);

  // Dynamic empty state props based on the reason for emptiness
  const emptyProps = useMemo(() => {
    if (!hasValidUser) {
      return {
        type: 'users' as const,
        title: 'No Player Selected',        message:
          "Please enter a player name and tagline to display the match history.",
        emoji: '⚠️',
        size: 'lg' as const,
      };
    }
    return {
      type: 'matches' as const,
      size: 'lg' as const,
    };
  }, [hasValidUser]);

  return (
    <SectionCard title='Match History' loading={loading} error={errorMessage}>
      <div className='w-full min-h-[200px]'>
        <AsyncStateContainer
          loading={loading}
          error={errorMessage}
          isEmpty={isEmpty}
          onRetry={onRetry}
          emptyProps={emptyProps}
          animate={true}
        >
          <motion.div
            key='matches-container'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='w-full flex flex-col gap-2'
          >
            <motion.div
              className='space-y-2'
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              style={{ minHeight: loading ? '400px' : 'auto' }}
            >
              {stableMatches.map((match, index) => {
                // Add ref to the last match before loading more
                const isLastBeforeLoadMore = index === lastMatchIndex;

                return (
                  <div
                    key={match.stableKey}
                    ref={isLastBeforeLoadMore ? lastMatchCallbackRef : null}
                  >
                    <StableMatchCard
                      match={match}
                      index={index}
                      isVisible={!loading}
                    />
                  </div>
                );
              })}
            </motion.div>

            {hasMore && !loading && (
              <LoadMoreControls
                hasMore={hasMore}
                onLoadMore={onLoadMore}
                loadingMore={loadingMore}
              />
            )}
          </motion.div>
        </AsyncStateContainer>
      </div>
    </SectionCard>
  );
};

// Simplified memoization to prevent unnecessary re-renders
const MatchListContainer = React.memo(MatchListContainerComponent);
MatchListContainer.displayName = 'MatchListContainer';

export default MatchListContainer;
