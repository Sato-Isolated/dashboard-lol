import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { runesContainerVariants, runeVariants } from '../constants';
import type { RunesDisplayProps } from '../matchCardChampionTypes';

const RunesDisplay: React.FC<RunesDisplayProps> = ({ rune1, rune2 }) => {
  return (
    <motion.div
      className='flex gap-2'
      variants={runesContainerVariants}
      initial='hidden'
      animate='show'
    >
      {rune1 && rune2 ? (
        <>
          <motion.div variants={runeVariants} className='relative'>
            <Image
              src={rune1}
              alt='Primary Rune'
              width={36}
              height={36}
              className='w-9 h-9 rounded-full shadow-lg border-2 border-accent/30 
                       bg-base-200 transition-all duration-300'
            />
          </motion.div>
          <motion.div variants={runeVariants} className='relative'>
            <Image
              src={rune2}
              alt='Secondary Rune'
              width={36}
              height={36}
              className='w-9 h-9 rounded-full shadow-lg border-2 border-accent/30 
                       bg-base-200 transition-all duration-300'
            />
          </motion.div>
        </>
      ) : (
        <>
          <div className='w-9 h-9 bg-base-300/50 rounded-full shadow-inner animate-pulse' />
          <div className='w-9 h-9 bg-base-300/50 rounded-full shadow-inner animate-pulse' />
        </>
      )}
    </motion.div>
  );
};

export default React.memo(RunesDisplay);
