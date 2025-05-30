import {
  createStaggerAnimation,
  createScaleAnimation,
} from '@/components/common/ui/motion/MotionUtilities';
import { commonVariants } from '@/components/common/ui/motion/MotionVariants';

// Use centralized motion utilities
const staggerConfig = createStaggerAnimation(0.05, 0.1);

export const containerVariants = staggerConfig.container;

export const itemVariants = {
  ...commonVariants.slideUp,
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

export const statsCardVariants = {
  ...createScaleAnimation(0.8, 1),
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};
