'use client';
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import championData from '@/../public/assets/data/en_US/champion.json';
import { useEffectiveUser } from '@/hooks/useEffectiveUser';
import { ChampionData } from '@/types/data/champion';
import { AsyncStateContainer } from '@/components/common/ui/states';
import { useChampionStats } from './hooks/useChampionStats';
import { useChampionSorting } from './hooks/useChampionSorting';
import { calculateGlobalStats, getWinrate } from './utils/calculations';
import { GlobalStatsCards } from './components/GlobalStatsCards';
import { SearchAndControls } from './components/SearchAndControls';
import { ChampionsTable } from './components/ChampionsTable';

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
  // Custom empty check: consider data empty if no search results
  const isDataEmpty =
    !stats ||
    stats.length === 0 ||
    (searchTerm.trim() !== '' && sortedStats.length === 0);

  return (
    <AsyncStateContainer
      loading={loading}
      error={error}
      isEmpty={isDataEmpty}
      onRetry={refetch}
      loadingProps={{
        message: 'Loading champion statistics...',
        icon: <RefreshCw className='text-primary' />,
        size: 'lg',
      }}
      errorProps={{
        title: 'Error Loading Champions',
        retryText: 'Clear Cache & Retry',
        icon: <RefreshCw size={24} />,
        size: 'lg',
      }}
      emptyProps={{
        type: searchTerm.trim() !== '' ? 'search' : 'champions',
        title:
          searchTerm.trim() !== '' ? 'No champions found' : 'No Champion Data',
        message:
          searchTerm.trim() !== ''
            ? 'Try adjusting your search term'
            : 'Start playing champions to build your statistics!',
        emoji: searchTerm.trim() !== '' ? '🔍' : undefined,
        size: 'lg',
      }}
    >
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
        />
        {/* Champions Table */}
        <ChampionsTable
          sortedStats={sortedStats}
          championDataLookup={championDataLookup}
          getWinrate={getWinrate}
          handleSort={handleSort}
          sortIcon={sortIcon}
          globalStats={globalStats}
          searchTerm={searchTerm}
        />
      </motion.div>
    </AsyncStateContainer>
  );
});

ChampionsTab.displayName = 'ChampionsTab';

export default ChampionsTab;
