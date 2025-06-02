import React from 'react';
import { motion } from 'motion/react';
import { Search, RefreshCw } from 'lucide-react';

interface SearchAndControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const SearchAndControls: React.FC<SearchAndControlsProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className='flex flex-col sm:flex-row gap-4 items-center justify-between'
    >
      {/* Search Bar */}
      <div className='relative w-full sm:w-auto'>
        <motion.div className='relative'>
          <Search
            className='absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/60'
            size={20}
          />
          <input
            type='text'
            placeholder='Search champions...'
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className='input input-bordered input-primary w-full sm:w-80 pl-12 pr-4 shadow-lg
                       focus:ring-2 focus:ring-primary/20 transition-all duration-300
                       bg-base-100/80 backdrop-blur-sm'
          />
        </motion.div>
      </div>

      {/* Refresh Button */}
      <motion.button
        onClick={onRefresh}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
        className='btn btn-primary gap-2 shadow-lg'
      >
        <motion.div
          animate={{ rotate: isLoading ? 360 : 0 }}
          transition={{
            repeat: isLoading ? Infinity : 0,
            duration: 1,
            ease: 'linear',
          }}
        >
          <RefreshCw size={16} />
        </motion.div>
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </motion.button>
    </motion.div>
  );
};
