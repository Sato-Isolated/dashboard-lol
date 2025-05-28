'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import championData from '@/../public/assets/data/en_US/champion.json';
import { useEffectiveUser } from '@/shared/hooks/useEffectiveUser';
import { ChampionData } from '@/shared/types/data/champion';
import { useChampionStats } from './hooks/useChampionStats';
import { useChampionSorting } from './hooks/useChampionSorting';
import { calculateGlobalStats, getWinrate } from './utils/calculations';
import { GlobalStatsCards } from './components/GlobalStatsCards';
import { SearchAndControls } from './components/SearchAndControls';
import { ChampionsTable } from './components/ChampionsTable';
import {
  LoadingStates,
  EmptyState,
  SearchEmptyState,
} from './components/LoadingStates';

const ChampionsTab: React.FC = React.memo(() => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();

  // Use custom hooks for data and UI state
  const { stats, loading, error, refetch } = useChampionStats({
    region: effectiveRegion,
    name: effectiveName,
    tagline: effectiveTagline,
  });

  // Memoized champion data lookup for performance
  const championDataLookup = useMemo(() => {
    return championData.data as Record<string, ChampionData>;
  }, []);

  const { sortedStats, searchTerm, setSearchTerm, handleSort, sortIcon } =
    useChampionSorting(stats, championDataLookup);

  // Memoized stats calculations
  const globalStats = useMemo(() => {
    return calculateGlobalStats(stats, searchTerm, championDataLookup);
  }, [stats, searchTerm, championDataLookup]);

  // Show loading state
  if (loading) {
    return <LoadingStates loading={loading} />;
  }

  // Show error state
  if (error) {
    return <LoadingStates error={error} onRetry={refetch} />;
  }

  // Show empty state if no stats
  if (!stats || stats.length === 0) {
    return <EmptyState onRetry={refetch} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='space-y-8'
    >
      {/* Global Stats Cards */}
      <GlobalStatsCards
        globalStats={globalStats}
        totalChampions={stats.length}
      />
      {/* Search and Controls */}
      <SearchAndControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={refetch}
        isLoading={loading}
      />{' '}
      {/* Champions Table or Empty State for Search */}
      {sortedStats.length > 0 ? (
        <ChampionsTable
          sortedStats={sortedStats}
          championDataLookup={championDataLookup}
          getWinrate={getWinrate}
          handleSort={handleSort}
          sortIcon={sortIcon}
          globalStats={globalStats}
          searchTerm={searchTerm}
        />
      ) : (
        <SearchEmptyState searchTerm={searchTerm} />
      )}
    </motion.div>
  );
});

ChampionsTab.displayName = 'ChampionsTab';

export default ChampionsTab;
