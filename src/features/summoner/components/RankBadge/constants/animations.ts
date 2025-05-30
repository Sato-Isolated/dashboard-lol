import {
  createStaggerAnimation,
  createSlideAnimation,
} from '@/components/common/ui/motion/MotionUtilities';
import { commonVariants } from '@/components/common/ui/motion/MotionVariants';

// Use centralized motion utilities
const staggerConfig = createStaggerAnimation(0.1, 0.2);

export const containerVariants = {
  ...staggerConfig.container,
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.6,
    },
  },
};

export const cardVariants = {
  ...commonVariants.slideUp,
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.4,
    },
  },
};

export const rankItemVariants = {
  ...createSlideAnimation('right', 20),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 12,
    },
  },
};
