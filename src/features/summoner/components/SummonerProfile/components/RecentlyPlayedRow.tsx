import React from 'react';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, User, ChevronRight } from 'lucide-react';
import {
  rowVariants,
  isGoodPerformance,
  getWinrateCategory,
  getGamesCategory,
} from '../constants';
import type { RecentlyPlayedRowProps } from '../summonerProfileTypes';

export const RecentlyPlayedRow: React.FC<RecentlyPlayedRowProps> = React.memo(
  ({ player, effectiveRegion, effectiveTagline, index }) => {
    const winrate = player.winrate;
    const isGoodPerf = isGoodPerformance(player);
    const winrateCategory = getWinrateCategory(winrate);
    const gamesCategory = getGamesCategory(player.games);

    return (
      <motion.tr
        variants={rowVariants}
        initial='hidden'
        animate='visible'
        custom={index}
        className='group relative overflow-hidden transition-all duration-300 
                   border-b border-base-content/10 last:border-b-0'
      >
        {/* Summoner Name with enhanced styling */}
        <td className='py-4 px-4 font-semibold'>
          <motion.div
            transition={{ duration: 0.2 }}
            className='flex items-center gap-2'
          >
            <div className='flex items-center gap-2'>
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  isGoodPerf ? 'bg-success' : 'bg-base-content/40'
                }`}
                animate={{
                  scale: isGoodPerf ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isGoodPerf ? Infinity : 0,
                }}
              />
              <a
                href={`/${effectiveRegion}/summoner/${encodeURIComponent(
                  player.name,
                )}/${encodeURIComponent(
                  player.tagline ? player.tagline : effectiveTagline,
                )}`}
                className='link link-primary font-bold 
                           flex items-center gap-1'
              >
                <User size={14} className='opacity-60' />
                <span className='truncate max-w-[120px]'>{player.name}</span>
                <ChevronRight size={12} className='opacity-100' />
              </a>
            </div>
          </motion.div>
        </td>

        {/* Games with enhanced badge */}
        <td className='py-4 px-4 text-center'>
          <motion.div transition={{ duration: 0.2 }}>
            <span
              className={`badge badge-lg font-bold px-3 py-2 shadow-lg
                          ${
                            gamesCategory === 'many'
                              ? 'badge-info text-info-content'
                              : gamesCategory === 'some'
                                ? 'badge-warning text-warning-content'
                                : 'badge-ghost'
                          }`}
            >
              <Trophy size={12} className='mr-1' />
              {player.games}
            </span>
          </motion.div>
        </td>

        {/* Winrate with dynamic styling */}
        <td className='py-4 px-4 text-center'>
          <motion.div transition={{ duration: 0.2 }}>
            <span
              className={`badge badge-lg font-bold px-3 py-2 shadow-lg
                          ${
                            winrateCategory === 'high'
                              ? 'badge-success text-success-content'
                              : winrateCategory === 'medium'
                                ? 'badge-warning text-warning-content'
                                : 'badge-error text-error-content'
                          }`}
            >
              <TrendingUp size={12} className='mr-1' />
              {winrate}%
            </span>
          </motion.div>
        </td>

        {/* W/L with enhanced display */}
        <td className='py-4 px-4 text-center'>
          <motion.div className='flex items-center justify-center gap-1 text-sm font-semibold'>
            <span className='text-success font-bold'>{player.wins}W</span>
            <span className='text-base-content/40'>/</span>
            <span className='text-error font-bold'>
              {player.games - player.wins}L
            </span>
          </motion.div>
        </td>
      </motion.tr>
    );
  },
);

RecentlyPlayedRow.displayName = 'RecentlyPlayedRow';
