import React from 'react';
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
    {title && <div className='skeleton h-8 w-48' />}
    {showStats && (
      <div className='bg-base-200 rounded-xl p-4 animate-pulse'>
        <div className='skeleton h-6 w-32 mb-4' />
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='text-center'>
              <div className='skeleton h-8 w-12 mx-auto mb-2' />
              <div className='skeleton h-3 w-16 mx-auto' />
            </div>
          ))}
        </div>
      </div>
    )}
    <div className='space-y-4'>
      {[...Array(LOADING_SKELETON_COUNTS[variant])].map((_, i) =>
        variant === 'minimal' ? (
          <div key={i} className='skeleton h-8 w-full rounded-lg' />
        ) : variant === 'compact' ? (
          <div key={i} className='bg-base-200 rounded-lg p-3 animate-pulse'>
            <div className='flex items-center gap-3'>
              <div className='skeleton h-4 w-8' />
              <div className='flex-1'>
                <div className='skeleton h-4 w-32 mb-1' />
                <div className='skeleton h-3 w-24' />
              </div>
              <div className='skeleton h-3 w-16' />
            </div>
          </div>
        ) : (
          <MatchCardSkeleton key={i} />
        )
      )}
    </div>
  </div>
);
