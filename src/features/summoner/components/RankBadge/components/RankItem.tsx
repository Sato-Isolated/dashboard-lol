'use client';
import React from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Star,
  TrendingUp,
  Crown,
  Medal,
  Shield,
  Sparkles,
  Target,
} from 'lucide-react';
import { tierColors, tierGradients, queueDisplayNames } from '../constants';
import type { RankItemProps } from '../types';

const RankItemComponent: React.FC<RankItemProps> = ({ rank }) => {
  const tierColor = tierColors[rank.tier] || 'text-base-content';
  const tierGradient = tierGradients[rank.tier] || 'from-base-100 to-base-200';
  const queueName =
    queueDisplayNames[rank.queueType] ||
    rank.queueType
      .replace('RANKED_', '')
      .replace('_5x5', '')
      .replace('_SR', '');

  const winRate =
    rank.wins + rank.losses > 0
      ? Math.round((rank.wins / (rank.wins + rank.losses)) * 100)
      : 0;

  const isHighRank = ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(
    rank.tier,
  );
  const isGoodWinrate = winRate >= 60;

  return (
    <motion.div
      className={`card bg-gradient-to-br ${tierGradient} 
                 shadow-lg border border-base-content/10 overflow-hidden
                 transition-all duration-300`}
    >
      <div className='card-body p-4'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <motion.div className='text-base-content/40'>
              {isHighRank ? (
                <Crown size={16} className='text-yellow-500' />
              ) : (
                <Medal size={16} />
              )}
            </motion.div>
            <span className='font-semibold text-sm text-base-content/90'>
              {queueName}
            </span>
          </div>
          {isHighRank && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='badge badge-warning badge-xs gap-1'
            >
              <Sparkles size={10} />
              Elite
            </motion.div>
          )}
        </div>

        <div className='flex items-center justify-between mb-3'>
          <motion.div
            className={`text-lg font-bold ${tierColor} flex items-center gap-2`}
          >
            <Trophy size={18} className={tierColor} />
            {rank.tier} {rank.rank}
          </motion.div>
          <div className='text-right'>
            <div className='flex items-center gap-1 text-xs text-base-content/60'>
              <Star size={12} />
              <span className='font-semibold'>{rank.leaguePoints} LP</span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-2'>
          <motion.div className='text-center p-2 bg-success/10 rounded-lg border border-success/20'>
            <div className='text-sm font-bold text-success flex items-center justify-center gap-1'>
              <Target size={14} />
              {rank.wins}
            </div>
            <div className='text-xs text-base-content/60'>Wins</div>
          </motion.div>
          <motion.div className='text-center p-2 bg-error/10 rounded-lg border border-error/20'>
            <div className='text-sm font-bold text-error flex items-center justify-center gap-1'>
              <Shield size={14} />
              {rank.losses}
            </div>
            <div className='text-xs text-base-content/60'>Losses</div>
          </motion.div>
          <motion.div
            className={`text-center p-2 rounded-lg border ${
              isGoodWinrate
                ? 'bg-info/10 border-info/20'
                : 'bg-warning/10 border-warning/20'
            }`}
          >
            <div
              className={`text-sm font-bold flex items-center justify-center gap-1 ${
                isGoodWinrate ? 'text-info' : 'text-warning'
              }`}
            >
              <TrendingUp size={14} />
              {winRate}%
            </div>
            <div className='text-xs text-base-content/60'>WR</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export const RankItem = React.memo(RankItemComponent);
RankItem.displayName = 'RankItem';
