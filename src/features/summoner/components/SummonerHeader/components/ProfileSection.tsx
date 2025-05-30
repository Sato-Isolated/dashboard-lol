import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { getSummonerIcon } from '@/lib/utils/helpers';

interface ProfileSectionProps {
  account: {
    gameName: string;
    tagLine: string;
  } | null;
  summoner: {
    profileIconId: number;
    summonerLevel: number;
  } | null;
  effectiveRegion: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  account,
  summoner,
  effectiveRegion,
}) => {
  if (!account || !summoner) {
    return null;
  }

  return (
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
          <span className='text-base-content/60 ml-1'>#{account.tagLine}</span>
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
  );
};
