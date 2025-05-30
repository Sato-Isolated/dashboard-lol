'use client';
import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  /**
   * Loading text to display
   */
  message?: string;
  /**
   * Show a spinner animation
   */
  showSpinner?: boolean;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether to show full height container
   */
  fullHeight?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom spinner icon
   */
  icon?: React.ReactNode;
}

const sizeConfig = {
  sm: {
    container: 'py-8',
    icon: 'w-6 h-6',
    text: 'text-sm',
  },
  md: {
    container: 'py-12',
    icon: 'w-8 h-8',
    text: 'text-base',
  },
  lg: {
    container: 'py-16',
    icon: 'w-12 h-12',
    text: 'text-lg',
  },
};

/**
 * Shared loading state component with consistent styling
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  showSpinner = true,
  size = 'md',
  fullHeight = false,
  className = '',
  icon,
}) => {
  const config = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        flex flex-col items-center justify-center space-y-4
        ${config.container}
        ${fullHeight ? 'min-h-[400px]' : ''}
        ${className}
      `}
    >
      {showSpinner && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className={config.icon}
        >
          {icon || <RefreshCw className={`${config.icon} text-primary`} />}
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`font-semibold text-base-content/80 ${config.text}`}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default LoadingState;
