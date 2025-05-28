import { Variants } from 'framer-motion';
import type { UIRecentlyPlayed } from '@/shared/types/ui-leftcolumn';

// Animation variants
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

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.4,
    },
  },
};

export const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

// Utility functions
/**
 * Calculate if a player has good performance based on games played and winrate
 */
export const isGoodPerformance = (player: UIRecentlyPlayed): boolean => {
  return player.games >= 3 && player.winrate >= 50;
};

/**
 * Check if winrate is considered high
 */
export const isHighWinrate = (winrate: number): boolean => {
  return winrate >= 60;
};

/**
 * Get winrate category for styling
 */
export const getWinrateCategory = (
  winrate: number
): 'high' | 'medium' | 'low' => {
  if (winrate >= 60) return 'high';
  if (winrate >= 45) return 'medium';
  return 'low';
};

/**
 * Get games category for styling
 */
export const getGamesCategory = (games: number): 'many' | 'some' | 'few' => {
  if (games >= 5) return 'many';
  if (games >= 3) return 'some';
  return 'few';
};

/**
 * Calculate average winrate from an array of players
 */
export const calculateAverageWinrate = (
  players: UIRecentlyPlayed[]
): number => {
  if (players.length === 0) return 0;
  return Math.round(
    players.reduce((acc, p) => acc + p.winrate, 0) / players.length
  );
};
