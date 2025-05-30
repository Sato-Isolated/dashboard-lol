import React from 'react';
import { motion } from 'motion/react';
import { TEAM_COLORS, TeamColorType } from '../constants';

interface TeamHeaderProps {
  team: string;
  isRedTeam: boolean;
  teamStats?: { kills: number; gold: number };
  teamColor: TeamColorType;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({
  team,
  isRedTeam,
  teamStats,
  teamColor,
}) => {
  const colors = TEAM_COLORS[teamColor];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className={`relative z-10 px-4 sm:px-6 py-3 sm:py-4 font-bold flex items-center justify-between text-base sm:text-lg rounded-t-2xl sm:rounded-t-3xl
        bg-gradient-to-r ${colors.header} ${colors.text} border-b-2 ${colors.headerBorder}`}
    >
      <div className='flex items-center gap-2 sm:gap-3'>
        <span className='text-xl sm:text-2xl'>{isRedTeam ? '🔴' : '🔵'}</span>
        <span className='font-extrabold text-sm sm:text-base'>{team}</span>
      </div>

      {teamStats && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className='flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3'
        >
          <motion.span className='inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 font-bold text-xs sm:text-sm rounded-full shadow-lg'>
            <svg
              className='w-3 h-3 sm:w-4 sm:h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 11l5-5m0 0l5 5m-5-5v12'
              />
            </svg>
            {teamStats.kills} <span className='hidden sm:inline'>Kills</span>
          </motion.span>
          <motion.span className='inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-warning/20 to-warning/10 text-warning border border-warning/30 font-bold text-xs sm:text-sm rounded-full shadow-lg'>
            <svg
              className='w-3 h-3 sm:w-4 sm:h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <circle cx='12' cy='2' r='3' />
              <path d='M12 21v-6m0 0l-3-3m3 3l3-3' />
            </svg>
            {teamStats.gold} <span className='hidden sm:inline'>Gold</span>
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
};
