import React from 'react';
import { motion } from 'framer-motion';
import type { ChampionMastery } from '../types';
import { fadeInUp } from '../constants';
import { formatNumber } from '../utils';

interface ChampionMasteryDisplayProps {
  mastery: ChampionMastery;
  variant: 'compact' | 'default' | 'detailed';
}

export const ChampionMasteryDisplay: React.FC<ChampionMasteryDisplayProps> = ({
  mastery,
  variant,
}) => {
  if (variant === 'compact') {
    return (
      <div className='flex items-center gap-2 mt-1'>
        <span className='badge badge-primary badge-xs'>
          M{mastery.championLevel}
        </span>
        <span className='text-xs text-base-content/60'>
          {formatNumber(mastery.championPoints)}
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div className='bg-base-100 rounded-lg p-4' variants={fadeInUp}>
        <h4 className='font-semibold text-sm text-base-content/80 mb-3'>
          Mastery Info
        </h4>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='badge badge-primary'>
              Level {mastery.championLevel}
            </span>
            <span className='text-sm text-base-content/70'>
              {formatNumber(mastery.championPoints)} points
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <div className='flex items-center justify-between'>
      <span className='badge badge-primary badge-lg'>
        M{mastery.championLevel}
      </span>
      <div className='text-center'>
        <div className='font-bold text-base-content'>
          {formatNumber(mastery.championPoints)}
        </div>
        <div className='text-xs text-base-content/60'>Points</div>
      </div>
    </div>
  );
};

export default React.memo(ChampionMasteryDisplay);
