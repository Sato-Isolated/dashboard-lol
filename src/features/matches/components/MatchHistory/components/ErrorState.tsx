'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorStateComponent: React.FC<ErrorStateProps> = ({
  errorMessage,
  onRetry,
}) => {
  return (
    <motion.div
      key='error'
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className='flex flex-col items-center justify-center py-12 space-y-4'
    >
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
      >
        <AlertCircle className='w-16 h-16 text-error' />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='text-lg font-semibold text-error'
      >
        Failed to load match history
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='text-base-content/70 text-center'
      >
        {errorMessage}
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className='btn btn-primary'
      >
        <RotateCcw className='w-4 h-4 mr-2' />
        Try Again
      </motion.button>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const ErrorState = React.memo(ErrorStateComponent);
ErrorState.displayName = 'ErrorState';

export default ErrorState;
