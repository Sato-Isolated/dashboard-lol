import React from 'react';
import { motion } from 'framer-motion';
import {
  ChampionAvatar,
  ChampionInfo,
  ChampionStatsDisplay,
  ChampionMasteryDisplay,
  ChampionTags,
  ChampionDifficulty,
  ChampionCardSkeleton,
} from './components';
import { useWinRate } from './hooks/useWinRate';
import type { ChampionCardProps } from './types';
import { fadeInUp, scaleOnHover, CHAMPION_CARD_STYLES } from './constants';

// Inject CSS styles
if (
  typeof document !== 'undefined' &&
  !document.querySelector('#champion-card-styles')
) {
  const style = document.createElement('style');
  style.id = 'champion-card-styles';
  style.textContent = CHAMPION_CARD_STYLES;
  document.head.appendChild(style);
}

const ChampionCardComponent: React.FC<ChampionCardProps> = ({
  champion,
  variant = 'default',
  loading = false,
  onClick,
  showStats = true,
  showMastery = true,
}) => {
  const { championData, stats, mastery } = champion;
  const winRate = useWinRate(stats);

  if (loading) {
    return <ChampionCardSkeleton variant={variant} />;
  }

  // Compact variant - minimal display
  if (variant === 'compact') {
    return (
      <motion.div
        className={`card bg-base-200 rounded-xl shadow transition-all duration-200 p-3 ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick}
        {...scaleOnHover}
        variants={fadeInUp}
        initial='initial'
        animate='animate'
        exit='exit'
      >
        {' '}
        <div className='flex items-center gap-3'>
          <ChampionAvatar championData={championData} size='small' />
          <ChampionInfo
            championData={championData}
            variant={variant}
            mastery={mastery}
            showMastery={showMastery}
          />
        </div>
      </motion.div>
    );
  }

  // Detailed variant - full information display
  if (variant === 'detailed') {
    return (
      <motion.div
        className={`card bg-base-200 rounded-xl shadow-xl transition-all duration-300 p-6 ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick}
        {...scaleOnHover}
        variants={fadeInUp}
        initial='initial'
        animate='animate'
        exit='exit'
      >
        <motion.div
          className='flex flex-col items-center gap-4'
          variants={fadeInUp}
        >
          <ChampionAvatar championData={championData} size='large' />

          <ChampionInfo
            championData={championData}
            variant={variant}
            mastery={mastery}
            showMastery={showMastery}
          />

          <ChampionTags tags={championData.tags} variant={variant} />

          <div className='w-full space-y-3'>
            {showStats && stats && (
              <ChampionStatsDisplay
                stats={stats}
                variant={variant}
                winRate={winRate}
              />
            )}

            {showMastery && mastery && (
              <ChampionMasteryDisplay mastery={mastery} variant={variant} />
            )}
          </div>

          <ChampionDifficulty difficulty={championData.info.difficulty} />
        </motion.div>
      </motion.div>
    );
  }

  // Default variant - balanced display
  return (
    <motion.div
      className={`card bg-base-200 rounded-xl shadow transition-all duration-200 p-4 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
      {...scaleOnHover}
      variants={fadeInUp}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      {' '}
      <div className='flex items-center gap-4'>
        <ChampionAvatar championData={championData} size='medium' />

        <div className='flex-1 min-w-0'>
          <ChampionInfo
            championData={championData}
            variant={variant}
            mastery={mastery}
            showMastery={showMastery}
          />

          <ChampionTags tags={championData.tags} variant={variant} />

          <div className='flex gap-3 text-sm'>
            {showStats && stats && (
              <ChampionStatsDisplay
                stats={stats}
                variant={variant}
                winRate={winRate}
              />
            )}
            {showMastery && mastery && !showStats && (
              <ChampionMasteryDisplay mastery={mastery} variant={variant} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ChampionCard = React.memo(ChampionCardComponent);
export default ChampionCard;
