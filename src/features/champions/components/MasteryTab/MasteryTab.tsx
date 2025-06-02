'use client';
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { useEffectiveUser } from '@/hooks/useEffectiveUser';
import { useMasteries } from '@/hooks/useTanStackQueries';
import { AsyncStateContainer } from '@/components/common/ui/states';
import { useMasteryStats } from './hooks/useMasteryStats';
import { useMasteryFiltering } from './hooks/useMasteryFiltering';
import { useMasteryControls } from './hooks/useMasteryControls';
import { StatsCards } from './components/StatsCards';
import { MasteryControls } from './components/MasteryControls';
import { MasteryContent } from './components/MasteryContent';
import { EmptySearchState } from './components/StateComponents';
import type { MasteriesResponse } from './masteryTabTypes';

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

  // Use TanStack Query for masteries
  const {
    data: masteriesResponse,
    isLoading: loading,
    error,
  } = useMasteries(effectiveRegion, effectiveName, effectiveTagline);

  const masteries = useMemo(() => {
    if (!masteriesResponse || typeof masteriesResponse !== 'object') {
      return [];
    }
    return (masteriesResponse as MasteriesResponse)?.data || [];
  }, [masteriesResponse]);

  const { filteredAndSortedMasteries } = useMasteryFiltering(
    masteries,
    searchTerm,
    sortBy,
  );
  const masteryStats = useMasteryStats(masteries);

  return (
    <AsyncStateContainer
      loading={loading}
      error={error instanceof Error ? error : error ? String(error) : null}
      data={masteries}
      loadingProps={{
        message: 'Fetching your champion mastery progression...',
        icon: <Trophy className='animate-bounce text-primary' />,
        size: 'lg',
      }}
      errorProps={{
        title: 'Failed to Load Mastery Data',
        retryText: 'Try Again',
        icon: <span className='text-4xl'>⚠️</span>,
        size: 'lg',
        onRetry: () => window.location.reload(),
      }}
      emptyProps={{
        type: 'champions',
        title: 'No Mastery Data Found',
        message: 'Start playing champions to build your mastery collection!',
        emoji: '🎯',
        size: 'lg',
      }}
    >
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
    </AsyncStateContainer>
  );
});

MasteryTab.displayName = 'MasteryTab';

export default MasteryTab;
