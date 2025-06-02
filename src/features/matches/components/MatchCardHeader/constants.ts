import {
  createSlideAnimation,
  createScaleAnimation,
} from '@/components/common/ui/motion/MotionUtilities';

// Use centralized motion utilities
export const headerContainerVariants = createSlideAnimation('right', 20);
export const resultVariants = createScaleAnimation(0.9, 1);

export const WIN_EMOJI = '🏆';
export const DEFEAT_EMOJI = '💀';
export const VICTORY_TEXT = 'Victory';
export const DEFEAT_TEXT = 'Defeat';
