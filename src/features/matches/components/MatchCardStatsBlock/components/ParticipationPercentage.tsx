import React from 'react';
import { motion } from 'motion/react';
import { participationVariants } from '../constants';
import { formatParticipationPercentage } from '../utils';
import type { ParticipationProps } from '../matchCardStatsTypes';

const ParticipationPercentage: React.FC<ParticipationProps> = ({ pKill }) => {
  return (
    <motion.div
      variants={participationVariants}
      initial='initial'
      animate='animate'
      className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                 bg-gradient-to-r from-secondary/20 to-accent/20 
                 border border-secondary/30 text-secondary font-bold text-sm
                 shadow-lg transition-all duration-300 mb-3'
    >
      <svg
        className='w-4 h-4'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        viewBox='0 0 24 24'
      >
        <circle cx='12' cy='12' r='10' />
        <polyline points='8,12 12,16 16,12' />
      </svg>
      <span>P/Kill {formatParticipationPercentage(pKill)}</span>
    </motion.div>
  );
};

export default React.memo(ParticipationPercentage);
