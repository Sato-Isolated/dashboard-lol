// Animation variants for framer-motion
export const formVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, type: 'spring', stiffness: 100 },
};

export const inputContainerVariants = {
  whileFocus: { scale: 1.01 },
};

export const inputVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const separatorVariants = {
  initial: { scaleY: 0 },
  animate: { scaleY: 1 },
};

export const buttonVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  whileTap: { scale: 0.95 },
  transition: {
    delay: 0.7,
    type: 'spring',
    stiffness: 400,
    damping: 15,
  },
};

export const suggestionListVariants = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const suggestionItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

export const errorMessageVariants = {
  initial: { opacity: 0, y: -10, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.9 },
};

export const iconRotationVariants = {
  animate: { rotate: [0, 5, -5, 0] },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};
