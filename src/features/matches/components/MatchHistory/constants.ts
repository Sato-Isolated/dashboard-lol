import { Variants } from 'framer-motion';

// Animation variants for smooth interactions
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const statsCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
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
