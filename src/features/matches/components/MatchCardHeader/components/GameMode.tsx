import React from 'react';
import type { GameModeProps } from '../matchCardHeaderTypes';

const GameMode: React.FC<GameModeProps> = ({ mode }) => {
  return (
    <div className='flex items-center justify-center'>
      <span className='px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full w-fit'>
        {mode}
      </span>
    </div>
  );
};

export default React.memo(GameMode);
