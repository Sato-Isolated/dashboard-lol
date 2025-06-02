// Animation variants and constants for MatchCard components
import { Variants } from 'motion/react';
import { createBackgroundAnimation } from '@/components/common/ui/motion/MotionUtilities';

export const cardVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

export const backgroundEffectVariants = {
  winBlob: createBackgroundAnimation(8),
  lossBlob: {
    animate: {
      scale: [1.2, 1, 1.2],
      opacity: [0.2, 0.5, 0.2],
      rotate: [0, -90, 0],
    },
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 2,
    },
  },
};

export const badgeVariants: Variants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { delay: 0.3, type: 'spring', stiffness: 300 },
  },
};

export const expandButtonVariants = {
  tap: { scale: 0.9 },
  iconRotate: (open: boolean) => ({
    rotate: open ? 180 : 0,
    transition: { duration: 0.4, type: 'spring', stiffness: 300 },
  }),
};

export const collapsibleContentVariants: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.5,
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.5,
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

export const innerContentVariants: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1 },
  },
  exit: {
    y: -20,
    opacity: 0,
  },
};

export const skeletonBackgroundVariants = {
  blob1: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  blob2: {
    animate: {
      scale: [1.2, 1, 1.2],
      opacity: [0.2, 0.5, 0.2],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 1,
    },
  },
  shimmer: {
    animate: {
      x: ['-100%', '100%'],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
      repeatDelay: 1,
    },
  },
};

// Style constants
export const cardStyles = {
  win: {
    background:
      'bg-gradient-to-br from-success/15 via-base-100/95 to-success/10',
    border: 'border-success/30',
    ring: 'ring-success/40',
  },
  loss: {
    background: 'bg-gradient-to-br from-error/15 via-base-100/95 to-error/10',
    border: 'border-error/30',
    ring: 'ring-error/40',
  },
};

export const badgeStyles = {
  win: {
    background: 'bg-success/30',
    text: 'text-success',
    border: 'border border-success/50',
    shadow: 'shadow-success/30',
  },
  loss: {
    background: 'bg-error/30',
    text: 'text-error',
    border: 'border border-error/50',
    shadow: 'shadow-error/30',
  },
};

// Badge configurations for different achievements
export const PLAYER_BADGES = {
  PENTA_KILL: {
    label: 'Penta Kill',
    color: 'from-fuchsia-600 to-pink-600',
    icon: '👑',
    priority: 1,
  },
  QUADRA_KILL: {
    label: 'Quadra Kill',
    color: 'from-pink-500 to-red-500',
    icon: '🔥',
    priority: 2,
  },
  TRIPLE_KILL: {
    label: 'Triple Kill',
    color: 'from-cyan-500 to-blue-500',
    icon: '💥',
    priority: 3,
  },
  DOUBLE_KILL: {
    label: 'Double Kill',
    color: 'from-sky-400 to-blue-400',
    icon: '⚡',
    priority: 4,
  },
  MVP: {
    label: 'MVP',
    color: 'from-yellow-400 to-orange-400',
    icon: '⭐',
    priority: 5,
  },
  UNSTOPPABLE: {
    label: 'Unstoppable',
    color: 'from-green-400 to-emerald-600',
    icon: '💪',
    priority: 6,
  },
} as const;
