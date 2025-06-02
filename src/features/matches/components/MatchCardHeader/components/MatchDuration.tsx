import React from 'react';
import type { MatchDurationProps } from '../matchCardHeaderTypes';

const MatchDuration: React.FC<MatchDurationProps> = ({ duration }) => {
  return (
    <div className='flex items-center justify-center gap-2 text-xs text-base-content/70 font-mono'>
      <svg
        className='w-4 h-4'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <circle cx='12' cy='12' r='10' />
        <polyline points='12,6 12,12 16,14' />
      </svg>
      {duration}
    </div>
  );
};

export default React.memo(MatchDuration);
