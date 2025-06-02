import React from 'react';
import { motion } from 'motion/react';
import { MatchResult, GameMode, MatchDate, MatchDuration } from './components';
import { headerContainerVariants } from './constants';
import type { HeaderProps } from './matchCardHeaderTypes';

const MatchCardHeaderComponent: React.FC<HeaderProps> = ({
  date,
  result,
  duration,
  mode,
}) => {
  return (
    <motion.div
      variants={headerContainerVariants}
      initial='initial'
      animate='animate'
      className='flex flex-col justify-center min-w-[120px] max-w-[140px] p-4 rounded-2xl 
                 bg-gradient-to-br from-base-200/80 via-base-100/60 to-base-200/40 
                 backdrop-blur-sm border border-base-content/10 shadow-inner
                 transition-all duration-300
                 relative overflow-hidden group'
    >
      <div className='relative z-10 space-y-3'>
        {/* Result - Now the main focus */}
        <MatchResult result={result} />

        {/* Game Mode */}
        <GameMode mode={mode} />

        {/* Date */}
        <MatchDate date={date} />

        {/* Duration */}
        <MatchDuration duration={duration} />
      </div>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchCardHeader = React.memo(MatchCardHeaderComponent);
MatchCardHeader.displayName = 'MatchCardHeader';

export default MatchCardHeader;
