import React from 'react';
import { Skeleton } from '@/components/common/ui/states';
import { MatchCardSkeleton } from '@/features/matches/components/MatchCard';
import { LOADING_SKELETON_COUNTS } from '../constants';

interface LoadingStateProps {
  variant: 'default' | 'compact' | 'minimal';
  showStats: boolean;
  title?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant,
  showStats,
  title,
  className = '',
}) => (
  <div className={`space-y-4 ${className}`}>
    {title && <Skeleton variant='text' width='12rem' height='2rem' />}
    {showStats && (
      <div className='bg-base-200 rounded-xl p-4 animate-pulse'>
        <Skeleton
          variant='text'
          width='8rem'
          height='1.5rem'
          className='mb-4'
        />
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='text-center'>
              <Skeleton
                variant='text'
                width='3rem'
                height='2rem'
                className='mx-auto mb-2'
              />
              <Skeleton
                variant='text'
                width='4rem'
                height='0.75rem'
                className='mx-auto'
              />
            </div>
          ))}
        </div>
      </div>
    )}
    <div className='space-y-4'>
      {[...Array(LOADING_SKELETON_COUNTS[variant])].map((_, i) =>
        variant === 'minimal' ? (
          <Skeleton key={i} variant='rounded' height='2rem' />
        ) : variant === 'compact' ? (
          <div key={i} className='bg-base-200 rounded-lg p-3 animate-pulse'>
            <div className='flex items-center gap-3'>
              <Skeleton variant='text' width='2rem' height='1rem' />
              <div className='flex-1'>
                <Skeleton
                  variant='text'
                  width='8rem'
                  height='1rem'
                  className='mb-1'
                />
                <Skeleton variant='text' width='6rem' height='0.75rem' />
              </div>
              <Skeleton variant='text' width='4rem' height='0.75rem' />
            </div>
          </div>
        ) : (
          <MatchCardSkeleton key={i} />
        ),
      )}
    </div>
  </div>
);
