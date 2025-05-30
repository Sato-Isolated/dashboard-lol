import React from 'react';
import type { MatchItemProps } from '../matchListTypes';

export const CompactMatchItem: React.FC<MatchItemProps> = ({
  match,
  index = 0,
}) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-lg ${
      match.result === 'Win'
        ? 'bg-success/10 border-l-4 border-success'
        : 'bg-error/10 border-l-4 border-error'
    }`}
  >
    <div className='text-sm text-base-content/60'>#{index + 1}</div>
    <div className='flex-1'>
      <div className='flex items-center gap-2'>
        <span className='font-semibold text-base-content'>
          {match.champion}
        </span>
        <span
          className={`text-sm font-medium ${
            match.result === 'Win' ? 'text-success' : 'text-error'
          }`}
        >
          {match.result}
        </span>
      </div>
      <div className='text-xs text-base-content/60'>
        {match.kda} • {match.mode} • {match.duration}
      </div>
    </div>
    <div className='text-xs text-base-content/50'>{match.date}</div>
  </div>
);
