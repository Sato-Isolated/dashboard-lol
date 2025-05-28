// Add CSS styles
export const CHAMPION_CARD_STYLES = `
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
`;

export const AVATAR_SIZES = {
  small: { width: 48, height: 48, className: 'w-12 h-12' },
  medium: { width: 64, height: 64, className: 'w-16 h-16' },
  large: { width: 96, height: 96, className: 'w-24 h-24' },
} as const;

export const BORDER_CLASSES = {
  small: 'border-2 border-primary/30',
  medium: 'border-2 border-primary/30 shadow',
  large: 'border-4 border-primary shadow-lg',
} as const;

export const ROUNDED_CLASSES = {
  small: 'rounded-lg',
  medium: 'rounded-xl',
  large: 'rounded-xl',
} as const;

export const MAX_TAGS_BY_VARIANT = {
  compact: 0,
  default: 2,
  detailed: 10,
} as const;

// Animation variants for framer-motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};
