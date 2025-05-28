import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface LoadingStatesProps {
  loading?: boolean;
  error?: any;
  onRetry?: () => void;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex flex-col items-center justify-center py-16 space-y-4'
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw size={32} className='text-primary' />
        </motion.div>
        <p className='text-lg font-semibold text-base-content/80'>
          Loading champion statistics...
        </p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='space-y-6'
      >
        <div className='alert alert-error shadow-lg'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-current shrink-0 h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <div>
            <h3 className='font-bold'>Error Loading Champions</h3>
            <div className='text-xs opacity-80'>{error}</div>
          </div>
        </div>
        {onRetry && (
          <motion.button
            onClick={onRetry}
            whileTap={{ scale: 0.95 }}
            className='btn btn-warning gap-2 shadow-lg'
          >
            <RefreshCw size={16} />
            Clear Cache & Retry
          </motion.button>
        )}
      </motion.div>
    );
  }

  return null;
};

interface EmptyStateProps {
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-6'
    >
      <div className='alert alert-info shadow-lg'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          className='stroke-info shrink-0 w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          ></path>
        </svg>
        <div>
          <h3 className='font-bold'>No Champions Found</h3>
          <div className='text-xs opacity-80'>
            No champion statistics available for this summoner.
          </div>
        </div>
      </div>
      {onRetry && (
        <motion.button
          onClick={onRetry}
          whileTap={{ scale: 0.95 }}
          className='btn btn-warning gap-2 shadow-lg'
        >
          <RefreshCw size={16} />
          Clear Cache & Retry
        </motion.button>
      )}
    </motion.div>
  );
};

interface SearchEmptyStateProps {
  searchTerm: string;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  searchTerm,
}) => {
  if (!searchTerm) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='text-center py-12'
    >
      <div className='text-6xl mb-4'>🔍</div>
      <h3 className='text-xl font-bold text-base-content/80 mb-2'>
        No champions found
      </h3>
      <p className='text-base-content/60'>Try adjusting your search term</p>
    </motion.div>
  );
};
