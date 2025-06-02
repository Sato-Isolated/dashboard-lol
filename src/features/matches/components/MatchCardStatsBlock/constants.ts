import {
  createSlideAnimation,
  createScaleAnimation,
  createBadgeAnimation,
} from '@/components/common/ui/motion/MotionUtilities';

// Use centralized motion utilities
export const statsBlockVariants = {
  ...createSlideAnimation('left', 20),
  animate: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.3, duration: 0.5 },
  },
};

export const kdaDisplayVariants = {
  ...createScaleAnimation(0.8, 1),
  animate: {
    scale: 1,
    opacity: 1,
    transition: { delay: 0.4, type: 'spring', stiffness: 300 },
  },
};

export const kdaRatioVariants = {
  ...createSlideAnimation('up', 10),
  animate: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.5 },
  },
};

export const participationVariants = {
  ...createSlideAnimation('up', 10),
  animate: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.6 },
  },
};

export const badgeVariants = (index: number) =>
  createBadgeAnimation(index, 0.5, 0.1);
