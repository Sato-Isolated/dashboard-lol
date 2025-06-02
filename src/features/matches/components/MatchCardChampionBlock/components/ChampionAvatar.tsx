import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  championAvatarVariants,
  levelBadgeVariants,
  CHAMPION_LEVEL,
} from '../constants';
import type { ChampionAvatarProps } from '../matchCardChampionTypes';

const ChampionAvatar: React.FC<ChampionAvatarProps> = ({
  champion,
  championIcon,
  level = CHAMPION_LEVEL,
}) => {
  return (
    <motion.div
      variants={championAvatarVariants}
      initial='initial'
      animate='animate'
      className='relative'
    >
      <div
        className='relative w-20 h-20 rounded-3xl overflow-hidden shadow-2xl
                      bg-gradient-to-br from-primary/20 to-accent/20
                      border-4 border-primary/40
                      transition-all duration-300'
      >
        <Image
          src={championIcon}
          alt={champion}
          width={80}
          height={80}
          className='object-cover w-full h-full transition-transform duration-300'
        />
      </div>
      {/* Champion Level Badge */}
      <motion.div
        variants={levelBadgeVariants}
        initial='initial'
        animate='animate'
        className='absolute -bottom-2 -right-2 w-8 h-6 bg-gradient-to-r from-primary to-accent 
                   rounded-full flex items-center justify-center shadow-lg text-primary-content 
                   text-xs font-bold border-2 border-base-100'
      >
        {level}
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ChampionAvatar);
