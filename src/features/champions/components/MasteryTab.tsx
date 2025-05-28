'use client';
import React, { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffectiveUser } from '@/shared/hooks/useEffectiveUser';
import { useOptimizedMasteries } from '@/shared/hooks/useOptimizedFetch';
import { withPerformanceTracking } from '@/shared/components/performance/SimplePerformanceWrapper';
import { apiCache } from '@/shared/lib/cache/CacheManager';
import championData from '@/../public/assets/data/en_US/champion.json';
import { getChampionIcon } from '@/shared/lib/utils/helpers';
import Image from 'next/image';
import type { UseOptimizedFetchResult } from '@/shared/hooks/useOptimizedFetch';
import {
  Trophy,
  Flame,
  Star,
  BarChart3,
  Search,
  Grid3X3,
  List,
  Target,
  Medal,
  Crown,
  Zap,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

interface Mastery {
  championId: number;
  championPoints: number;
  championLevel: number;
}

interface ChampionData {
  id: string;
  key: string;
  name: string;
}

interface MasteriesResponse {
  success: boolean;
  data: Mastery[];
}

type ViewMode = 'grid' | 'list';
type SortOption = 'points' | 'level' | 'name';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

const statsCardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

// Helper function to get mastery level badge style
const getMasteryLevelStyle = (level: number) => {
  if (level >= 7)
    return {
      badge: 'badge-warning',
      gradient: 'from-yellow-400 to-orange-500',
      icon: Crown,
      glow: 'shadow-yellow-500/50',
    };
  if (level >= 5)
    return {
      badge: 'badge-info',
      gradient: 'from-blue-400 to-purple-500',
      icon: Medal,
      glow: 'shadow-blue-500/50',
    };
  if (level >= 3)
    return {
      badge: 'badge-success',
      gradient: 'from-green-400 to-emerald-500',
      icon: Trophy,
      glow: 'shadow-green-500/50',
    };
  return {
    badge: 'badge-neutral',
    gradient: 'from-gray-400 to-gray-500',
    icon: Star,
    glow: 'shadow-gray-500/50',
  };
};

// Memoized mastery card component
const MasteryCard: React.FC<{
  mastery: Mastery & { champ?: ChampionData };
  index: number;
}> = React.memo(({ mastery, index }) => {
  const masteryStyle = getMasteryLevelStyle(mastery.championLevel);
  const Icon = masteryStyle.icon;

  return (
    <motion.div
      variants={itemVariants}
      whileTap={{ scale: 0.98 }}
      className='group relative overflow-hidden'
    >
      {/* Background effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-base-100 via-base-200 to-base-300 rounded-2xl'></div>
      {/* Card content */}
      <div className='relative p-6 border border-base-300/50 rounded-2xl backdrop-blur-sm bg-base-100/80 transition-all duration-300 shadow-lg'>
        {/* Rank indicator */}
        <div className='absolute -top-0.5 -right-0.5 z-10'>
          <motion.div
            className={`badge badge-lg ${masteryStyle.badge} text-white font-bold px-3 py-2 shadow-lg ${masteryStyle.glow} border-0`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05 + 0.3, type: 'spring' }}
          >
            <Icon size={14} className='mr-1' />
            {mastery.championLevel}
          </motion.div>
        </div>

        {/* Champion info */}
        <div className='flex flex-col items-center text-center space-y-4'>
          <motion.div
            className='relative group/avatar'
            transition={{ duration: 0.3 }}
          >
            {/* Avatar glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${masteryStyle.gradient} rounded-2xl blur-lg opacity-60 transition-opacity duration-300`}
            ></div>

            <Image
              src={getChampionIcon(
                mastery.champ ? mastery.champ.id : String(mastery.championId)
              )}
              alt={
                mastery.champ ? mastery.champ.name : String(mastery.championId)
              }
              width={80}
              height={80}
              className='relative w-20 h-20 rounded-2xl border-3 border-primary/30 transition-all duration-300 shadow-xl'
            />

            {/* Level overlay */}
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${masteryStyle.gradient} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg`}
            >
              {mastery.championLevel}
            </div>
          </motion.div>

          {/* Champion name */}
          <motion.h3
            className='font-bold text-lg text-base-content transition-colors duration-300 truncate w-full'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            {mastery.champ
              ? mastery.champ.name
              : `Champion ${mastery.championId}`}
          </motion.h3>

          {/* Points display */}
          <motion.div
            className='space-y-2 w-full'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.3 }}
          >
            <div className='flex items-center justify-center gap-2 text-sm text-base-content/70'>
              <Target size={14} />
              <span className='font-semibold'>
                {mastery.championPoints.toLocaleString('en-US')} points
              </span>
            </div>

            {/* Progress bar for next level */}
            {mastery.championLevel < 7 && (
              <div className='w-full bg-base-300 rounded-full h-2 overflow-hidden'>
                <motion.div
                  className={`h-full bg-gradient-to-r ${masteryStyle.gradient} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      ((mastery.championPoints % 1800) / 1800) * 100,
                      100
                    )}%`,
                  }}
                  transition={{
                    delay: index * 0.05 + 0.5,
                    duration: 1,
                    ease: 'easeOut',
                  }}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

MasteryCard.displayName = 'MasteryCard';

// Memoized list row component
const MasteryListRow: React.FC<{
  mastery: Mastery & { champ?: ChampionData };
  index: number;
}> = React.memo(({ mastery, index }) => {
  const masteryStyle = getMasteryLevelStyle(mastery.championLevel);
  const Icon = masteryStyle.icon;

  return (
    <motion.tr
      variants={itemVariants}
      className='group border-b border-base-300/50 transition-all duration-300'
    >
      {/* Champion */}
      <td className='py-4 px-6'>
        <div className='flex items-center gap-4'>
          <motion.div className='relative' transition={{ duration: 0.2 }}>
            <Image
              src={getChampionIcon(
                mastery.champ ? mastery.champ.id : String(mastery.championId)
              )}
              alt={
                mastery.champ ? mastery.champ.name : String(mastery.championId)
              }
              width={48}
              height={48}
              className='w-12 h-12 rounded-xl border-2 border-primary/30 transition-colors duration-300 shadow-lg'
            />
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br ${masteryStyle.gradient} rounded-full flex items-center justify-center text-white text-xs font-bold`}
            >
              {mastery.championLevel}
            </div>
          </motion.div>
          <span className='font-semibold text-base-content transition-colors duration-300'>
            {mastery.champ
              ? mastery.champ.name
              : `Champion ${mastery.championId}`}
          </span>
        </div>
      </td>

      {/* Level */}
      <td className='py-4 px-6 text-center'>
        <motion.div transition={{ duration: 0.2 }}>
          <span
            className={`badge badge-lg ${masteryStyle.badge} text-white font-bold px-4 py-2 shadow-lg`}
          >
            <Icon size={14} className='mr-1' />
            {mastery.championLevel}
          </span>
        </motion.div>
      </td>

      {/* Points */}
      <td className='py-4 px-6 text-center'>
        <div className='flex flex-col items-center gap-1'>
          <span className='text-lg font-bold text-base-content'>
            {mastery.championPoints.toLocaleString('en-US')}
          </span>
          <span className='text-xs text-base-content/50 flex items-center gap-1'>
            <Target size={12} />
            points
          </span>
        </div>
      </td>
    </motion.tr>
  );
});

MasteryListRow.displayName = 'MasteryListRow';

const MasteryTab: React.FC = React.memo(() => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('points');

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
    if (!masteriesResponse || typeof masteriesResponse !== 'object') return [];
    return (masteriesResponse as MasteriesResponse)?.data || [];
  }, [masteriesResponse]);

  // Memoized champion data lookup for performance
  const championDataLookup = useMemo(() => {
    return Object.values(championData.data) as ChampionData[];
  }, []);

  // Memoized masteries with champions
  const masteriesWithChampions = useMemo(() => {
    return masteries.map((m: Mastery) => {
      const champ = championDataLookup.find(
        (c: ChampionData) => parseInt(c.key) === m.championId
      );
      return { ...m, champ };
    });
  }, [masteries, championDataLookup]);

  // Filtered and sorted masteries
  const filteredAndSortedMasteries = useMemo(() => {
    let filtered = masteriesWithChampions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(m =>
        (m.champ?.name || String(m.championId))
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.championPoints - a.championPoints;
        case 'level':
          return b.championLevel - a.championLevel;
        case 'name':
          const nameA = a.champ?.name || String(a.championId);
          const nameB = b.champ?.name || String(b.championId);
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });
  }, [masteriesWithChampions, searchTerm, sortBy]);

  // Memoized calculations
  const masteryStats = useMemo(() => {
    const totalPoints = masteries.reduce(
      (acc: number, m: Mastery) => acc + m.championPoints,
      0
    );
    const totalChampions = masteries.length;
    const level7Champions = masteries.filter(m => m.championLevel >= 7).length;
    const level5Plus = masteries.filter(m => m.championLevel >= 5).length;
    const avgLevel =
      totalChampions > 0
        ? masteries.reduce(
            (acc: number, m: Mastery) => acc + m.championLevel,
            0
          ) / totalChampions
        : 0;

    return {
      totalPoints,
      totalChampions,
      level7Champions,
      level5Plus,
      avgLevel,
    };
  }, [masteries]);

  const handleSort = useCallback((option: SortOption) => {
    setSortBy(option);
  }, []);

  const handleViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex flex-col items-center justify-center py-16 space-y-6'
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
          }}
          className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full'
        />
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='text-center space-y-2'
        >
          <h3 className='text-xl font-bold text-primary flex items-center gap-2'>
            <Trophy className='animate-bounce' />
            Loading Mastery Data
          </h3>
          <p className='text-base-content/60'>
            Fetching your champion mastery progression...
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='flex flex-col items-center justify-center py-16 space-y-6'
      >
        <div className='text-center space-y-4'>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className='text-6xl text-error'
          >
            ⚠️
          </motion.div>
          <h3 className='text-2xl font-bold text-error'>
            Failed to Load Mastery Data
          </h3>
          <p className='text-base-content/60 max-w-md'>{error}</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className='btn btn-error btn-outline gap-2'
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} />
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // No data state
  if (masteries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col items-center justify-center py-16 space-y-6'
      >
        <div className='text-center space-y-4'>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className='text-6xl'
          >
            🎯
          </motion.div>
          <h3 className='text-2xl font-bold text-base-content'>
            No Mastery Data Found
          </h3>
          <p className='text-base-content/60 max-w-md'>
            Start playing champions to build your mastery collection!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='space-y-8'
    >
      {/* Header with stats */}
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto'
      >
        <motion.div
          variants={statsCardVariants}
          className='relative overflow-hidden rounded-xl'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl'></div>
          <div className='relative p-4 bg-base-100/80 backdrop-blur-sm border border-primary/30 rounded-xl shadow-xl'>
            <div className='flex flex-col items-center text-center space-y-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg'>
                <Trophy size={16} className='text-white' />
              </div>
              <span className='text-xs font-medium text-base-content/70'>
                Total Champions
              </span>
              <motion.div
                className='text-2xl font-bold text-primary'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                {masteryStats.totalChampions}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={statsCardVariants}
          className='relative overflow-hidden rounded-xl'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/30 rounded-xl'></div>
          <div className='relative p-4 bg-base-100/80 backdrop-blur-sm border border-secondary/30 rounded-xl shadow-xl'>
            <div className='flex flex-col items-center text-center space-y-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center shadow-lg'>
                <Zap size={16} className='text-white' />
              </div>
              <span className='text-xs font-medium text-base-content/70'>
                Total Points
              </span>
              <motion.div
                className='text-2xl font-bold text-secondary'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {masteryStats.totalPoints.toLocaleString('en-US')}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={statsCardVariants}
          className='relative overflow-hidden rounded-xl'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-warning/20 to-warning/30 rounded-xl'></div>
          <div className='relative p-4 bg-base-100/80 backdrop-blur-sm border border-warning/30 rounded-xl shadow-xl'>
            <div className='flex flex-col items-center text-center space-y-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-warning to-error rounded-lg flex items-center justify-center shadow-lg'>
                <Crown size={16} className='text-white' />
              </div>
              <span className='text-xs font-medium text-base-content/70'>
                Level 7 Champions
              </span>
              <motion.div
                className='text-2xl font-bold text-warning'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                {masteryStats.level7Champions}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={statsCardVariants}
          className='relative overflow-hidden rounded-xl'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/30 rounded-xl'></div>
          <div className='relative p-4 bg-base-100/80 backdrop-blur-sm border border-accent/30 rounded-xl shadow-xl'>
            <div className='flex flex-col items-center text-center space-y-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-accent to-info rounded-lg flex items-center justify-center shadow-lg'>
                <TrendingUp size={16} className='text-white' />
              </div>
              <span className='text-xs font-medium text-base-content/70'>
                Average Level
              </span>
              <motion.div
                className='text-2xl font-bold text-accent'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {masteryStats.avgLevel.toFixed(1)}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-6 bg-base-100/80 backdrop-blur-sm border border-base-300/50 rounded-2xl shadow-xl'
      >
        {/* Search */}
        <div className='flex-1 max-w-md'>
          <div className='relative'>
            <motion.div
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40'
              animate={{
                scale: searchTerm ? [1, 1.2, 1] : 1,
                color: searchTerm
                  ? 'rgb(var(--primary))'
                  : 'rgb(var(--base-content) / 0.4)',
              }}
              transition={{ duration: 0.2 }}
            >
              <Search size={20} />
            </motion.div>
            <input
              type='text'
              placeholder='Search champions...'
              className='input input-bordered w-full pl-12 pr-4 bg-base-200/50 border-base-300/50 focus:border-primary/50 focus:bg-base-100 transition-all duration-300'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* View mode toggle */}
        <div className='flex items-center gap-2 bg-base-200/50 rounded-xl p-1'>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`btn btn-sm gap-2 ${
              viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'
            }`}
            onClick={() => handleViewMode('grid')}
          >
            <Grid3X3 size={16} />
            <span className='hidden sm:inline'>Grid</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`btn btn-sm gap-2 ${
              viewMode === 'list' ? 'btn-primary' : 'btn-ghost'
            }`}
            onClick={() => handleViewMode('list')}
          >
            <List size={16} />
            <span className='hidden sm:inline'>List</span>
          </motion.button>
        </div>

        {/* Sort options */}
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-base-content/70'>
            Sort by:
          </span>
          <div className='flex items-center gap-1 bg-base-200/50 rounded-xl p-1'>
            {(['points', 'level', 'name'] as SortOption[]).map(option => (
              <motion.button
                key={option}
                whileTap={{ scale: 0.95 }}
                className={`btn btn-xs gap-1 ${
                  sortBy === option ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => handleSort(option)}
              >
                {option === 'points' && <Target size={12} />}
                {option === 'level' && <Star size={12} />}
                {option === 'name' && <BarChart3 size={12} />}
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
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
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </motion.button>
        )}
      </motion.div>
      {/* Content */}
      <AnimatePresence mode='wait'>
        {viewMode === 'grid' ? (
          <motion.div
            key='grid'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          >
            {filteredAndSortedMasteries.map((mastery, index) => (
              <MasteryCard
                key={mastery.championId}
                mastery={mastery}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key='list'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='overflow-hidden rounded-2xl bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-xl'
          >
            <table className='table table-zebra w-full'>
              <thead className='bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10'>
                <tr className='border-b border-base-300/50'>
                  <th className='py-4 px-6 text-left font-bold'>Champion</th>
                  <th className='py-4 px-6 text-center font-bold'>Level</th>
                  <th className='py-4 px-6 text-center font-bold'>Points</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial='hidden'
                animate='visible'
              >
                {filteredAndSortedMasteries.map((mastery, index) => (
                  <MasteryListRow
                    key={mastery.championId}
                    mastery={mastery}
                    index={index}
                  />
                ))}
              </motion.tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Empty state for filtered results */}
      {filteredAndSortedMasteries.length === 0 && searchTerm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-center justify-center py-16 space-y-4'
        >
          <div className='text-4xl'>🔍</div>
          <h3 className='text-xl font-bold text-base-content'>
            No champions found
          </h3>
          <p className='text-base-content/60'>
            Try adjusting your search term or clear the filter
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className='btn btn-primary btn-outline gap-2'
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
});

MasteryTab.displayName = 'MasteryTab';

export default withPerformanceTracking(MasteryTab, 'MasteryTab');
