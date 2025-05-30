'use client';
import React from 'react';
import { motion } from 'motion/react';
import { badgeVariants } from '../constants';
import { ResultBadgeProps } from '../types';
import { getResultDisplay } from '../utils';

const ResultBadge: React.FC<ResultBadgeProps> = ({ isWin }) => {
  const { text, emoji } = getResultDisplay(isWin);

  return (
    <motion.div
      {...badgeVariants}
      className={`absolute top-4 left-4 z-20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md
        ${
          isWin
            ? 'bg-success/30 text-success border border-success/50 shadow-success/30'
            : 'bg-error/30 text-error border border-error/50 shadow-error/30'
        } shadow-lg`}
    >
      <motion.span
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {emoji} {text}
      </motion.span>
    </motion.div>
  );
};

export default React.memo(ResultBadge);
