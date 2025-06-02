import { Variants } from 'motion/react';
import {
  createStaggerAnimation,
  createSlideAnimation,
} from '@/components/common/ui/motion/MotionUtilities';
import {
  commonVariants,
  commonTransitions,
} from '@/components/common/ui/motion/MotionVariants';

// Use centralized stagger animation
const staggerConfig = createStaggerAnimation(0.1, 0.2);

export const containerVariants: Variants = staggerConfig.container;

// Use centralized utilities for consistent animations
export const rowVariants: Variants = {
  ...staggerConfig.item,
  ...createSlideAnimation('left', 20),
  visible: {
    ...createSlideAnimation('left', 20).animate,
    scale: 1,
    transition: commonTransitions.spring,
  },
  hover: {
    x: 4,
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

export const cardVariants: Variants = {
  ...commonVariants.slideUp,
  visible: {
    ...commonVariants.slideUp.animate,
    transition: commonTransitions.slow,
  },
};
