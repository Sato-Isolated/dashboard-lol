import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MasteryCard } from './MasteryCard';
import { MasteryListRow } from './MasteryListRow';
import { containerVariants } from '../utils/animations';
import type { MasteryWithChampion, ViewMode } from '../masteryTabTypes';

interface MasteryContentProps {
  masteries: MasteryWithChampion[];
  viewMode: ViewMode;
}

export const MasteryContent: React.FC<MasteryContentProps> = ({
  masteries,
  viewMode,
}) => {
  return (
    <AnimatePresence mode='wait'>
      {viewMode === 'grid' ? (
        <motion.div
          key='grid'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        >
          {masteries.map((mastery, index) => (
            <MasteryCard
              key={mastery.championId}
              mastery={mastery}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          key='list'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='overflow-hidden rounded-2xl bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-xl'
        >
          <table className='table table-zebra w-full'>
            <thead className='bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10'>
              <tr className='border-b border-base-300/50'>
                <th className='py-4 px-6 text-left font-bold'>Champion</th>
                <th className='py-4 px-6 text-center font-bold'>Level</th>
                <th className='py-4 px-6 text-center font-bold'>Points</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial='hidden'
              animate='visible'
            >
              {masteries.map((mastery, index) => (
                <MasteryListRow
                  key={mastery.championId}
                  mastery={mastery}
                  index={index}
                />
              ))}
            </motion.tbody>
          </table>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
