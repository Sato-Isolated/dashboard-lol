import React from 'react';
import { motion } from 'motion/react';
import { kdaDisplayVariants } from '../constants';
import type { KDADisplayProps } from '../matchCardStatsTypes';

const KDADisplay: React.FC<KDADisplayProps> = ({ kills, deaths, assists }) => {
  return (
    <motion.div
      variants={kdaDisplayVariants}
      initial='initial'
      animate='animate'
      className='flex items-center gap-3 text-3xl font-extrabold tracking-tight mb-3'
    >
      <motion.span className='text-success drop-shadow-lg font-mono cursor-default'>
        {kills}
      </motion.span>
      <span className='text-base-content/50 text-2xl'>/</span>
      <motion.span className='text-error drop-shadow-lg font-mono cursor-default'>
        {deaths}
      </motion.span>
      <span className='text-base-content/50 text-2xl'>/</span>
      <motion.span className='text-info drop-shadow-lg font-mono cursor-default'>
        {assists}
      </motion.span>
    </motion.div>
  );
};

export default React.memo(KDADisplay);
