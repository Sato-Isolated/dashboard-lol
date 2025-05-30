import {
  createSlideAnimation,
  createHoverVariant,
  createDelayedAnimation,
} from '@/components/common/ui/motion/MotionUtilities';
import {
  commonVariants,
  commonTransitions,
} from '@/components/common/ui/motion/MotionVariants';

// Use centralized motion utilities for consistent animations
export const formVariants = createSlideAnimation('up');

export const inputContainerVariants = createHoverVariant(1.01, 0.2);

export const inputVariants = commonVariants.fadeIn;

export const separatorVariants = {
  initial: { scaleY: 0 },
  animate: { scaleY: 1 },
  transition: commonTransitions.fast,
};

export const buttonVariants = {
  ...createDelayedAnimation(0.7),
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      delay: 0.7,
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
  whileTap: { scale: 0.95 },
};

export const suggestionListVariants = {
  ...commonVariants.scaleIn,
  initial: { opacity: 0, y: -10, scale: 0.95 },
  transition: commonTransitions.fast,
};

export const suggestionItemVariants = commonVariants.slideLeft;

export const errorMessageVariants = {
  ...commonVariants.scaleIn,
  initial: { opacity: 0, y: -10, scale: 0.9 },
};

export const iconRotationVariants = {
  animate: { rotate: [0, 5, -5, 0] },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};
