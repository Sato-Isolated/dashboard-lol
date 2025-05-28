import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface MatchCardHeaderProps {
  date: string;
  result: string;
  duration: string;
  mode: string;
}

const MatchCardHeaderComponent: React.FC<MatchCardHeaderProps> = ({
  date,
  result,
  duration,
  mode,
}) => {
  // Memoize computed values to avoid recalculations
  const isWin = result.toLowerCase() === 'win';
  const displayResult = useMemo(() => (isWin ? 'Victory' : 'Defeat'), [isWin]);
  const resultClass = useMemo(
    () => (isWin ? 'text-success' : 'text-error'),
    [isWin]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className='flex flex-col justify-center min-w-[120px] max-w-[140px] p-4 rounded-2xl 
                 bg-gradient-to-br from-base-200/80 via-base-100/60 to-base-200/40 
                 backdrop-blur-sm border border-base-content/10 shadow-inner
                 transition-all duration-300
                 relative overflow-hidden group'
    >
      {/* Background glow effect */}

      <div className='relative z-10 space-y-3'>
        {/* Result - Now the main focus */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`text-xl font-bold flex items-center justify-center gap-2 ${resultClass}`}
        >
          <span className='text-2xl'>{isWin ? '🏆' : '💀'}</span>
          <span className='text-center'>{displayResult}</span>
        </motion.div>

        {/* Game Mode */}
        <div className='flex items-center justify-center'>
          <span className='px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full w-fit'>
            {mode}
          </span>
        </div>
        {/* Date */}
        <div className='flex items-center justify-center gap-2 text-xs text-base-content/70 font-mono'>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          {date}
        </div>
        {/* Duration */}
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
      </div>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchCardHeader = React.memo(MatchCardHeaderComponent);
MatchCardHeader.displayName = 'MatchCardHeader';

export default MatchCardHeader;
