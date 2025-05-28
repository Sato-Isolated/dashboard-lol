import React from 'react';
import { motion } from 'framer-motion';
import type { ChampionStats } from '../types';
import { fadeInUp } from '../constants';
import { formatNumber } from '../utils';

interface ChampionStatsDisplayProps {
  stats: ChampionStats;
  variant: 'compact' | 'default' | 'detailed';
  winRate: number;
}

export const ChampionStatsDisplay: React.FC<ChampionStatsDisplayProps> = ({
  stats,
  variant,
  winRate,
}) => {
  if (variant === 'detailed') {
    return (
      <motion.div className='bg-base-100 rounded-lg p-4' variants={fadeInUp}>
        <h4 className='font-semibold text-sm text-base-content/80 mb-3'>
          Performance Stats
        </h4>
        <div className='grid grid-cols-2 gap-3'>
          <div className='stat-item'>
            <span className='text-xs text-base-content/60'>Games</span>
            <span className='font-bold text-base-content'>{stats.games}</span>
          </div>
          <div className='stat-item'>
            <span className='text-xs text-base-content/60'>Win Rate</span>
            <span className='font-bold text-success'>
              {winRate.toFixed(1)}%
            </span>
          </div>
          <div className='stat-item'>
            <span className='text-xs text-base-content/60'>KDA</span>
            <span className='font-bold text-info'>{stats.kda.toFixed(2)}</span>
          </div>
          <div className='stat-item'>
            <span className='text-xs text-base-content/60'>Avg K/D/A</span>
            <span className='font-bold text-base-content'>
              {(stats.kills / stats.games).toFixed(1)}/
              {(stats.deaths / stats.games).toFixed(1)}/
              {(stats.assists / stats.games).toFixed(1)}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'default') {
    return (
      <div className='flex gap-3 text-sm'>
        <div className='text-center'>
          <div className='font-bold text-base-content'>{stats.games}</div>
          <div className='text-xs text-base-content/60'>Games</div>
        </div>
        <div className='text-center'>
          <div className='font-bold text-success'>{winRate.toFixed(1)}%</div>
          <div className='text-xs text-base-content/60'>Win Rate</div>
        </div>
        <div className='text-center'>
          <div className='font-bold text-info'>{stats.kda.toFixed(2)}</div>
          <div className='text-xs text-base-content/60'>KDA</div>
        </div>
      </div>
    );
  }

  return null; // No stats display for compact variant
};

export default React.memo(ChampionStatsDisplay);
