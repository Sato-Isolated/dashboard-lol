'use client';
import React from 'react';
import { motion } from 'motion/react';
import { backgroundEffectVariants } from '../constants';
import { AnimatedBackgroundEffectsProps } from '../matchCardTypes';

const AnimatedBackgroundEffects: React.FC<AnimatedBackgroundEffectsProps> = ({
  isWin,
}) => {
  return (
    <div className='absolute inset-0 pointer-events-none overflow-hidden'>
      {/* Primary animated blob */}
      <motion.div
        className={`absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl
          ${isWin ? 'bg-success/30' : 'bg-error/30'}`}
        {...backgroundEffectVariants.winBlob}
      />

      {/* Secondary animated blob */}
      <motion.div
        className='absolute -bottom-32 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl'
        {...backgroundEffectVariants.lossBlob}
      />

      {/* Shimmer effect on hover */}
      <motion.div
        className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12'
        initial={{ x: '-100%' }}
      />
    </div>
  );
};

export default React.memo(AnimatedBackgroundEffects);
