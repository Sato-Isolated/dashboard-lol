import React from 'react';
import { motion } from 'motion/react';
import type { BuildTabProps } from '../matchCardTabsTypes';

const BuildTabComponent: React.FC<BuildTabProps> = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='p-6'
    >
      <div className='flex items-center gap-3 mb-6'>
        <span className='text-2xl'>⚔️</span>
        <h3 className='text-xl font-bold text-base-content'>Build Analysis</h3>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='alert bg-gradient-to-r from-info/20 to-info/10 border border-info/30 shadow-lg'
      >
        <svg
          className='w-6 h-6 stroke-current stroke-2'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <div>
          <h3 className='font-bold'>Coming Soon!</h3>
          <div className='text-xs'>
            Detailed build analysis, runes breakdown, and spell usage statistics
            will be available in the next update.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const BuildTab = React.memo(BuildTabComponent);
BuildTab.displayName = 'BuildTab';

export default BuildTab;
