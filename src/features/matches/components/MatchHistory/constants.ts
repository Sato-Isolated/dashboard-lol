import {
  createStaggerAnimation,
  createScaleAnimation,
} from '@/components/common/ui/motion/MotionUtilities';
import { commonVariants } from '@/components/common/ui/motion/MotionVariants';

// Use centralized motion utilities
const staggerConfig = createStaggerAnimation(0.1, 0.2);

export const containerVariants = staggerConfig.container;

export const itemVariants = {
  ...commonVariants.slideUp,
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const statsCardVariants = {
  ...createScaleAnimation(0.8, 1),
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'backOut',
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};
