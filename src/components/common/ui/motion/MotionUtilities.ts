import { useScroll, useTransform } from 'motion/react';

// Utility hooks and functions for Motion

// Utility function to create delayed animations
export function createDelayedAnimation(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.5, ease: 'easeOut' },
    },
  };
}

// Utility function for creating stagger animations
export function createStaggerAnimation(
  staggerDelay = 0.1,
  delayChildren = 0.2,
) {
  return {
    container: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren,
        },
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 25,
        },
      },
    },
  };
}

// Utility for creating hover variants
export function createHoverVariant(scale = 1.05, duration = 0.2) {
  return {
    whileHover: {
      scale,
      transition: { duration, ease: 'easeOut' },
    },
    whileTap: {
      scale: scale * 0.95,
      transition: { duration: 0.1, ease: 'easeOut' },
    },
    whileFocus: {
      scale: 1.05,
      transition: { duration, ease: 'easeOut' },
    },
  };
}

// Utility for background animation effects
export function createBackgroundAnimation(duration = 8) {
  return {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      rotate: [0, 90, 0],
    },
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };
}

// Utility for creating slide animations
export function createSlideAnimation(
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance = 20,
) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, ...directions[direction] },
  };
}

// Utility for creating scale animations
export function createScaleAnimation(
  initialScale = 0.9,
  animateScale = 1,
  exitScale?: number,
) {
  return {
    initial: { opacity: 0, scale: initialScale },
    animate: { opacity: 1, scale: animateScale },
    exit: { opacity: 0, scale: exitScale || initialScale },
  };
}

// Utility for creating indexed badge animations
export function createBadgeAnimation(
  index: number,
  baseDelay = 0.5,
  staggerDelay = 0.1,
) {
  return {
    initial: { opacity: 0, scale: 0, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: baseDelay + index * staggerDelay,
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  };
}

// Re-export motion components and hooks for convenience
export {
  motion,
  useAnimate,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'motion/react';
