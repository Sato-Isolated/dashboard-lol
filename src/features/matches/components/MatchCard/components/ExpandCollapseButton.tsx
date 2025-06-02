'use client';
import React from 'react';
import { motion } from 'motion/react';
import { expandButtonVariants } from '../constants';
import { ExpandCollapseButtonProps } from '../matchCardTypes';

const ExpandCollapseButton: React.FC<ExpandCollapseButtonProps> = ({
  open,
  onClick,
}) => {
  return (
    <motion.button
      whileTap={expandButtonVariants.tap}
      onClick={onClick}
      className={`absolute top-4 right-4 z-20 btn btn-circle btn-ghost btn-sm 
        backdrop-blur-md bg-base-100/30 border border-base-content/20 transition-all duration-300
        ${open ? 'shadow-lg ring-2 ring-primary/30' : ''}`}
    >
      <motion.div animate={expandButtonVariants.iconRotate(open)}>
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </motion.div>
    </motion.button>
  );
};

export default React.memo(ExpandCollapseButton);
