'use client';
import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';
import { getSizeConfig } from '@/lib/design/tokens';
import type { StateComponentProps } from '@/types/coreTypes';

interface ErrorStateProps extends StateComponentProps {
  /**
   * Error message to display
   */
  error: string | Error;
  /**
   * Callback when retry button is clicked
   */
  onRetry?: () => void;
  /**
   * Callback when dismiss button is clicked
   */
  onDismiss?: () => void;
  /**
   * Error title
   */
  title?: string;
  /**
   * Custom error icon
   */
  icon?: React.ReactNode;
  /**
   * Retry button text
   */
  retryText?: string;
  /**
   * Whether the retry button is loading
   */
  retryLoading?: boolean;
}

/**
 * Shared error state component with consistent styling and retry functionality
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onDismiss,
  title = 'Something went wrong',
  size = 'md',
  fullHeight = false,
  className = '',
  icon,
  retryText = 'Try Again',
  retryLoading = false,
}) => {
  const config = getSizeConfig('error', size);
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex flex-col items-center justify-center space-y-4 text-center
        ${config.container}
        ${fullHeight ? 'min-h-[400px]' : ''}
        ${className}
      `}
    >
      {/* Error Icon */}
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className={config.icon}
      >
        {icon || <AlertCircle className={`${config.icon} text-error`} />}
      </motion.div>

      {/* Error Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`font-bold text-error ${config.title}`}
      >
        {title}
      </motion.h3>

      {/* Error Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`text-base-content/70 max-w-md ${config.message}`}
      >
        {errorMessage}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='flex gap-3 flex-wrap justify-center'
      >
        {onRetry && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            disabled={retryLoading}
            className={`btn btn-error ${config.button} gap-2`}
          >
            <RotateCcw
              className={`w-4 h-4 ${retryLoading ? 'animate-spin' : ''}`}
            />
            {retryLoading ? 'Retrying...' : retryText}
          </motion.button>
        )}

        {onDismiss && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onDismiss}
            className={`btn btn-ghost ${config.button} gap-2`}
          >
            <X className='w-4 h-4' />
            Dismiss
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ErrorState;
