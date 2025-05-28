'use client';
import React from 'react';
import { motion } from 'framer-motion';
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
        <div className='skeleton h-6 w-20 mb-3 rounded-full' />
        <div className='skeleton h-4 w-16 mb-2' />
        <div className='skeleton h-5 w-18 mb-2 rounded-full' />
        <div className='skeleton h-4 w-14' />
      </div>

      {/* Champion Section Skeleton */}
      <div className='flex flex-row items-center gap-4 px-6 flex-1'>
        <div className='relative'>
          {/* Champion avatar */}
          <div className='skeleton w-20 h-20 rounded-3xl shadow-xl' />
          <div className='absolute -bottom-2 -right-2 skeleton w-8 h-6 rounded-full' />
        </div>

        <div className='flex flex-col gap-2'>
          {/* Spells */}
          <div className='flex gap-2'>
            <div className='skeleton w-9 h-9 rounded-lg' />
            <div className='skeleton w-9 h-9 rounded-lg' />
          </div>
          {/* Runes */}
          <div className='flex gap-2'>
            <div className='skeleton w-9 h-9 rounded-full' />
            <div className='skeleton w-9 h-9 rounded-full' />
          </div>
          {/* Items */}
          <div className='flex gap-1'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='skeleton w-8 h-8 rounded-lg' />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className='flex flex-col items-center justify-center min-w-[160px] px-4'>
        {/* KDA */}
        <div className='flex items-center gap-3 mb-3'>
          <div className='skeleton h-8 w-10' />
          <div className='skeleton h-6 w-3' />
          <div className='skeleton h-8 w-10' />
          <div className='skeleton h-6 w-3' />
          <div className='skeleton h-8 w-10' />
        </div>

        {/* KDA Ratio */}
        <div className='skeleton h-6 w-24 mb-3 rounded-full' />

        {/* P/Kill */}
        <div className='skeleton h-5 w-20 mb-3 rounded-full' />

        {/* Badges */}
        <div className='flex gap-2 flex-wrap justify-center'>
          <div className='skeleton h-8 w-24 rounded-full' />
          <div className='skeleton h-8 w-20 rounded-full' />
        </div>
      </div>
    </div>
  </motion.div>
);

export default React.memo(MatchCardSkeleton);
