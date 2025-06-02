import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { RefreshCw, Shield, Zap, Users } from 'lucide-react';
import { getSummonerIcon } from '@/lib/utils/helpers';

interface LoadingStatesProps {
  loadingSummoner?: boolean;
  updateUserDataLoading?: boolean;
  errorSummoner?: any;
  account?: { gameName: string; tagLine: string } | null;
  summoner?: { profileIconId: number; summonerLevel: number } | null;
  effectiveRegion?: string;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  loadingSummoner,
  updateUserDataLoading,
  errorSummoner,
  account,
  summoner,
  effectiveRegion,
}) => {
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
  if (updateUserDataLoading && account && summoner && effectiveRegion) {
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

  return null;
};
