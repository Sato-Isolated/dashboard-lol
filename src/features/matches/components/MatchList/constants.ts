export const DEFAULT_ITEMS_PER_PAGE = 10;

export const LOADING_SKELETON_COUNTS = {
  minimal: 5,
  compact: 3,
  default: 3,
} as const;

export const EMPTY_STATE_CONFIG = {
  icon: '🎮',
  title: 'No Matches',
  defaultMessage: 'No matches found',
} as const;

export const ERROR_STATE_CONFIG = {
  icon: '⚠️',
  title: 'Error Loading Matches',
} as const;
