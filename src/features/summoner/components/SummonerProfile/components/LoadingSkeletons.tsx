import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../constants';

export const LoadingSkeletons: React.FC = () => {
  return (
    <>
      {/* Rank & Badges Loading Skeleton */}
      <motion.div
        variants={cardVariants}
        className='card bg-gradient-to-br from-primary/5 to-accent/5 
                   rounded-2xl shadow-2xl border border-primary/20 overflow-hidden'
      >
        <div className='card-body p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className='w-6 h-6 border-2 border-primary border-t-transparent rounded-full'
            />
            <div className='skeleton h-6 w-32' />
          </div>
          <div className='flex flex-col gap-3'>
            <div className='skeleton h-16 w-full rounded-xl' />
            <div className='skeleton h-12 w-3/4 rounded-lg' />
          </div>
        </div>
      </motion.div>

      {/* Recently Played Loading Skeleton */}
      <motion.div
        variants={cardVariants}
        className='card bg-gradient-to-br from-accent/5 to-info/5 
                   rounded-2xl shadow-2xl border border-accent/20 overflow-hidden'
      >
        <div className='card-body p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className='w-6 h-6 border-2 border-accent border-t-transparent rounded-full'
            />
            <div className='skeleton h-6 w-40' />
          </div>
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='flex items-center gap-4'>
                <div className='skeleton h-4 w-24' />
                <div className='skeleton h-6 w-12 rounded-full' />
                <div className='skeleton h-6 w-16 rounded-full' />
                <div className='skeleton h-4 w-20' />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};
