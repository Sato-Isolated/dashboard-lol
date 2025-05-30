import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { TrendingUp, Trophy, Target, Sword, User } from 'lucide-react';
import { getChampionIcon } from '@/lib/utils/helpers';
import { ChampionRowProps } from '../championsTabTypes';
import { rowVariants } from '../utils/animations';

export const ChampionRow: React.FC<ChampionRowProps> = React.memo(
  ({ champ, championInfo, getWinrate, index }) => {
    const winrate = getWinrate(champ);
    const isHighWinrate = winrate >= 60;
    const isGoodKDA = champ.kda >= 2.0;

    return (
      <motion.tr
        variants={rowVariants}
        initial='hidden'
        animate='visible'
        custom={index}
        className='group relative overflow-hidden transition-all duration-300 
                 border-b border-base-content/10'
      >
        {/* Champion info with avatar */}
        <td className='relative py-4 px-6'>
          <motion.div
            className='flex items-center gap-3'
            transition={{ duration: 0.2 }}
          >
            <motion.div className='relative' transition={{ duration: 0.2 }}>
              <Image
                src={getChampionIcon(champ.champion)}
                alt={champ.champion}
                width={48}
                height={48}
                className='w-12 h-12 rounded-xl shadow-lg border-2 border-base-content/20
                         transition-all duration-300'
              />
              {isGoodKDA && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full 
                           flex items-center justify-center shadow-lg'
                >
                  <Sword size={8} className='text-success-content' />
                </motion.div>
              )}
            </motion.div>
            <div className='flex flex-col'>
              <span
                className='font-bold text-lg text-base-content 
                           transition-colors duration-300'
              >
                {championInfo ? championInfo.name : champ.champion}
              </span>
              <span className='text-xs text-base-content/60 font-medium'>
                {champ.games} game{champ.games !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </td>

        {/* Games played */}
        <td className='relative py-4 px-6 text-center'>
          <motion.div className='flex items-center justify-center gap-2'>
            <User size={16} className='text-base-content/60' />
            <span className='font-bold text-lg'>{champ.games}</span>
          </motion.div>
        </td>

        {/* Wins */}
        <td className='relative py-4 px-6 text-center'>
          <motion.div className='flex items-center justify-center gap-2'>
            <Trophy size={16} className='text-success' />
            <span className='font-bold text-lg text-success'>{champ.wins}</span>
          </motion.div>
        </td>

        {/* Winrate badge */}
        <td className='relative py-4 px-6 text-center'>
          <motion.div transition={{ duration: 0.2 }}>
            <span
              className={`badge badge-lg font-bold px-4 py-2 shadow-lg
                          ${
                            isHighWinrate
                              ? 'badge-success text-success-content'
                              : winrate >= 45
                                ? 'badge-warning text-warning-content'
                                : 'badge-error text-error-content'
                          }`}
            >
              <TrendingUp size={14} className='mr-1' />
              {winrate.toFixed(1)}%
            </span>
          </motion.div>
        </td>

        {/* KDA badge */}
        <td className='relative py-4 px-6 text-center'>
          <motion.div transition={{ duration: 0.2 }}>
            <span
              className={`badge badge-lg font-bold px-4 py-2 shadow-lg
                          ${
                            isGoodKDA
                              ? 'badge-info text-info-content'
                              : champ.kda >= 1.5
                                ? 'badge-warning text-warning-content'
                                : 'badge-ghost'
                          }`}
            >
              <Target size={14} className='mr-1' />
              {champ.kda.toFixed(2)}
            </span>
          </motion.div>
        </td>

        {/* KDA breakdown */}
        <td className='relative py-4 px-6 text-center'>
          <motion.div className='flex items-center justify-center gap-1 text-sm font-semibold'>
            <span className='text-success'>{champ.kills}</span>
            <span className='text-base-content/40'>/</span>
            <span className='text-error'>{champ.deaths}</span>
            <span className='text-base-content/40'>/</span>
            <span className='text-info'>{champ.assists}</span>
          </motion.div>
        </td>
      </motion.tr>
    );
  },
);

ChampionRow.displayName = 'ChampionRow';
