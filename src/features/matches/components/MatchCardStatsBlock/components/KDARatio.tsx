import React from 'react';
import { motion } from 'motion/react';
import { kdaRatioVariants } from '../constants';
import { formatKDAValue } from '../utils';
import type { KDARatioProps } from '../matchCardStatsTypes';

const KDARatio: React.FC<KDARatioProps> = ({ kdaValue }) => {
  return (
    <motion.div
      variants={kdaRatioVariants}
      initial='initial'
      animate='animate'
      className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                 bg-gradient-to-r from-primary/20 to-accent/20 
                 border border-primary/30 text-primary font-bold text-sm
                 shadow-lg transition-all duration-300 mb-2'
    >
      <svg
        className='w-4 h-4'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        viewBox='0 0 24 24'
      >
        <path d='M12 20l9-5-9-5-9 5 9 5z' />
        <path d='M12 10l9-5-9-5-9 5 9 5z' />
      </svg>
      <span>KDA: {formatKDAValue(kdaValue)}</span>
    </motion.div>
  );
};

export default React.memo(KDARatio);
