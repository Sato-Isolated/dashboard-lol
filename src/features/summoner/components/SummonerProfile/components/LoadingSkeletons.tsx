import React from 'react';
import { motion } from 'motion/react';
import { Skeleton } from '@/components/common/ui/states';
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
            <Skeleton variant='text' width='8rem' height='1.5rem' />
          </div>
          <div className='flex flex-col gap-3'>
            <Skeleton variant='rounded' width='100%' height='4rem' />
            <Skeleton variant='rounded' width='75%' height='3rem' />
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
            <Skeleton variant='text' width='10rem' height='1.5rem' />
          </div>
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='flex items-center gap-4'>
                <Skeleton variant='text' width='6rem' height='1rem' />
                <Skeleton variant='rounded' width='3rem' height='1.5rem' />
                <Skeleton variant='rounded' width='4rem' height='1.5rem' />
                <Skeleton variant='text' width='5rem' height='1rem' />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};
