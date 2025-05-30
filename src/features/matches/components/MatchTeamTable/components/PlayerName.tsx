import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { UIPlayer } from '@/features/matches/types/uiMatchTypes';
import { usePlayerProfile } from '../hooks/usePlayerProfile';

interface PlayerNameProps {
  player: UIPlayer;
}

export const PlayerName: React.FC<PlayerNameProps> = ({ player }) => {
  const { profileUrl } = usePlayerProfile(player.name, player.tagline);

  return (
    <td className='p-2 sm:p-3 pl-2 sm:pl-4 font-semibold text-base-content min-w-[100px] sm:min-w-[120px] max-w-[180px] sm:max-w-[220px]'>
      <div className='flex items-center gap-2 sm:gap-3'>
        {/* Champion Avatar with hover effect */}
        <motion.div className='relative'>
          <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-2 border-primary/30 bg-base-100'>
            <Image
              src={'/assets/champion/' + player.champion + '.png'}
              alt={player.champion}
              width={48}
              height={48}
              className='object-cover transition-transform duration-300'
            />
          </div>
        </motion.div>

        {/* Player Name with Link */}
        <div className='flex flex-col'>
          <Link
            href={profileUrl}
            className='text-primary transition-colors duration-200 max-w-[80px] sm:max-w-[110px] font-bold text-xs sm:text-sm truncate'
            onClick={e => e.stopPropagation()}
            prefetch={false}
            title={player.name}
          >
            {player.name}
          </Link>
          {player.mvp && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className='inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-warning to-warning/80 text-warning-content text-xs font-bold rounded-full shadow-lg mt-1 w-fit'
            >
              <span>👑</span> <span className='hidden sm:inline'>MVP</span>
            </motion.span>
          )}
        </div>
      </div>
    </td>
  );
};
