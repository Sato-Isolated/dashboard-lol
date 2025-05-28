'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionCard from '@/shared/components/ui/SectionCard';
import MatchCard from '../../MatchCard';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import LoadMoreButton from './LoadMoreButton';
import { containerVariants, itemVariants } from '../constants';
import type { UIMatch } from '@/features/matches/types/ui-match.types';

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
  return (
    <SectionCard title='Match History' loading={loading} error={errorMessage}>
      <AnimatePresence mode='wait'>
        {!effectiveName || !effectiveRegion || !effectiveTagline ? (
          <EmptyState type='no-user' />
        ) : errorMessage ? (
          <ErrorState errorMessage={errorMessage} onRetry={() => onRetry()} />
        ) : (
          <motion.div
            key='matches'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className='w-full flex flex-col gap-2'
          >
            {matches.length === 0 ? (
              <EmptyState type='no-matches' />
            ) : (
              <motion.div className='space-y-2' variants={containerVariants}>
                {matches.map((match, idx) => (
                  <motion.div
                    key={match.gameId || idx}
                    variants={itemVariants}
                    layout
                  >
                    <MatchCard match={match} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {hasMore && (
              <LoadMoreButton loading={loading} onLoadMore={onLoadMore} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchListContainer = React.memo(MatchListContainerComponent);
MatchListContainer.displayName = 'MatchListContainer';

export default MatchListContainer;
