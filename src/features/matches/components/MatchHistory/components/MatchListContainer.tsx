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
  const scrollStateRef = useRef({
    previousCount: 0,
    shouldScrollToLastMatch: false,
    lastMatchElement: null as HTMLDivElement | null,
    lastMatchIndexBeforeLoad: -1,
  });

  // Debug logs
  console.log(
    'MatchListContainer - matches:',
    matches.length,
    'hasMore:',
    hasMore,
    'loading:',
    loading,
    'loadingMore:',
    loadingMore,
  );

  // Use visibility hook to prevent matches from disappearing during rerenders
  const { displayMatches, shouldShowContent } = useMatchVisibility(
    matches,
    loading,
    errorMessage,
  );

  // Memoize content condition to prevent unnecessary re-evaluations
  const hasValidUser = useMemo(() => {
    return effectiveName && effectiveRegion && effectiveTagline;
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  // Memoize matches with stable keys and handle scroll state updates
  const stableMatches = useMemo(() => {
    if (!displayMatches || displayMatches.length === 0) {
      return [];
    }

    const matches = displayMatches.map((match, idx) => ({
      ...match,
      // Ensure stable key by creating composite key
      stableKey:
        match.gameId ||
        `match-${idx}-${match.champion}-${match.result}-${match.date}`,
    }));

    // Update scroll state when matches change
    const currentCount = matches.length;
    const previousCount = scrollStateRef.current.previousCount;

    // Determine if we should scroll after new matches are loaded
    const shouldScroll =
      currentCount > previousCount &&
      previousCount > 0 &&
      !loadingMore &&
      scrollStateRef.current.lastMatchElement;

    if (shouldScroll) {
      // Schedule scroll action for next render
      scrollStateRef.current.shouldScrollToLastMatch = true;
      // Store the index of the last match from the previous state
      scrollStateRef.current.lastMatchIndexBeforeLoad = previousCount - 1;
    }

    scrollStateRef.current.previousCount = currentCount;

    return matches;
  }, [displayMatches, loadingMore]);

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

  // Callback ref for tracking the last match element
  const lastMatchCallbackRef = useCallback(
    (element: HTMLDivElement | null) => {
      scrollStateRef.current.lastMatchElement = element;

      // Execute scroll if needed
      if (scrollStateRef.current.shouldScrollToLastMatch && element) {
        console.log(
          `Scrolling to previous last match. Current count: ${stableMatches.length}`,
        );

        // Use requestAnimationFrame for smooth scrolling after DOM update
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          });
        });

        scrollStateRef.current.shouldScrollToLastMatch = false;
      }
    },
    [stableMatches.length],
  );

  // Memoize the index of the last match before loading more
  const lastMatchIndex = useMemo(() => {
    return scrollStateRef.current.lastMatchIndexBeforeLoad;
  }, [stableMatches.length]);

  // Dynamic empty state props based on the reason for emptiness
  const emptyProps = useMemo(() => {
    if (!hasValidUser) {
      return {
        type: 'users' as const,
        title: 'No Player Selected',
        message:
          "Veuillez renseigner un nom de joueur et un tagline pour afficher l'historique.",
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
                matches={matches}
                showAll={false}
                onShowAll={() => {}} // Not used in this context
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

// Memoize component to prevent unnecessary re-renders with enhanced comparison
const MatchListContainer = React.memo(
  MatchListContainerComponent,
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary rerenders
    return (
      prevProps.loading === nextProps.loading &&
      prevProps.loadingMore === nextProps.loadingMore &&
      prevProps.hasMore === nextProps.hasMore &&
      prevProps.errorMessage === nextProps.errorMessage &&
      prevProps.effectiveName === nextProps.effectiveName &&
      prevProps.effectiveRegion === nextProps.effectiveRegion &&
      prevProps.effectiveTagline === nextProps.effectiveTagline &&
      prevProps.matches.length === nextProps.matches.length &&
      // Compare first few matches for deep equality check
      JSON.stringify(prevProps.matches.slice(0, 3)) ===
        JSON.stringify(nextProps.matches.slice(0, 3))
    );
  },
);
MatchListContainer.displayName = 'MatchListContainer';

export default MatchListContainer;
