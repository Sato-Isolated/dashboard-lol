'use client';
import React from 'react';
import { motion } from 'framer-motion';
import SectionCard from '@/shared/components/ui/SectionCard';
import { MatchCardSkeleton } from '@/features/matches/components/MatchCard';
import {
  containerVariants,
  itemVariants,
  statsCardVariants,
} from '../constants';

const LoadingStateComponent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='flex flex-col gap-4'
    >
      {/* Enhanced Statistics Cards Skeleton */}
      <motion.div className='card bg-base-100/90 backdrop-blur-sm rounded-xl shadow border border-base-300/50 p-6'>
        <motion.div
          className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              variants={statsCardVariants}
              className='bg-gradient-to-r from-base-200/50 to-base-300/50 rounded-xl p-4 border border-base-300/50 animate-pulse'
            >
              <div className='flex items-center space-x-3'>
                <div className='w-5 h-5 bg-base-300 rounded'></div>
                <div className='space-y-2'>
                  <div className='h-3 bg-base-300 rounded w-16'></div>
                  <div className='h-5 bg-base-300 rounded w-12'></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Match List Skeleton */}
      <SectionCard title='Match History' loading={false} error={null}>
        <motion.div
          className='space-y-4'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} variants={itemVariants}>
              <MatchCardSkeleton />
            </motion.div>
          ))}
        </motion.div>
      </SectionCard>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const LoadingState = React.memo(LoadingStateComponent);
LoadingState.displayName = 'LoadingState';

export default LoadingState;
