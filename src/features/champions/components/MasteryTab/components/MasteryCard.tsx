import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Target } from 'lucide-react';
import { getChampionIcon } from '@/lib/utils/helpers';
import { getMasteryLevelStyle } from '../utils/masteryLevelStyle';
import { itemVariants } from '../utils/animations';
import type { MasteryWithChampion } from '../masteryTabTypes';

interface MasteryCardProps {
  mastery: MasteryWithChampion;
  index: number;
}

export const MasteryCard: React.FC<MasteryCardProps> = React.memo(
  ({ mastery, index }) => {
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
                  mastery.champ ? mastery.champ.id : String(mastery.championId),
                )}
                alt={
                  mastery.champ
                    ? mastery.champ.name
                    : String(mastery.championId)
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
                        100,
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
  },
);

MasteryCard.displayName = 'MasteryCard';
