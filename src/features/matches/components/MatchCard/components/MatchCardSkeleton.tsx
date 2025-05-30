'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Skeleton } from '@/components/common/ui/states';
import { skeletonBackgroundVariants } from '../constants';

const MatchCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className='relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-base-200/90 to-base-100/80 border-2 border-primary/20 shadow-2xl rounded-3xl mb-6 transition-all duration-300 pb-6'
  >
    {/* Background animated effects */}
    <div className='absolute inset-0 pointer-events-none overflow-hidden'>
      <motion.div
        className='absolute -top-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl'
        {...skeletonBackgroundVariants.blob1}
      />
      <motion.div
        className='absolute -bottom-20 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl'
        {...skeletonBackgroundVariants.blob2}
      />
    </div>

    {/* Shimmer overlay */}
    <motion.div
      className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12'
      {...skeletonBackgroundVariants.shimmer}
    />

    <div className='relative flex flex-col lg:flex-row items-stretch gap-0 w-full px-4 lg:px-6 pt-6 pb-4 z-10'>
      {/* Header Section Skeleton */}
      <div className='flex flex-col justify-center min-w-[140px] max-w-[180px] p-4 rounded-2xl bg-base-200/60 backdrop-blur-sm border border-base-content/10'>
        <Skeleton
          variant='text'
          width='5rem'
          height='1.5rem'
          className='mb-3'
        />
        <Skeleton variant='text' width='4rem' height='1rem' className='mb-2' />
        <Skeleton
          variant='rounded'
          width='4.5rem'
          height='1.25rem'
          className='mb-2'
        />
        <Skeleton variant='text' width='3.5rem' height='1rem' />
      </div>
      {/* Champion Section Skeleton */}
      <div className='flex flex-row items-center gap-4 px-6 flex-1'>
        <div className='relative'>
          {/* Champion avatar */}
          <Skeleton
            variant='rounded'
            width='5rem'
            height='5rem'
            className='shadow-xl'
          />
          <div className='absolute -bottom-2 -right-2'>
            <Skeleton variant='rounded' width='2rem' height='1.5rem' />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          {/* Spells */}
          <div className='flex gap-2'>
            <Skeleton variant='rounded' width='2.25rem' height='2.25rem' />
            <Skeleton variant='rounded' width='2.25rem' height='2.25rem' />
          </div>
          {/* Runes */}
          <div className='flex gap-2'>
            <Skeleton variant='circle' width='2.25rem' height='2.25rem' />
            <Skeleton variant='circle' width='2.25rem' height='2.25rem' />
          </div>
          {/* Items */}
          <div className='flex gap-1'>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant='rounded' width='2rem' height='2rem' />
            ))}
          </div>
        </div>
      </div>
      {/* Stats Section Skeleton */}
      <div className='flex flex-col items-center justify-center min-w-[160px] px-4'>
        {/* KDA */}
        <div className='flex items-center gap-3 mb-3'>
          <Skeleton variant='text' width='2.5rem' height='2rem' />
          <Skeleton variant='text' width='0.75rem' height='1.5rem' />
          <Skeleton variant='text' width='2.5rem' height='2rem' />
          <Skeleton variant='text' width='0.75rem' height='1.5rem' />
          <Skeleton variant='text' width='2.5rem' height='2rem' />
        </div>

        {/* KDA Ratio */}
        <Skeleton
          variant='rounded'
          width='6rem'
          height='1.5rem'
          className='mb-3'
        />

        {/* P/Kill */}
        <Skeleton
          variant='rounded'
          width='5rem'
          height='1.25rem'
          className='mb-3'
        />

        {/* Badges */}
        <div className='flex gap-2 flex-wrap justify-center'>
          <Skeleton variant='rounded' width='6rem' height='2rem' />
          <Skeleton variant='rounded' width='5rem' height='2rem' />
        </div>
      </div>
    </div>
  </motion.div>
);

export default React.memo(MatchCardSkeleton);
