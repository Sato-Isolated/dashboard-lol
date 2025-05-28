import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='flex flex-col items-center justify-center py-16 space-y-6'
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
        }}
        className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full'
      />
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='text-center space-y-2'
      >
        <h3 className='text-xl font-bold text-primary flex items-center gap-2'>
          <Trophy className='animate-bounce' />
          Loading Mastery Data
        </h3>
        <p className='text-base-content/60'>
          Fetching your champion mastery progression...
        </p>
      </motion.div>
    </motion.div>
  );
};

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className='flex flex-col items-center justify-center py-16 space-y-6'
    >
      <div className='text-center space-y-4'>
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className='text-6xl text-error'
        >
          ⚠️
        </motion.div>
        <h3 className='text-2xl font-bold text-error'>
          Failed to Load Mastery Data
        </h3>
        <p className='text-base-content/60 max-w-md'>{error}</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className='btn btn-error btn-outline gap-2'
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={16} />
          Try Again
        </motion.button>
      </div>
    </motion.div>
  );
};

export const NoDataState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col items-center justify-center py-16 space-y-6'
    >
      <div className='text-center space-y-4'>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='text-6xl'
        >
          🎯
        </motion.div>
        <h3 className='text-2xl font-bold text-base-content'>
          No Mastery Data Found
        </h3>
        <p className='text-base-content/60 max-w-md'>
          Start playing champions to build your mastery collection!
        </p>
      </div>
    </motion.div>
  );
};

interface EmptySearchStateProps {
  onClearSearch: () => void;
}

export const EmptySearchState: React.FC<EmptySearchStateProps> = ({ onClearSearch }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col items-center justify-center py-16 space-y-4'
    >
      <div className='text-4xl'>🔍</div>
      <h3 className='text-xl font-bold text-base-content'>
        No champions found
      </h3>
      <p className='text-base-content/60'>
        Try adjusting your search term or clear the filter
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        className='btn btn-primary btn-outline gap-2'
        onClick={onClearSearch}
      >
        Clear search
      </motion.button>
    </motion.div>
  );
};
