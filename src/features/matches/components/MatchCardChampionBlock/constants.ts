import { Variants } from 'motion/react';

export const CHAMPION_LEVEL = 18;
export const ITEMS_COUNT = 6;

export const championBlockVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.5 } },
};

export const championAvatarVariants: Variants = {
  initial: { scale: 0.8, rotate: -10 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

export const levelBadgeVariants: Variants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: { delay: 0.4, type: 'spring', stiffness: 400 },
  },
};

export const spellsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const spellVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  show: { scale: 1, rotate: 0 },
};

export const runesContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delay: 0.2,
    },
  },
};

export const runeVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1 },
};

export const itemsGridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delay: 0.4,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1 },
};

export const emptyItemVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 0.6 },
};
