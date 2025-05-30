'use client';
import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { getSizeConfig } from '@/lib/design/tokens';
import type { StateComponentProps } from '@/types/coreTypes';

interface LoadingStateProps extends StateComponentProps {
  /**
   * Loading text to display
   */
  message?: string;
  /**
   * Show a spinner animation
   */
  showSpinner?: boolean;
  /**
   * Custom spinner icon
   */
  icon?: React.ReactNode;
}

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
  const config = getSizeConfig('loading', size);

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
