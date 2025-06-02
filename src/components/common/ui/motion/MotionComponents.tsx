import React from 'react';
import { motion, AnimatePresence, type HTMLMotionProps } from 'motion/react';
import {
  commonVariants,
  commonTransitions,
  hoverAnimations,
} from './MotionVariants';

// Base props interface for all motion components
interface BaseMotionProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children?: React.ReactNode;
  className?: string;
  variant?: keyof typeof commonVariants;
  hoverEffect?: keyof typeof hoverAnimations;
}

// Animated Container - for wrapping content with animations
export const AnimatedContainer: React.FC<BaseMotionProps> = ({
  children,
  className = '',
  variant = 'fadeIn',
  hoverEffect,
  ...props
}) => {
  const variantConfig = commonVariants[variant];
  const hoverConfig = hoverEffect ? hoverAnimations[hoverEffect] : undefined;

  return (
    <motion.div
      className={className}
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      exit={variantConfig.exit}
      whileHover={hoverConfig}
      transition={commonTransitions.default}
      {...props}
    >
      {children}
    </motion.div>
  );
};