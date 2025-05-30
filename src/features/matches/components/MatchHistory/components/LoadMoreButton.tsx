'use client';
import React from 'react';
import { motion } from 'motion/react';

interface LoadMoreButtonProps {
  loading: boolean;
  onLoadMore: () => void;
}

const LoadMoreButtonComponent: React.FC<LoadMoreButtonProps> = ({
  loading,
  onLoadMore,
}) => {
  return (
    <motion.button
      className='btn btn-sm btn-outline mt-4'
      onClick={onLoadMore}
      disabled={loading}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {loading ? (
        <>
          <motion.div
            className='w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2'
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          Loading...
        </>
      ) : (
        'Load More'
      )}
    </motion.button>
  );
};

// Memoize component to prevent unnecessary re-renders
const LoadMoreButton = React.memo(LoadMoreButtonComponent);
LoadMoreButton.displayName = 'LoadMoreButton';

export default LoadMoreButton;
