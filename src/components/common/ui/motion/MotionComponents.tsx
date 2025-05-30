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

// Staggered List - for animating lists with staggered children
interface StaggeredListProps extends BaseMotionProps {
  staggerDelay?: number;
  items: React.ReactNode[];
  itemClassName?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  items,
  className = '',
  itemClassName = '',
  ...props
}) => {
  return (
    <motion.div
      className={className}
      variants={commonVariants.staggerContainer}
      initial='initial'
      animate='animate'
      exit='exit'
      {...props}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          variants={commonVariants.staggerItem}
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Animated Button - button with hover and tap animations
interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'variants'> {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  hoverEffect?: keyof typeof hoverAnimations;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = '',
  onClick,
  disabled = false,
  loading = false,
  hoverEffect = 'scale',
  ...props
}) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={
        disabled || loading ? undefined : hoverAnimations[hoverEffect]
      }
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      transition={commonTransitions.fast}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='w-4 h-4 border-2 border-current border-t-transparent rounded-full'
        />
      ) : (
        children
      )}
    </motion.button>
  );
};

// Fade Transition - for page/content transitions
interface FadeTransitionProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  children,
  show,
  className = '',
}) => {
  return (
    <AnimatePresence mode='wait'>
      {show && (
        <motion.div
          key='content'
          className={className}
          variants={commonVariants.fadeIn}
          initial='initial'
          animate='animate'
          exit='exit'
          transition={commonTransitions.default}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

// Animated Card - card with hover effects
interface AnimatedCardProps extends BaseMotionProps {
  hover?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  hover = true,
  variant = 'slideUp',
  hoverEffect = 'lift',
  ...props
}) => {
  const variantConfig = commonVariants[variant];

  return (
    <motion.div
      className={className}
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      exit={variantConfig.exit}
      whileHover={hover ? hoverAnimations[hoverEffect] : undefined}
      transition={commonTransitions.spring}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Modal/Overlay animations
interface AnimatedModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  overlayClassName?: string;
  contentClassName?: string;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  children,
  isOpen,
  onClose,
  overlayClassName = '',
  contentClassName = '',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${overlayClassName}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={contentClassName}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={commonTransitions.spring}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
