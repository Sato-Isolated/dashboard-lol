import React from 'react';
import { motion } from 'motion/react';
import { Crown } from 'lucide-react';
import { cardVariants } from '../constants';
import type { RankBadgeCardProps } from '../summonerProfileTypes';
import RankBadge from '../../RankBadge';

export const RankBadgeCard: React.FC<RankBadgeCardProps> = ({
  aramScore,
  leagues,
}) => {
  return (
    <motion.div
      variants={cardVariants}
      className='card bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 
                 rounded-2xl shadow-2xl border border-primary/20 overflow-hidden
                 transition-shadow duration-300'
    >
      <div className='card-body p-6'>
        {/* Header with animated icon */}
        <motion.div className='flex items-center gap-3 mb-4'>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className='flex items-center justify-center w-8 h-8 rounded-full 
                       bg-primary/20 text-primary'
          >
            <Crown size={18} />
          </motion.div>
          <h3 className='font-bold text-primary text-xl flex items-center gap-2'>
            Rank & Badges
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className='w-2 h-2 rounded-full bg-primary'
            />
          </h3>
        </motion.div>
        {/* Rank Badge Container */}
        <motion.div transition={{ duration: 0.2 }} className='relative'>
          <RankBadge aramScore={aramScore} leagues={leagues} />
        </motion.div>
      </div>
    </motion.div>
  );
};
