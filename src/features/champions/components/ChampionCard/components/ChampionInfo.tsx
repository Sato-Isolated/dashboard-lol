import React from 'react';
import { formatNumber } from '../utils';
import type { ChampionInfoProps } from '../types';

const ChampionInfo: React.FC<ChampionInfoProps> = ({
  championData,
  variant,
  mastery,
  showMastery,
}) => {
  if (variant === 'compact') {
    return (
      <div className='flex-1 min-w-0'>
        <h4 className='font-semibold text-base-content truncate'>
          {championData.name}
        </h4>
        {showMastery && mastery && (
          <div className='flex items-center gap-2 mt-1'>
            <span className='badge badge-primary badge-xs'>
              M{mastery.championLevel}
            </span>
            <span className='text-xs text-base-content/60'>
              {formatNumber(mastery.championPoints)}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className='text-center'>
        <h3 className='text-xl font-bold text-base-content'>
          {championData.name}
        </h3>
        <p className='text-sm text-base-content/70 italic'>
          {championData.title}
        </p>
        <p className='text-xs text-base-content/60 mt-2 max-w-xs'>
          {championData.blurb}
        </p>
      </div>
    );
  }

  // Default variant
  return (
    <div className='flex-1 min-w-0'>
      <div className='flex items-start justify-between mb-2'>
        <div>
          <h3 className='font-bold text-base-content truncate'>
            {championData.name}
          </h3>
          <p className='text-sm text-base-content/70 italic truncate'>
            {championData.title}
          </p>
        </div>
        {showMastery && mastery && (
          <span className='badge badge-primary badge-lg'>
            M{mastery.championLevel}
          </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChampionInfo);
