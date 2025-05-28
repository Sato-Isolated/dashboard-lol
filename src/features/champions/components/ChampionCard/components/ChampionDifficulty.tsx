import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../constants';

interface ChampionDifficultyProps {
  difficulty: number;
}

export const ChampionDifficulty: React.FC<ChampionDifficultyProps> = ({
  difficulty,
}) => {
  return (
    <motion.div className='w-full' variants={fadeInUp}>
      <div className='flex items-center justify-between text-xs text-base-content/60 mb-1'>
        <span>Difficulty</span>
        <span>{difficulty}/10</span>
      </div>
      <div className='w-full bg-base-300 rounded-full h-2'>
        <div
          className='bg-primary h-2 rounded-full transition-all duration-300'
          style={{
            width: `${(difficulty / 10) * 100}%`,
          }}
        />
      </div>
    </motion.div>
  );
};

export default React.memo(ChampionDifficulty);
