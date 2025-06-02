// Main MatchCard exports
export { default } from './MatchCard';

// Export skeleton component
export { default as MatchCardSkeleton } from './components/MatchCardSkeleton';

// Export types
export type {
  MatchCardProps,
  MatchCardState,
  CalculatedMatchData,
  PlayerBadge,
  AnimatedBackgroundEffectsProps,
  ResultBadgeProps,
  ExpandCollapseButtonProps,
  CollapsibleContentProps,
} from './matchCardTypes';

// Export hooks
export { useMatchCardState, useMatchCalculations } from './hooks';

// Export individual components (for potential reuse)
export {
  AnimatedBackgroundEffects,
  ExpandCollapseButton,
  CollapsibleContent,
} from './components';

// Export utilities
export {
  calculateTeams,
  calculateKDA,
  calculatePlayerBadges,
  findMainPlayer,
  getMatchResultStyles,
  isMatchWin,
} from './utils';

// Export constants
export {
  cardVariants,
  backgroundEffectVariants,
  badgeVariants,
  expandButtonVariants,
  collapsibleContentVariants,
  innerContentVariants,
  skeletonBackgroundVariants,
  cardStyles,
  badgeStyles,
  PLAYER_BADGES,
} from './constants';
