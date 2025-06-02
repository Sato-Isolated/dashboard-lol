import React from 'react';
import type { MatchItemProps } from '../matchListTypes';

export const MinimalMatchItem: React.FC<MatchItemProps> = ({ match }) => (
  <div className='flex items-center justify-between p-2 rounded-lg transition-colors'>
    <div className='flex items-center gap-2'>
      <div
        className={`w-2 h-2 rounded-full ${
          match.result === 'Win' ? 'bg-success' : 'bg-error'
        }`}
      />
      <span className='text-sm font-medium text-base-content'>
        {match.champion}
      </span>
      <span className='text-xs text-base-content/60'>{match.kda}</span>
    </div>
    <span className='text-xs text-base-content/50'>{match.date}</span>
  </div>
);
