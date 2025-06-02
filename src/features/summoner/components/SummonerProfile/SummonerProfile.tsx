'use client';
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useEffectiveUser } from '@/hooks/useEffectiveUser';
import { useAccountSummoner } from '@/features/summoner/hooks/useAccountSummoner';
import AsyncStateContainer from '@/components/common/ui/states/AsyncStateContainer';
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

  // Custom loading component
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
    <AsyncStateContainer
      loading={false} // Already handled above
      error={errorMessage}
      isEmpty={false} // Profile data is always available when not loading/error
      errorProps={{
        title: 'Connection Error',
        error: errorMessage || 'Unknown error occurred',
      }}
      animate={true}
    >
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='flex flex-col gap-6'
      >
        {/* Rank & Badges Card */}
        <RankBadgeCard aramScore={aramScore} leagues={leagues} />

        {/* Recently Played Card */}
        <RecentlyPlayedCard
          recentlyPlayed={recentlyPlayed}
          effectiveRegion={effectiveRegion}
          effectiveTagline={effectiveTagline}
        />
      </motion.div>
    </AsyncStateContainer>
  );
});

SummonerProfile.displayName = 'SummonerProfile';

export default React.memo(SummonerProfile);
