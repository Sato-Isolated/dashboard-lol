'use client';
import React from 'react';
import { motion } from 'motion/react';
import { StatsOverview, LoadingState, MatchListContainer } from './components';
import { useMatchStats } from './hooks/useMatchStats';
import { useMatchHistoryData } from './hooks/useMatchHistoryData';
import { containerVariants, itemVariants } from './constants';

const MatchHistoryComponent: React.FC = () => {
  const {
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
  } = useMatchHistoryData();

  // Memoize stats computation with matches dependency
  const stats = useMatchStats(matches);

  if (loading && matches.length === 0) {
    return <LoadingState />;
  }

  return (
    <motion.div
      className='flex flex-col gap-6'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      {/* Enhanced Statistics Cards */}
      <motion.div variants={itemVariants}>
        <StatsOverview stats={stats} />
      </motion.div>

      {/* Enhanced Match List */}
      <motion.div variants={itemVariants}>
        <MatchListContainer
          matches={matches}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          errorMessage={errorMessage}
          effectiveName={effectiveName}
          effectiveRegion={effectiveRegion}
          effectiveTagline={effectiveTagline}
          onRetry={() => handleFetchMatches(true)}
          onLoadMore={handleLoadMore}
        />
      </motion.div>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchHistory = React.memo(MatchHistoryComponent);
MatchHistory.displayName = 'MatchHistory';

export default MatchHistory;
