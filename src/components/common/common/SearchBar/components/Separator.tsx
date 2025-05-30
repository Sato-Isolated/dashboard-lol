import React from 'react';
import { motion } from 'motion/react';
import { separatorVariants } from '../utils/animations';

interface SeparatorProps {
  delay: number;
}

export const Separator: React.FC<SeparatorProps> = ({ delay }) => {
  return (
    <motion.div
      initial={separatorVariants.initial}
      animate={separatorVariants.animate}
      transition={{ delay }}
      className='hidden sm:block w-px h-6 sm:h-8 bg-gradient-to-b from-transparent via-base-content/30 to-transparent'
    />
  );
};
