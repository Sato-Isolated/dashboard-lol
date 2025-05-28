'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEffectiveUser } from '@/shared/hooks/useEffectiveUser';
import { useOptimizedMasteries } from '@/shared/hooks/useOptimizedFetch';
import type { UseOptimizedFetchResult } from '@/shared/hooks/useOptimizedFetch';
import { useMasteryStats } from './hooks/useMasteryStats';
import { useMasteryFiltering } from './hooks/useMasteryFiltering';
import { useMasteryControls } from './hooks/useMasteryControls';
import { StatsCards } from './components/StatsCards';
import { MasteryControls } from './components/MasteryControls';
import { MasteryContent } from './components/MasteryContent';
import {
  LoadingState,
  ErrorState,
  NoDataState,
  EmptySearchState,
} from './components/StateComponents';
import type { Mastery, MasteriesResponse } from './types';

const MasteryTab: React.FC = React.memo(() => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();

  const {
    searchTerm,
    setSearchTerm,
    viewMode,
    sortBy,
    handleSort,
    handleViewMode,
    clearSearch,
  } = useMasteryControls();

  // Use optimized fetch for masteries
  const {
    data: masteriesResponse,
    loading,
    error,
  } = useOptimizedMasteries(
    effectiveRegion,
    effectiveName,
    effectiveTagline
  ) as UseOptimizedFetchResult<{ success: boolean; data: Mastery[] }>;

  const masteries = useMemo(() => {
    if (!masteriesResponse || typeof masteriesResponse !== 'object') {
      return [];
    }
    return (masteriesResponse as MasteriesResponse)?.data || [];
  }, [masteriesResponse]);

  const { filteredAndSortedMasteries } = useMasteryFiltering(
    masteries,
    searchTerm,
    sortBy
  );

  const masteryStats = useMasteryStats(masteries);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // No data state
  if (masteries.length === 0) {
    return <NoDataState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='space-y-8'
    >
      {/* Header with stats */}
      <StatsCards stats={masteryStats} />

      {/* Controls */}
      <MasteryControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        sortBy={sortBy}
        onViewModeChange={handleViewMode}
        onSortChange={handleSort}
      />

      {/* Results info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className='flex items-center justify-between text-sm text-base-content/60'
      >
        <span>
          Showing {filteredAndSortedMasteries.length} of {masteries.length}
          champions
        </span>
        {searchTerm && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className='btn btn-ghost btn-xs gap-1'
            onClick={clearSearch}
          >
            Clear search
          </motion.button>
        )}
      </motion.div>

      {/* Content */}
      {filteredAndSortedMasteries.length === 0 && searchTerm ? (
        <EmptySearchState onClearSearch={clearSearch} />
      ) : (
        <MasteryContent
          masteries={filteredAndSortedMasteries}
          viewMode={viewMode}
        />
      )}
    </motion.div>
  );
});

MasteryTab.displayName = 'MasteryTab';

export default MasteryTab;
