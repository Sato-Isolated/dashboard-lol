import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Trophy,
  TrendingUp,
  User,
  RefreshCw,
  Target,
  Star,
} from 'lucide-react';
import { cardVariants, calculateAverageWinrate } from '../constants';
import type { RecentlyPlayedCardProps } from '../summonerProfileTypes';
import { RecentlyPlayedRow } from './RecentlyPlayedRow';

export const RecentlyPlayedCard: React.FC<RecentlyPlayedCardProps> = ({
  recentlyPlayed,
  effectiveRegion,
  effectiveTagline,
}) => {
  return (
    <motion.div
      variants={cardVariants}
      className='card bg-gradient-to-br from-accent/10 via-accent/5 to-info/10 
                 rounded-2xl shadow-2xl border border-accent/20 overflow-hidden
                 transition-shadow duration-300'
    >
      <div className='card-body p-6'>
        {/* Header with animated icon */}
        <motion.div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className='flex items-center justify-center w-8 h-8 rounded-full 
                         bg-accent/20 text-accent'
            >
              <Users size={18} />
            </motion.div>
            <h3 className='font-bold text-accent text-xl flex items-center gap-2'>
              Recently Played With
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className='w-2 h-2 rounded-full bg-accent'
              />
            </h3>
          </div>
          {recentlyPlayed.length > 0 && (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className='btn btn-ghost btn-sm btn-circle'
            >
              <RefreshCw size={16} />
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        <div className='w-full'>
          {recentlyPlayed.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex flex-col items-center justify-center py-8 text-center'
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className='text-6xl mb-4 opacity-60'
              >
                👥
              </motion.div>
              <span className='text-base-content/60 text-sm font-medium'>
                No recent teammates found
              </span>
              <span className='text-base-content/40 text-xs mt-1'>
                Play some games to see your recent teammates!
              </span>
            </motion.div>
          ) : (
            <div className='overflow-x-auto rounded-xl'>
              <table className='table w-full'>
                {/* Enhanced Table Header */}
                <thead className='bg-gradient-to-r from-base-200 to-base-300'>
                  <tr>
                    <th className='font-bold text-base-content/80'>
                      <div className='flex items-center gap-2'>
                        <User size={14} />
                        Summoner
                      </div>
                    </th>
                    <th className='text-center font-bold text-base-content/80'>
                      <div className='flex items-center justify-center gap-2'>
                        <Trophy size={14} />
                        Games
                      </div>
                    </th>
                    <th className='text-center font-bold text-base-content/80'>
                      <div className='flex items-center justify-center gap-2'>
                        <TrendingUp size={14} />
                        WR
                      </div>
                    </th>
                    <th className='text-center font-bold text-base-content/80'>
                      <div className='flex items-center justify-center gap-2'>
                        <Target size={14} />
                        W/L
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {recentlyPlayed.map((p, i) => (
                      <RecentlyPlayedRow
                        key={`${p.name}-${i}`}
                        player={p}
                        effectiveRegion={effectiveRegion}
                        effectiveTagline={effectiveTagline}
                        index={i}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer with stats summary */}
        {recentlyPlayed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='mt-4 pt-4 border-t border-base-content/10'
          >
            <div className='flex items-center justify-between text-xs text-base-content/60'>
              <span className='flex items-center gap-1'>
                <Users size={12} />
                {recentlyPlayed.length} recent teammate
                {recentlyPlayed.length !== 1 ? 's' : ''}
              </span>
              <span className='flex items-center gap-1'>
                <Star size={12} />
                {calculateAverageWinrate(recentlyPlayed)}% avg winrate
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
