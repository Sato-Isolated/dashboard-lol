// Motion configuration and settings
export const MOTION_CONFIG = {
  // Global settings
  reducedMotion: false,

  // Default durations
  durations: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.6,
  },

  // Default easing
  easing: {
    easeOut: 'easeOut',
    easeIn: 'easeIn',
    easeInOut: 'easeInOut',
    linear: 'linear',
  },

  // Spring configurations
  springs: {
    gentle: { stiffness: 120, damping: 14 },
    wobbly: { stiffness: 180, damping: 12 },
    stiff: { stiffness: 300, damping: 25 },
    bouncy: { stiffness: 400, damping: 15 },
  },

  // Stagger settings
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.2,
  },

  // Common distances for animations
  distances: {
    small: 10,
    medium: 20,
    large: 50,
  },
} as const;

// Function to check if user prefers reduced motion
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};