import React from 'react';

interface ChampionCardSkeletonProps {
  variant?: 'compact' | 'default' | 'detailed';
}

export const ChampionCardSkeleton: React.FC<ChampionCardSkeletonProps> = ({
  variant = 'default',
}) => {
  if (variant === 'compact') {
    return (
      <div className='card bg-base-200 rounded-xl shadow p-3 animate-pulse'>
        <div className='flex items-center gap-3'>
          <div className='skeleton w-12 h-12 rounded-lg' />
          <div className='flex-1'>
            <div className='skeleton h-4 w-20 mb-1' />
            <div className='skeleton h-3 w-16' />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className='card bg-base-200 rounded-xl shadow-xl p-6 animate-pulse'>
        <div className='flex flex-col items-center gap-4'>
          <div className='skeleton w-24 h-24 rounded-xl' />
          <div className='text-center'>
            <div className='skeleton h-6 w-32 mb-2' />
            <div className='skeleton h-4 w-40 mb-4' />
          </div>
          <div className='flex gap-2'>
            <div className='skeleton h-6 w-16 rounded-full' />
            <div className='skeleton h-6 w-16 rounded-full' />
          </div>
          <div className='w-full space-y-2'>
            <div className='skeleton h-10 w-full rounded-lg' />
            <div className='skeleton h-10 w-full rounded-lg' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='card bg-base-200 rounded-xl shadow p-4 animate-pulse'>
      <div className='flex items-center gap-4'>
        <div className='skeleton w-16 h-16 rounded-xl' />
        <div className='flex-1'>
          <div className='skeleton h-5 w-24 mb-2' />
          <div className='skeleton h-4 w-32 mb-3' />
          <div className='flex gap-2'>
            <div className='skeleton h-6 w-16 rounded-full' />
            <div className='skeleton h-6 w-16 rounded-full' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChampionCardSkeleton);
