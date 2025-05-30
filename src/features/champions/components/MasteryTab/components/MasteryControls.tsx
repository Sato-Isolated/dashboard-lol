import React from 'react';
import { motion } from 'motion/react';
import { Search, Grid3X3, List, Target, Star, BarChart3 } from 'lucide-react';
import type { ViewMode, SortOption } from '../masteryTabTypes';

interface MasteryControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: ViewMode;
  sortBy: SortOption;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (option: SortOption) => void;
}

export const MasteryControls: React.FC<MasteryControlsProps> = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  sortBy,
  onViewModeChange,
  onSortChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-6 bg-base-100/80 backdrop-blur-sm border border-base-300/50 rounded-2xl shadow-xl'
    >
      {/* Search */}
      <div className='flex-1 max-w-md'>
        <div className='relative'>
          <motion.div
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40'
            animate={{
              scale: searchTerm ? [1, 1.2, 1] : 1,
              color: searchTerm
                ? 'rgb(var(--primary))'
                : 'rgb(var(--base-content) / 0.4)',
            }}
            transition={{ duration: 0.2 }}
          >
            <Search size={20} />
          </motion.div>
          <input
            type='text'
            placeholder='Search champions...'
            className='input input-bordered w-full pl-12 pr-4 bg-base-200/50 border-base-300/50 focus:border-primary/50 focus:bg-base-100 transition-all duration-300'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* View mode toggle */}
      <div className='flex items-center gap-2 bg-base-200/50 rounded-xl p-1'>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`btn btn-sm gap-2 ${
            viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'
          }`}
          onClick={() => onViewModeChange('grid')}
        >
          <Grid3X3 size={16} />
          <span className='hidden sm:inline'>Grid</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`btn btn-sm gap-2 ${
            viewMode === 'list' ? 'btn-primary' : 'btn-ghost'
          }`}
          onClick={() => onViewModeChange('list')}
        >
          <List size={16} />
          <span className='hidden sm:inline'>List</span>
        </motion.button>
      </div>

      {/* Sort options */}
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium text-base-content/70'>
          Sort by:
        </span>
        <div className='flex items-center gap-1 bg-base-200/50 rounded-xl p-1'>
          {(['points', 'level', 'name'] as SortOption[]).map(option => (
            <motion.button
              key={option}
              whileTap={{ scale: 0.95 }}
              className={`btn btn-xs gap-1 ${
                sortBy === option ? 'btn-primary' : 'btn-ghost'
              }`}
              onClick={() => onSortChange(option)}
            >
              {option === 'points' && <Target size={12} />}
              {option === 'level' && <Star size={12} />}
              {option === 'name' && <BarChart3 size={12} />}
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
