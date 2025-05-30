'use client';
import React from 'react';
import { motion } from 'motion/react';
import SectionCard from '@/components/common/ui/SectionCard';
import AsyncStateContainer from '@/components/common/ui/states/AsyncStateContainer';
import LoadMoreButton from './LoadMoreButton';
import { containerVariants } from '../constants';
import { useMatchVisibility } from '../../MatchList/hooks/useMatchVisibility';
import { StableMatchCard } from '../../MatchList/components/StableMatchCard';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';

interface MatchListContainerProps {
  matches: UIMatch[];
  loading: boolean;
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
  hasMore,
  errorMessage,
  effectiveName,
  effectiveRegion,
  effectiveTagline,
  onRetry,
  onLoadMore,
}) => {
  // Use visibility hook to prevent matches from disappearing during rerenders
  const { displayMatches, shouldShowContent } = useMatchVisibility(
    matches,
    loading,
    errorMessage,
  );

  // Memoize content condition to prevent unnecessary re-evaluations
  const hasValidUser = React.useMemo(() => {
    return effectiveName && effectiveRegion && effectiveTagline;
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  // Memoize matches with stable keys to prevent rerender issues
  const stableMatches = React.useMemo(() => {
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

  // Determine empty state condition
  const isEmpty = React.useMemo(() => {
    if (!hasValidUser) {return true;}
    if (!shouldShowContent) {return false;}
    return stableMatches.length === 0 && !loading;
  }, [hasValidUser, shouldShowContent, stableMatches.length, loading]);
  // Dynamic empty state props based on the reason for emptiness
  const emptyProps = React.useMemo(() => {
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
              {stableMatches.map((match, index) => (
                <StableMatchCard
                  key={match.stableKey}
                  match={match}
                  index={index}
                  isVisible={!loading}
                />
              ))}
            </motion.div>

            {hasMore && !loading && (
              <LoadMoreButton loading={loading} onLoadMore={onLoadMore} />
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
