import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { spellsContainerVariants, spellVariants } from '../constants';
import type { SummonerSpellsProps } from '../matchCardChampionTypes';

const SummonerSpells: React.FC<SummonerSpellsProps> = ({ spell1, spell2 }) => {
  return (
    <motion.div
      className='flex gap-2'
      variants={spellsContainerVariants}
      initial='hidden'
      animate='show'
    >
      {spell1 && spell2 ? (
        <>
          <motion.div variants={spellVariants} className='relative'>
            <Image
              src={spell1}
              alt='Spell 1'
              width={36}
              height={36}
              className='w-9 h-9 rounded-lg shadow-lg border-2 border-primary/30 
                       bg-base-200 transition-all duration-300'
            />
          </motion.div>
          <motion.div variants={spellVariants} className='relative'>
            <Image
              src={spell2}
              alt='Spell 2'
              width={36}
              height={36}
              className='w-9 h-9 rounded-lg shadow-lg border-2 border-primary/30 
                       bg-base-200 transition-all duration-300'
            />
          </motion.div>
        </>
      ) : (
        <>
          <div className='w-9 h-9 bg-base-300/50 rounded-lg shadow-inner animate-pulse' />
          <div className='w-9 h-9 bg-base-300/50 rounded-lg shadow-inner animate-pulse' />
        </>
      )}
    </motion.div>
  );
};

export default React.memo(SummonerSpells);
