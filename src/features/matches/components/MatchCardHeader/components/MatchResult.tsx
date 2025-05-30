import React from 'react';
import { motion } from 'motion/react';
import { useMatchResult } from '../hooks/useMatchResult';
import { resultVariants, WIN_EMOJI, DEFEAT_EMOJI } from '../constants';
import type { MatchResultProps } from '../matchCardHeaderTypes';

const MatchResult: React.FC<MatchResultProps> = ({ result }) => {
  const { isWin, displayResult, resultClass } = useMatchResult(result);

  return (
    <motion.div
      variants={resultVariants}
      initial='initial'
      animate='animate'
      className={`text-xl font-bold flex items-center justify-center gap-2 ${resultClass}`}
    >
      <span className='text-2xl'>{isWin ? WIN_EMOJI : DEFEAT_EMOJI}</span>
      <span className='text-center'>{displayResult}</span>
    </motion.div>
  );
};

export default React.memo(MatchResult);
