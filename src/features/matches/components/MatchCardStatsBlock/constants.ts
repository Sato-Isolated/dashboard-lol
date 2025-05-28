import { Variants } from 'framer-motion';

export const statsBlockVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.5 } },
};

export const kdaDisplayVariants: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { delay: 0.4, type: 'spring', stiffness: 300 },
  },
};

export const kdaRatioVariants: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { delay: 0.5 } },
};

export const participationVariants: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { delay: 0.6 } },
};

export const badgeVariants = (index: number): Variants => ({
  initial: { opacity: 0, scale: 0, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.5 + index * 0.1,
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
});
