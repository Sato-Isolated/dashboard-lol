import React from 'react';
import { motion } from 'motion/react';
import { UIPlayer } from '@/features/matches/types/uiMatchTypes';

interface PlayerStatsProps {
  player: UIPlayer;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  return (
    <>
      <td className='min-w-[60px] sm:min-w-[70px] max-w-[100px] sm:max-w-[120px]'>
        <motion.span className='inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-info/20 to-info/10 text-info border border-info/30 font-mono text-xs sm:text-sm font-bold rounded-full shadow-sm'>
          {player.kda}
        </motion.span>
      </td>

      <td className='min-w-[35px] sm:min-w-[40px] text-left'>
        <span className='font-mono text-xs sm:text-sm text-base-content/80 font-semibold'>
          {player.cs}
        </span>
      </td>

      <td className='min-w-[50px] sm:min-w-[60px] text-left'>
        <motion.span className='inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-error/20 to-error/10 text-error border border-error/30 font-mono text-xs sm:text-sm font-bold rounded-full shadow-sm'>
          {player.damage}
        </motion.span>
      </td>

      <td className='min-w-[50px] sm:min-w-[60px] text-left'>
        <motion.span className='inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-success/20 to-success/10 text-success border border-success/30 font-mono text-xs sm:text-sm font-bold rounded-full shadow-sm'>
          {player.gold}
        </motion.span>
      </td>
    </>
  );
};
