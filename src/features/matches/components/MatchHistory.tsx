'use client';
import React, { useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Target,
  Zap,
  Users,
  TrendingUp,
  RotateCcw,
  AlertCircle,
  GamepadIcon,
} from 'lucide-react';
import MatchCard, { MatchCardSkeleton } from './MatchCard';
import { withPerformanceTracking } from '@/shared/components/performance/SimplePerformanceWrapper';
import SectionCard from '@/shared/components/ui/SectionCard';
import { useMatchHistory } from '@/features/matches/hooks/useMatchHistory';
import { useEffectiveUser } from '@/shared/hooks/useEffectiveUser';
import type { UIMatch } from '@/features/matches/types/ui-match.types';

// Enhanced stats computation function with modern animations
const computeMatchStats = (matches: UIMatch[]) => {
  if (!matches || matches.length === 0) {
    return {
      kda: '-',
      winrate: '-',
      championPool: [],
      totalMatches: 0,
      wins: 0,
      losses: 0,
      avgCs: 0,
    };
  }

  let kills = 0;
  let deaths = 0;
  let assists = 0;
  let wins = 0;
  let totalCs = 0;
  const championCount: Record<string, number> = {};

  matches.forEach(match => {
    // Parse KDA from string format
    const [k, d, a] = match.kda.split('/').map(Number);
    kills += k || 0;
    deaths += d || 0;
    assists += a || 0;

    // Count wins using the result field
    if (match.result === 'Win') wins++;

    // Get CS from player data
    const playerCs =
      match.players?.find(p => p.name === match.champion)?.cs || 0;
    totalCs += playerCs;

    // Track champion usage
    championCount[match.champion] = (championCount[match.champion] || 0) + 1;
  });

  const kda =
    deaths === 0
      ? (kills + assists).toFixed(2)
      : ((kills + assists) / deaths).toFixed(2);

  const winrate = ((wins / matches.length) * 100).toFixed(1) + '%';
  const avgCs = Math.round(totalCs / matches.length);

  // Get top 3 most played champions
  const championPool = Object.entries(championCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([champion]) => champion);

  return {
    kda,
    winrate,
    championPool,
    totalMatches: matches.length,
    wins,
    losses: matches.length - wins,
    avgCs,
  };
};

// Animation variants for smooth interactions
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const statsCardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'backOut',
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

const MatchHistory: React.FC = React.memo(() => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const {
    matches,
    error: parseError,
    loading,
    hasMore,
    fetchMatches,
  } = useMatchHistory();

  // Memoize stats computation with matches dependency
  const stats = useMemo(() => computeMatchStats(matches), [matches]);

  // Memoize fetch callback to prevent unnecessary re-renders
  const handleFetchMatches = useCallback(
    (isRefresh: boolean) => {
      fetchMatches(isRefresh);
    },
    [fetchMatches]
  );

  // Memoize load more callback
  const handleLoadMore = useCallback(() => {
    handleFetchMatches(false);
  }, [handleFetchMatches]);

  useEffect(() => {
    if (!effectiveName || !effectiveRegion || !effectiveTagline) {
      return;
    }
    handleFetchMatches(true);
  }, [effectiveName, effectiveRegion, effectiveTagline, handleFetchMatches]);

  // Stats cards configuration
  const statsCards = [
    {
      icon: GamepadIcon,
      label: 'Total Games',
      value: stats.totalMatches,
      gradient: 'from-blue-500/10 to-purple-500/10',
      iconColor: 'text-blue-400',
      valueColor: 'text-base-content',
    },
    {
      icon: Trophy,
      label: 'Wins',
      value: stats.wins,
      gradient: 'from-green-500/10 to-emerald-500/10',
      iconColor: 'text-green-400',
      valueColor: 'text-green-400',
    },
    {
      icon: Target,
      label: 'Losses',
      value: stats.losses,
      gradient: 'from-red-500/10 to-pink-500/10',
      iconColor: 'text-red-400',
      valueColor: 'text-red-400',
    },
    {
      icon: TrendingUp,
      label: 'Win Rate',
      value: stats.winrate,
      gradient: 'from-yellow-500/10 to-orange-500/10',
      iconColor: 'text-yellow-400',
      valueColor: 'text-yellow-400',
    },
    {
      icon: Zap,
      label: 'Avg KDA',
      value: stats.kda,
      gradient: 'from-purple-500/10 to-indigo-500/10',
      iconColor: 'text-purple-400',
      valueColor: 'text-purple-400',
    },
    {
      icon: Users,
      label: 'Avg CS',
      value: stats.avgCs,
      gradient: 'from-cyan-500/10 to-teal-500/10',
      iconColor: 'text-cyan-400',
      valueColor: 'text-cyan-400',
    },
  ];

  // Memoize error message computation
  const errorMessage = useMemo(() => {
    if (!parseError) return null;
    return parseError.includes('Riot') || parseError.includes('base de données')
      ? "Impossible de récupérer les matchs. L'API Riot ou la base de données est peut-être indisponible. Réessayez plus tard."
      : parseError;
  }, [parseError]);

  if (loading && matches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex flex-col gap-4'
      >
        {/* Enhanced Statistics Cards Skeleton */}
        <motion.div className='card bg-base-100/90 backdrop-blur-sm rounded-xl shadow border border-base-300/50 p-6'>
          <motion.div
            className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                variants={statsCardVariants}
                className='bg-gradient-to-r from-base-200/50 to-base-300/50 rounded-xl p-4 border border-base-300/50 animate-pulse'
              >
                <div className='flex items-center space-x-3'>
                  <div className='w-5 h-5 bg-base-300 rounded'></div>
                  <div className='space-y-2'>
                    <div className='h-3 bg-base-300 rounded w-16'></div>
                    <div className='h-5 bg-base-300 rounded w-12'></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        {/* Match List Skeleton */}
        <SectionCard title='Match History' loading={false} error={null}>
          <motion.div
            className='space-y-4'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <MatchCardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        </SectionCard>
      </motion.div>
    );
  }
  return (
    <motion.div
      className='flex flex-col gap-6'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      {/* Enhanced Statistics Cards */}
      <motion.div
        variants={itemVariants}
        className='card bg-base-100/90 backdrop-blur-sm rounded-xl shadow border border-base-300/50 p-6'
      >
        <motion.h3
          className='font-semibold text-lg text-base-content mb-4 flex items-center'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TrendingUp className='w-5 h-5 mr-2 text-primary' />
          Statistics Overview
        </motion.h3>

        <motion.div
          className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'
          variants={containerVariants}
        >
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={statsCardVariants}
                className={`bg-gradient-to-r ${card.gradient} rounded-xl p-4 border border-base-300/50 cursor-pointer transition-all duration-300 backdrop-blur-sm`}
              >
                <div className='flex items-center space-x-3'>
                  <motion.div transition={{ duration: 0.6, ease: 'easeInOut' }}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </motion.div>
                  <div>
                    <p className='text-sm text-base-content/70 font-medium'>
                      {card.label}
                    </p>
                    <motion.p
                      className={`text-xl font-bold ${card.valueColor}`}
                      transition={{ duration: 0.2 }}
                    >
                      {card.value}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
      {/* Enhanced Match List */}
      <motion.div variants={itemVariants}>
        <SectionCard
          title='Match History'
          loading={loading}
          error={errorMessage}
        >
          <AnimatePresence mode='wait'>
            {!effectiveName || !effectiveRegion || !effectiveTagline ? (
              <motion.div
                key='no-user'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='flex flex-col items-center justify-center py-12 space-y-4'
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                >
                  <AlertCircle className='w-16 h-16 text-warning' />
                </motion.div>
                <p className='text-lg font-semibold text-warning'>
                  No Player Selected
                </p>
                <p className='text-base-content/70 text-center'>
                  Veuillez renseigner un nom de joueur et un tagline pour
                  afficher l'historique.
                </p>
              </motion.div>
            ) : parseError ? (
              <motion.div
                key='error'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className='flex flex-col items-center justify-center py-12 space-y-4'
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                >
                  <AlertCircle className='w-16 h-16 text-error' />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className='text-lg font-semibold text-error'
                >
                  Failed to load match history
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className='text-base-content/70 text-center'
                >
                  {errorMessage}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFetchMatches(true)}
                  className='btn btn-primary'
                >
                  <RotateCcw className='w-4 h-4 mr-2' />
                  Try Again
                </motion.button>
              </motion.div>
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex flex-col items-center justify-center py-12 space-y-4'
                  >
                    <GamepadIcon className='w-16 h-16 text-base-content/30' />
                    <span className='text-base-content/50 text-lg'>
                      No matches found
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    className='space-y-2'
                    variants={containerVariants}
                  >
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
                  <motion.button
                    className='btn btn-sm btn-outline mt-4'
                    onClick={handleLoadMore}
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          className='w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2'
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>
      </motion.div>
    </motion.div>
  );
});

MatchHistory.displayName = 'MatchHistory';

export default withPerformanceTracking(MatchHistory, 'MatchHistory');
