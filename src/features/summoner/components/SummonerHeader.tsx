'use client';
import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Share2,
  RefreshCw,
  Trophy,
  Zap,
  Users,
  Copy,
  Heart,
  TrendingUp,
  Crown,
  Shield,
} from 'lucide-react';
import { getSummonerIcon } from '@/shared/lib/utils/helpers';
import { useAccountSummoner } from '@/features/summoner/hooks/useAccountSummoner';
import { useEffectiveUser } from '@/shared/hooks/useEffectiveUser';
import { useUserStore } from '@/shared/store/userStore';
import { useUpdateUserData } from '@/features/summoner/hooks/useUpdateUserData';
import { getAramRank } from '@/features/aram/utils/aramRankSystem';
import { useGlobalError } from '@/shared/hooks/useGlobalError';
import { useGlobalLoading } from '@/shared/hooks/useGlobalLoading';

interface Favorite {
  region: string;
  tagline: string;
  name: string;
}

interface FavoriteButtonProps {
  favorite: Favorite;
  isActive: boolean;
  onSelect: (fav: Favorite) => void;
}

const FavoriteButtonComponent: React.FC<FavoriteButtonProps> = ({
  favorite,
  isActive,
  onSelect,
}) => {
  const handleClick = useCallback(() => {
    onSelect(favorite);
  }, [favorite, onSelect]);

  return (
    <motion.button
      className={`relative group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30'
          : 'bg-base-200/50 text-base-content/70 border border-transparent'
      }`}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          className='absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-full'
          layoutId='activeFavorite'
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
      )}

      <div className='flex items-center gap-2 flex-1 min-w-0'>
        {isActive && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className='text-primary'
          >
            <Crown size={14} />
          </motion.div>
        )}
        <span className='truncate'>
          {favorite.name}
          <span className='text-base-content/40 ml-1'>#{favorite.tagline}</span>
        </span>
      </div>

      <span
        className={`text-xs px-2 py-1 rounded-full font-bold ${
          isActive
            ? 'bg-primary/20 text-primary'
            : 'bg-base-300/50 text-base-content/50'
        }`}
      >
        {favorite.region.toUpperCase()}
      </span>
    </motion.button>
  );
};

const FavoriteButton = React.memo(FavoriteButtonComponent);
FavoriteButton.displayName = 'FavoriteButton';

const FAVORITES_KEY = 'lol-favorites';

function getFavorites(): Favorite[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(favs: Favorite[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

const HeaderSection: React.FC = () => {
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
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);
  const [isFav, setIsFav] = React.useState(false);
  const [shareMsg, setShareMsg] = React.useState('');
  const [rankMsg, setRankMsg] = React.useState<string>('');
  const {
    loading: updateUserDataLoading,
    error: updateUserDataError,
    updateUserData,
  } = useUpdateUserData();
  const { setError: setGlobalError } = useGlobalError();
  const { setLoading: setGlobalLoading } = useGlobalLoading();
  const [lastUpdate, setLastUpdate] = React.useState<number>(0);

  React.useEffect(() => {
    const favs = getFavorites();
    setFavorites(favs);
    setIsFav(
      favs.some(
        f =>
          f.region === effectiveRegion &&
          f.tagline === effectiveTagline &&
          f.name === effectiveName
      )
    );
  }, [effectiveRegion, effectiveTagline, effectiveName]);

  React.useEffect(() => {
    if (updateUserDataError) setGlobalError(updateUserDataError);
  }, [updateUserDataError, setGlobalError]);

  const handleToggleFavorite = () => {
    const favs = getFavorites();
    const idx = favs.findIndex(
      f =>
        f.region === effectiveRegion &&
        f.tagline === effectiveTagline &&
        f.name === effectiveName
    );
    if (idx !== -1) {
      favs.splice(idx, 1);
    } else {
      favs.push({
        region: effectiveRegion,
        tagline: effectiveTagline,
        name: effectiveName,
      });
    }
    saveFavorites(favs);
    setFavorites(favs);
    setIsFav(idx === -1);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const url = `${
        window.location.origin
      }/${effectiveRegion}/summoner/${encodeURIComponent(
        effectiveName
      )}/${encodeURIComponent(effectiveTagline)}`;
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        navigator.clipboard.writeText(url);
        setShareMsg('Link copied!');
        setTimeout(() => setShareMsg(''), 1500);
      } else {
        setShareMsg('Clipboard not available');
        setTimeout(() => setShareMsg(''), 1500);
      }
    }
  };

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
        setRankMsg(
          `New ARAM rank: ${aramRank.displayName} (score ${aramScore})`
        );
        setTimeout(() => setRankMsg(''), 2500);
      }
      setGlobalLoading(false);
    }, 300);
  };

  const favoritesList = useMemo(() => {
    if (favorites.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex items-center justify-center py-6 text-base-content/50'
        >
          <div className='flex flex-col items-center gap-2'>
            <Heart size={20} className='text-base-content/30' />
            <span className='text-sm'>No favorites yet</span>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className='space-y-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {favorites.map((fav, i) => {
          const isActive =
            fav.region === effectiveRegion &&
            fav.tagline === effectiveTagline &&
            fav.name === effectiveName;

          return (
            <motion.div
              key={`${fav.region}-${fav.tagline}-${fav.name}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <FavoriteButton
                favorite={fav}
                isActive={isActive}
                onSelect={handleSelectFavorite}
              />
            </motion.div>
          );
        })}
      </motion.div>
    );
  }, [
    favorites,
    effectiveRegion,
    effectiveTagline,
    effectiveName,
    handleSelectFavorite,
  ]);
  // Loading state with enhanced skeleton
  if (loadingSummoner) {
    return (
      <motion.div
        className='relative overflow-hidden'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background effects */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl'></div>
        <div className='absolute inset-0 backdrop-blur-3xl rounded-2xl'></div>
        <div className='relative bg-base-100/90 backdrop-blur-sm border border-base-300/50 rounded-2xl p-6 shadow-2xl'>
          <div className='flex flex-col lg:flex-row gap-6'>
            {/* Profile section skeleton */}
            <div className='flex-1'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4'>
                <div className='relative'>
                  <div className='skeleton h-20 w-20 rounded-full'></div>
                  <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-pulse'></div>
                </div>
                <div className='space-y-3 flex-1'>
                  <div className='skeleton h-7 w-48 rounded-lg'></div>
                  <div className='skeleton h-4 w-32 rounded-lg'></div>
                </div>
              </div>

              {/* Actions skeleton */}
              <div className='flex flex-wrap gap-3'>
                <div className='skeleton h-10 w-32 rounded-lg'></div>
                <div className='skeleton h-10 w-28 rounded-lg'></div>
                <div className='skeleton h-10 w-24 rounded-lg'></div>
              </div>
            </div>

            {/* Favorites skeleton */}
            <div className='lg:w-80 xl:w-96'>
              <div className='bg-base-200/30 rounded-xl p-4 border border-base-300/30'>
                <div className='skeleton h-5 w-20 rounded-lg mx-auto mb-4'></div>
                <div className='space-y-2'>
                  <div className='skeleton h-8 w-full rounded-lg'></div>
                  <div className='skeleton h-8 w-full rounded-lg'></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated shimmer effect */}
        <div className='absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer'></div>
      </motion.div>
    );
  }

  // Error state
  if (errorSummoner || !account || !summoner) {
    return (
      <motion.div
        className='relative overflow-hidden'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className='bg-error/10 border border-error/30 rounded-2xl p-6 text-center'>
          <div className='flex items-center justify-center gap-3 text-error'>
            <Shield size={24} />
            <span className='font-semibold'>Player loading error</span>
          </div>
          <p className='text-error/70 text-sm mt-2'>
            Unable to load summoner data
          </p>
        </div>
      </motion.div>
    );
  }

  // Update loading state
  if (updateUserDataLoading) {
    return (
      <motion.div
        className='relative overflow-hidden'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background effects */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl animate-pulse'></div>
        <div className='relative bg-base-100/90 backdrop-blur-sm border border-base-300/50 rounded-2xl p-6 shadow-2xl'>
          <div className='flex flex-col lg:flex-row gap-6'>
            {/* Profile section */}
            <div className='flex-1'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4'>
                <div className='relative'>
                  <Image
                    src={getSummonerIcon(summoner.profileIconId)}
                    alt={account.gameName}
                    width={80}
                    height={80}
                    className='rounded-full border-4 border-primary/50 opacity-60'
                    onError={e => {
                      e.currentTarget.src = '/assets/profileicon/0.png';
                    }}
                  />
                  <div className='absolute inset-0 bg-primary/20 rounded-full animate-pulse'></div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <RefreshCw
                      className='animate-spin text-primary'
                      size={24}
                    />
                  </div>
                </div>
                <div className='space-y-2 flex-1'>
                  <h2 className='text-2xl font-bold text-base-content/60'>
                    {account.gameName}
                    <span className='text-base-content/40'>
                      #{account.tagLine}
                    </span>
                  </h2>
                  <div className='flex items-center gap-2 text-base-content/50'>
                    <span className='text-sm'>
                      {effectiveRegion.toUpperCase()}
                    </span>
                    <span className='text-xs'>
                      Level {summoner.summonerLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loading message */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className='text-primary font-semibold flex items-center gap-2'
              >
                <Zap size={20} />
                Updating player data...
              </motion.div>
            </div>

            {/* Favorites section placeholder */}
            <div className='lg:w-80 xl:w-96'>
              <div className='bg-base-200/30 rounded-xl p-4 border border-base-300/30 opacity-50'>
                <div className='flex items-center gap-2 justify-center mb-4'>
                  <Users size={16} className='text-primary' />
                  <h3 className='font-semibold text-base-content'>Favorites</h3>
                </div>
                <div className='text-center text-base-content/40 text-sm'>
                  Loading...
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Main render
  return (
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
              {/* Profile Section */}
              <motion.div
                className='flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4'
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <div className='relative group'>
                  {/* Avatar with glow effect */}
                  <div className='absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-lg opacity-60 transition-opacity duration-300'></div>
                  <motion.div
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Image
                      src={getSummonerIcon(summoner.profileIconId)}
                      alt={account.gameName}
                      width={80}
                      height={80}
                      className='relative rounded-full border-4 border-primary shadow-xl'
                      onError={e => {
                        e.currentTarget.src = '/assets/profileicon/0.png';
                      }}
                    />
                  </motion.div>
                  {/* Level badge */}
                  <motion.div
                    className='absolute -bottom-1 -right-1 bg-gradient-to-r from-primary to-secondary text-primary-content text-xs font-bold px-2 py-1 rounded-full shadow-lg'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    {summoner.summonerLevel}
                  </motion.div>
                </div>

                <div className='flex-1 space-y-2'>
                  <motion.h1
                    className='text-2xl font-bold text-base-content group'
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-500'>
                      {account.gameName}
                    </span>
                    <span className='text-base-content/60 ml-1'>
                      #{account.tagLine}
                    </span>
                  </motion.h1>

                  <motion.div
                    className='flex items-center gap-3'
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className='inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full'>
                      <TrendingUp size={14} />
                      {effectiveRegion.toUpperCase()}
                    </span>
                    <span className='text-base-content/60 text-sm'>
                      Level {summoner.summonerLevel}
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Action Buttons - Now horizontal under profile */}
              <motion.div
                className='flex flex-wrap gap-3 justify-start'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <motion.button
                  className={`btn btn-sm group relative overflow-hidden ${
                    isFav
                      ? 'btn-warning text-warning-content'
                      : 'btn-outline btn-warning'
                  }`}
                  onClick={handleToggleFavorite}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={{ rotate: isFav ? 0 : 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Star size={16} className={isFav ? 'fill-current' : ''} />
                  </motion.div>
                  <span className='relative z-10'>
                    {isFav ? 'Remove favorite' : 'Add favorite'}
                  </span>
                </motion.button>

                <motion.button
                  className='btn btn-sm btn-outline btn-info group relative overflow-hidden'
                  onClick={handleShare}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 size={16} />
                  <span className='relative z-10'>Share profile</span>
                </motion.button>

                <motion.button
                  className='btn btn-primary btn-sm group relative overflow-hidden'
                  onClick={handleUpdateAndRank}
                  disabled={updateUserDataLoading}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={{ rotate: updateUserDataLoading ? 360 : 0 }}
                    transition={{
                      repeat: updateUserDataLoading ? Infinity : 0,
                      duration: 1,
                      ease: 'linear',
                    }}
                  >
                    <RefreshCw size={16} />
                  </motion.div>
                  <span className='relative z-10'>
                    {updateUserDataLoading ? 'Updating...' : 'Update'}
                  </span>
                </motion.button>
              </motion.div>
            </div>

            {/* Favorites Sidebar */}
            <motion.div
              className='lg:w-80 xl:w-96'
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className='bg-base-200/30 rounded-xl p-4 border border-base-300/30'>
                <div className='flex items-center gap-2 justify-center mb-4'>
                  <Users size={16} className='text-primary' />
                  <h3 className='font-semibold text-base-content'>Favorites</h3>
                  <span className='badge badge-primary badge-sm'>
                    {favorites.length}
                  </span>
                </div>

                <div className='max-h-40 overflow-y-auto custom-scrollbar'>
                  {favoritesList}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast Messages */}
      <AnimatePresence>
        {shareMsg && (
          <motion.div
            className='absolute top-4 right-4 bg-success text-success-content px-4 py-2 rounded-lg shadow-lg flex items-center gap-2'
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Copy size={16} />
            <span className='text-sm font-medium'>{shareMsg}</span>
          </motion.div>
        )}

        {rankMsg && (
          <motion.div
            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-info text-info-content px-6 py-3 rounded-lg shadow-lg flex items-center gap-2'
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Trophy size={18} />
            <span className='font-medium'>{rankMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HeaderSection;
