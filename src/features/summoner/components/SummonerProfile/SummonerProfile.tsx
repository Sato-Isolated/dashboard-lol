'use client';
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffectiveUser } from '@/shared/hooks/useEffectiveUser';
import { useAccountSummoner } from '@/features/summoner/hooks/useAccountSummoner';
import { containerVariants } from './constants';
import { useRecentlyPlayed } from './hooks';
import {
  LoadingSkeletons,
  RankBadgeCard,
  RecentlyPlayedCard,
} from './components';

const SummonerProfile: React.FC = React.memo(() => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();

  const {
    leagues,
    aramScore = 0,
    loading: loadingSummoner,
  } = useAccountSummoner(effectiveRegion, effectiveName, effectiveTagline);

  const {
    recentlyPlayed,
    loading: recentlyPlayedLoading,
    error: fetchError,
  } = useRecentlyPlayed({
    effectiveName,
    effectiveRegion,
    effectiveTagline,
    limit: 5,
  });

  const isLoading = loadingSummoner || recentlyPlayedLoading;

  // Memoized error state
  const errorMessage = useMemo(() => fetchError, [fetchError]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex flex-col gap-6'
      >
        <LoadingSkeletons />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='flex flex-col gap-6'
    >
      {/* Error Alert with enhanced styling */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className='alert alert-error shadow-lg rounded-xl border border-error/20'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='stroke-current shrink-0 h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <div>
              <h3 className='font-bold'>Connection Error</h3>
              <div className='text-xs opacity-80'>{errorMessage}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rank & Badges Card */}
      <RankBadgeCard aramScore={aramScore} leagues={leagues} />

      {/* Recently Played Card */}
      <RecentlyPlayedCard
        recentlyPlayed={recentlyPlayed}
        effectiveRegion={effectiveRegion}
        effectiveTagline={effectiveTagline}
      />
    </motion.div>
  );
});

SummonerProfile.displayName = 'SummonerProfile';

export default React.memo(SummonerProfile);
