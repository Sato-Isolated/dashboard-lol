import React from 'react';
import { motion } from 'motion/react';
import { TEAM_COLORS, TeamColorType } from '../constants';

interface BackgroundEffectsProps {
  teamColor: TeamColorType;
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({
  teamColor,
}) => {
  const colors = TEAM_COLORS[teamColor];

  return (
    <div className='absolute inset-0 pointer-events-none overflow-hidden'>
      <motion.div
        className={`absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl ${colors.bgEffect}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl ${colors.bgEffectSecondary}`}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
};
