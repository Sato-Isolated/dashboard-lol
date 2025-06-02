import { MOTION_CONFIG } from './MotionConfig';

// Common animation variants used throughout the app
export const commonVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Slide animations
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },

  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },

  // Container animations for staggered children
  staggerContainer: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  },

  // Child items for staggered animations
  staggerItem: {
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
    exit: { opacity: 0, y: -20 },
  },
} as const;

// Common transition presets
export const commonTransitions = {
  default: {
    duration: MOTION_CONFIG.durations.normal,
    ease: MOTION_CONFIG.easing.easeOut,
  },
  spring: { type: 'spring' as const, ...MOTION_CONFIG.springs.stiff },
  slow: {
    duration: MOTION_CONFIG.durations.slow,
    ease: MOTION_CONFIG.easing.easeOut,
  },
  fast: {
    duration: MOTION_CONFIG.durations.fast,
    ease: MOTION_CONFIG.easing.easeOut,
  },
  bounce: { type: 'spring' as const, ...MOTION_CONFIG.springs.bouncy },
};

// Hover animations
export const hoverAnimations = {
  scale: { scale: 1.05 },
  lift: { scale: 1.02, y: -2 },
  glow: { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
  rotate: { rotate: 5 },
};

// Loading animations
export const loadingAnimations = {
  spin: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
  },
  pulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  bounce: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
  },
} as const;
