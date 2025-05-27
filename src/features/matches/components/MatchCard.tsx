'use client';
import { UIMatch, UIPlayer } from '@/features/matches/types/ui-match.types';
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatchCardHeader from './MatchCardHeader';
import MatchCardChampionBlock from './MatchCardChampionBlock';
import MatchCardStatsBlock from './MatchCardStatsBlock';
import MatchCardTabs from './MatchCardTabs';
import { withPerformanceTracking } from '@/shared/components/performance/SimplePerformanceWrapper';

// Extract complex calculations outside component to avoid recreation
const calculateTeams = (players: UIPlayer[]) => ({
  redTeam: players.filter(p => p.team === 'Red'),
  blueTeam: players.filter(p => p.team === 'Blue'),
});

const calculateKDA = (kda: string, teamKills?: number) => {
  // Robust KDA split (supports "/" or ":")
  const parts = kda.includes('/') ? kda.split('/') : kda.split(':');

  // Calculate real KDA (K+A)/D
  const kills = Number(parts[0]);
  const deaths = Number(parts[1]);
  const assists = Number(parts[2]);
  const kdaValue =
    deaths === 0 ? kills + assists : ((kills + assists) / deaths).toFixed(2);

  // Calculate real P/Kill%
  let participation = '--';
  if (teamKills && teamKills > 0) {
    participation = Math.round(
      ((kills + assists) / teamKills) * 100
    ).toString();
  }

  return {
    kdaParts: parts,
    kdaValue,
    pKill: participation,
  };
};

const calculatePlayerBadges = (player: UIPlayer | undefined) => {
  let badges: { label: string; color: string; icon: string }[] = [];

  if (!player) return badges;

  if (player.pentaKills && player.pentaKills > 0) {
    badges = [
      {
        label: 'Penta Kill',
        color: 'from-fuchsia-600 to-pink-600',
        icon: '👑',
      },
    ];
  } else if (player.quadraKills && player.quadraKills > 0) {
    badges = [
      {
        label: 'Quadra Kill',
        color: 'from-pink-500 to-red-500',
        icon: '🔥',
      },
    ];
  } else if (player.tripleKills && player.tripleKills > 0) {
    badges = [
      {
        label: 'Triple Kill',
        color: 'from-cyan-500 to-blue-500',
        icon: '💥',
      },
    ];
  } else if (player.doubleKills && player.doubleKills > 0) {
    badges = [
      {
        label: 'Double Kill',
        color: 'from-sky-400 to-blue-400',
        icon: '⚡',
      },
    ];
  } else if (player.mvp) {
    badges = [
      {
        label: 'MVP',
        color: 'from-yellow-400 to-orange-400',
        icon: '⭐',
      },
    ];
  } else if (player.killingSprees && player.killingSprees >= 8) {
    badges = [
      {
        label: 'Unstoppable',
        color: 'from-green-400 to-emerald-600',
        icon: '💪',
      },
    ];
  }

  return badges;
};

const MatchCardComponent: React.FC<{ match: UIMatch }> = ({ match }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('overview');

  // Memoized toggle functions for better performance
  const handleToggleOpen = useCallback(() => {
    setOpen(o => !o);
  }, []);

  const handleSetTab = useCallback((newTab: string) => {
    setTab(newTab);
  }, []);

  // Memoize team calculations
  const { redTeam, blueTeam } = useMemo(
    () => calculateTeams(match.players),
    [match.players]
  );

  // Memoize KDA calculations
  const { kdaParts, kdaValue, pKill } = useMemo(
    () => calculateKDA(match.kda, match.teamKills),
    [match.kda, match.teamKills]
  );

  // Memoize main player and special badges
  const { mainPlayer, specialBadges } = useMemo(() => {
    // Find the main player (the one who played the displayed champion)
    const player = match.players.find(p => p.champion === match.champion);
    const badges = calculatePlayerBadges(player);

    return {
      mainPlayer: player,
      specialBadges: badges,
    };
  }, [match.players, match.champion]);

  const isWin = match.result === 'Win';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={`group relative overflow-hidden backdrop-blur-md
        ${
          isWin
            ? 'bg-gradient-to-br from-success/15 via-base-100/95 to-success/10 border-success/30'
            : 'bg-gradient-to-br from-error/15 via-base-100/95 to-error/10 border-error/30'
        }
        border-2 rounded-3xl shadow-2xl mb-6 transition-all duration-500
        ${
          open
            ? `ring-4 shadow-3xl ${isWin ? 'ring-success/40' : 'ring-error/40'}`
            : ''
        }`}
    >
      {/* Animated Background Effects */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <motion.div
          className={`absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl
            ${isWin ? 'bg-success/30' : 'bg-error/30'}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute -bottom-32 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl'
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12'
          initial={{ x: '-100%' }}
        />
      </div>

      {/* Result Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
        className={`absolute top-4 left-4 z-20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md
          ${
            isWin
              ? 'bg-success/30 text-success border border-success/50 shadow-success/30'
              : 'bg-error/30 text-error border border-error/50 shadow-error/30'
          } shadow-lg`}
      >
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isWin ? '🏆 Victory' : '💀 Defeat'}
        </motion.span>
      </motion.div>

      {/* Expand/Collapse Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleToggleOpen}
        className={`absolute top-4 right-4 z-20 btn btn-circle btn-ghost btn-sm 
          backdrop-blur-md bg-base-100/30 border border-base-content/20          transition-all duration-300
          ${open ? 'shadow-lg ring-2 ring-primary/30' : ''}`}
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </motion.div>
      </motion.button>

      {/* Main Content Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='relative flex flex-col lg:flex-row items-stretch gap-0 w-full px-4 lg:px-6 pt-6 pb-4 z-10 cursor-pointer transition-all duration-300 rounded-t-3xl'
        onClick={handleToggleOpen}
      >
        {/* Header - Game Info */}
        <MatchCardHeader
          date={match.date}
          result={match.result}
          duration={match.duration}
        />
        {/* Champion Block - Center */}
        <MatchCardChampionBlock
          champion={match.champion}
          mainPlayer={mainPlayer}
        />
        {/* Stats Block - Right */}
        <MatchCardStatsBlock
          kdaParts={kdaParts}
          kdaValue={kdaValue}
          pKill={pKill}
          specialBadges={specialBadges}
        />
      </motion.div>

      {/* Collapsible Content */}
      <AnimatePresence mode='wait'>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className='overflow-hidden z-10 border-t border-base-content/10'
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className='px-4 lg:px-6 py-6'
            >
              <MatchCardTabs
                tab={tab}
                setTab={handleSetTab}
                match={match}
                redTeam={redTeam}
                blueTeam={blueTeam}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Memoized MatchCard component for performance optimization
const MemoizedMatchCard = React.memo(
  MatchCardComponent,
  (prevProps, nextProps) => {
    // Custom comparison function for better memoization
    return (
      prevProps.match.gameId === nextProps.match.gameId &&
      prevProps.match.kda === nextProps.match.kda &&
      prevProps.match.result === nextProps.match.result &&
      prevProps.match.players.length === nextProps.match.players.length
    );
  }
);

MemoizedMatchCard.displayName = 'MemoizedMatchCard';

// Apply performance tracking wrapper
const MatchCard = withPerformanceTracking(MemoizedMatchCard, 'MatchCard');

export const MatchCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className='relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-base-200/90 to-base-100/80 border-2 border-primary/20 shadow-2xl rounded-3xl mb-6 transition-all duration-300 pb-6'
  >
    {/* Background animated effects */}
    <div className='absolute inset-0 pointer-events-none overflow-hidden'>
      <motion.div
        className='absolute -top-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl'
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className='absolute -bottom-20 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl'
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
    </div>

    {/* Shimmer overlay */}
    <motion.div
      className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12'
      animate={{
        x: ['-100%', '100%'],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
        repeatDelay: 1,
      }}
    />

    <div className='relative flex flex-col lg:flex-row items-stretch gap-0 w-full px-4 lg:px-6 pt-6 pb-4 z-10'>
      {/* Header Section Skeleton */}
      <div className='flex flex-col justify-center min-w-[140px] max-w-[180px] p-4 rounded-2xl bg-base-200/60 backdrop-blur-sm border border-base-content/10'>
        <div className='skeleton h-6 w-20 mb-3 rounded-full' />
        <div className='skeleton h-4 w-16 mb-2' />
        <div className='skeleton h-5 w-18 mb-2 rounded-full' />
        <div className='skeleton h-4 w-14' />
      </div>

      {/* Champion Section Skeleton */}
      <div className='flex flex-row items-center gap-4 px-6 flex-1'>
        <div className='relative'>
          {/* Champion avatar */}
          <div className='skeleton w-20 h-20 rounded-3xl shadow-xl' />
          <div className='absolute -bottom-2 -right-2 skeleton w-8 h-6 rounded-full' />
        </div>

        <div className='flex flex-col gap-2'>
          {/* Spells */}
          <div className='flex gap-2'>
            <div className='skeleton w-9 h-9 rounded-lg' />
            <div className='skeleton w-9 h-9 rounded-lg' />
          </div>
          {/* Runes */}
          <div className='flex gap-2'>
            <div className='skeleton w-9 h-9 rounded-full' />
            <div className='skeleton w-9 h-9 rounded-full' />
          </div>
          {/* Items */}
          <div className='flex gap-1'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='skeleton w-8 h-8 rounded-lg' />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className='flex flex-col items-center justify-center min-w-[160px] px-4'>
        {/* KDA */}
        <div className='flex items-center gap-3 mb-3'>
          <div className='skeleton h-8 w-10' />
          <div className='skeleton h-6 w-3' />
          <div className='skeleton h-8 w-10' />
          <div className='skeleton h-6 w-3' />
          <div className='skeleton h-8 w-10' />
        </div>

        {/* KDA Ratio */}
        <div className='skeleton h-6 w-24 mb-3 rounded-full' />

        {/* P/Kill */}
        <div className='skeleton h-5 w-20 mb-3 rounded-full' />

        {/* Badges */}
        <div className='flex gap-2 flex-wrap justify-center'>
          <div className='skeleton h-8 w-24 rounded-full' />
          <div className='skeleton h-8 w-20 rounded-full' />
        </div>
      </div>
    </div>
  </motion.div>
);

export default MatchCard;
