import { Variants } from 'framer-motion';

export const headerContainerVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { delay: 0.1 } },
};

export const resultVariants: Variants = {
  initial: { scale: 0.9 },
  animate: { scale: 1 },
};

export const WIN_EMOJI = '🏆';
export const DEFEAT_EMOJI = '💀';
export const VICTORY_TEXT = 'Victory';
export const DEFEAT_TEXT = 'Defeat';
