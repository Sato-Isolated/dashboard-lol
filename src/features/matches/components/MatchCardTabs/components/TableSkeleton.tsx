import React from 'react';
import { motion } from 'framer-motion';

const TableSkeletonComponent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='animate-pulse space-y-4'
    >
      <div className='h-8 bg-gradient-to-r from-base-300 to-base-200 rounded-lg shimmer' />
      <div className='space-y-3'>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className='h-12 bg-gradient-to-r from-base-200 to-base-100 rounded-lg shimmer'
          />
        ))}
      </div>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const TableSkeleton = React.memo(TableSkeletonComponent);
TableSkeleton.displayName = 'TableSkeleton';

export default TableSkeleton;
