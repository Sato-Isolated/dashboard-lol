'use client';
import React, { useCallback, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useAccountSummoner } from '@/features/summoner/hooks/useAccountSummoner';
import { useEffectiveUser } from '@/hooks/useEffectiveUser';
import { useUserStore } from '@/stores/userStore';
import { useUpdateUserData } from '@/features/summoner/hooks/useUpdateUserData';
import { getAramRank } from '@/features/aram/utils/aramRankSystem';
import { useGlobalError } from '@/hooks/useGlobalError';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import AsyncStateContainer from '@/components/common/ui/states/AsyncStateContainer';
import { Favorite } from './types/Favorites';

// Components
import { LoadingStates } from './components/LoadingStates';
import { ProfileSection } from './components/ProfileSection';
import { ActionButtons } from './components/ActionButtons';
import { FavoritesSidebar } from './components/FavoritesSidebar';
import { ToastMessages } from './components/ToastMessages';

// Hooks
import { useFavorites } from './hooks/useFavorites';
import { useToastMessages } from './hooks/useToastMessages';

const SummonerHeader: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const {
    account,
    summoner,
    loading: loadingSummoner,
    error: errorSummoner,
    refetch: refetchSummoner,
  } = useAccountSummoner(effectiveRegion, effectiveName, effectiveTagline);

  const setUser = useUserStore(s => s.setUser);
  const { setError: setGlobalError } = useGlobalError();
  const { setLoading: setGlobalLoading } = useGlobalLoading();

  const {
    loading: updateUserDataLoading,
    error: updateUserDataError,
    updateUserData,
  } = useUpdateUserData();

  const { favorites, isFav, handleToggleFavorite } = useFavorites(
    effectiveRegion,
    effectiveTagline,
    effectiveName
  );

  const { shareMsg, rankMsg, handleShare, showRankMessage } =
    useToastMessages();

  const [lastUpdate, setLastUpdate] = useState<number>(0);

  // Optimization: handle error directly in useMemo rather than with useEffect
  useMemo(() => {
    if (updateUserDataError) {
      setGlobalError(updateUserDataError);
    }
  }, [updateUserDataError, setGlobalError]);

  const handleSelectFavorite = useCallback(
    (fav: Favorite) => {
      setUser({
        region: fav.region,
        tagline: fav.tagline,
        summonerName: fav.name,
      });
      window.location.href = `/${fav.region}/summoner/${encodeURIComponent(
        fav.name
      )}/${encodeURIComponent(fav.tagline)}`;
    },
    [setUser]
  );

  const handleShareProfile = useCallback(() => {
    handleShare(effectiveRegion, effectiveName, effectiveTagline);
  }, [handleShare, effectiveRegion, effectiveName, effectiveTagline]);

  const handleUpdateAndRank = async () => {
    const now = Date.now();
    if (now - lastUpdate < 10000) {
      // 10s anti-spam
      setGlobalError('Please wait before triggering another update.');
      return;
    }
    setGlobalLoading(true);
    setLastUpdate(now);
    await updateUserData();
    await refetchSummoner();
    setTimeout(() => {
      if (summoner) {
        // summoner is likely SummonerDto, but may be extended with aramScore
        // Use type assertion for aramScore property
        const aramScore = (summoner as { aramScore?: number }).aramScore ?? 0;
        const aramRank = getAramRank(aramScore);
        showRankMessage(
          `New ARAM rank: ${aramRank.displayName} (score ${aramScore})`
        );
      }
      setGlobalLoading(false);
    }, 300);
  };
  // Show loading states if needed
  const isDataMissing = useMemo(() => {
    return !account || !summoner;
  }, [account, summoner]);

  // Handle update loading separately since it shows a different UI
  if (updateUserDataLoading && account && summoner && effectiveRegion) {
    return (
      <LoadingStates
        loadingSummoner={false}
        updateUserDataLoading={updateUserDataLoading}
        errorSummoner={null}
        account={account}
        summoner={summoner}
        effectiveRegion={effectiveRegion}
      />
    );
  }

  return (
    <AsyncStateContainer
      loading={loadingSummoner}
      error={errorSummoner}
      isEmpty={isDataMissing}
      onRetry={refetchSummoner}
      loadingProps={{
        message: 'Loading summoner data...',
        size: 'lg',
        fullHeight: true,
      }}
      errorProps={{
        title: 'Player loading error',
        error: errorSummoner || 'Unable to load summoner data',
        size: 'lg',
      }}
      emptyProps={{
        type: 'users',
        title: 'Player Not Found',
        message: 'Unable to find summoner data',
        size: 'lg',
      }}
      animate={true}
    >
      {/* Main render */}
      <motion.div
        className='relative overflow-hidden'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background effects */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl'></div>
        <div className='absolute inset-0 backdrop-blur-3xl rounded-2xl'></div>

        {/* Main container */}
        <div className='relative bg-base-100/90 backdrop-blur-sm border border-base-300/50 rounded-2xl shadow-2xl overflow-hidden'>
          {/* Decorative top border */}
          <div className='h-1 bg-gradient-to-r from-primary via-secondary to-accent'></div>
          <div className='p-6'>
            <div className='flex flex-col lg:flex-row gap-6'>
              {/* Main Content - Profile + Actions */}
              <div className='flex-1'>
                <ProfileSection
                  account={account}
                  summoner={summoner}
                  effectiveRegion={effectiveRegion}
                />

                <ActionButtons
                  isFav={isFav}
                  updateUserDataLoading={updateUserDataLoading}
                  onToggleFavorite={handleToggleFavorite}
                  onShare={handleShareProfile}
                  onUpdateAndRank={handleUpdateAndRank}
                />
              </div>
              {/* Favorites Sidebar */}
              <FavoritesSidebar
                favorites={favorites}
                effectiveRegion={effectiveRegion}
                effectiveTagline={effectiveTagline}
                effectiveName={effectiveName}
                onSelectFavorite={handleSelectFavorite}
              />
            </div>
          </div>
        </div>

        {/* Toast Messages */}
        <ToastMessages shareMsg={shareMsg} rankMsg={rankMsg} />
      </motion.div>
    </AsyncStateContainer>
  );
};

export default SummonerHeader;
