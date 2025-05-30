import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Zap, Crown, TrendingUp } from 'lucide-react';
import { statsCardVariants, containerVariants } from '../utils/animations';
import type { MasteryStats } from '../hooks/useMasteryStats';

interface StatsCardsProps {
  stats: MasteryStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto'
    >
      <motion.div
        variants={statsCardVariants}
        className='relative overflow-hidden rounded-xl'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl'></div>
        <div className='relative p-4 bg-base-100/80 backdrop-blur-sm border border-primary/30 rounded-xl shadow-xl'>
          <div className='flex flex-col items-center text-center space-y-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg'>
              <Trophy size={16} className='text-white' />
            </div>
            <span className='text-xs font-medium text-base-content/70'>
              Total Champions
            </span>
            <motion.div
              className='text-2xl font-bold text-primary'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {stats.totalChampions}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={statsCardVariants}
        className='relative overflow-hidden rounded-xl'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/30 rounded-xl'></div>
        <div className='relative p-4 bg-base-100/80 backdrop-blur-sm border border-secondary/30 rounded-xl shadow-xl'>
          <div className='flex flex-col items-center text-center space-y-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center shadow-lg'>
              <Zap size={16} className='text-white' />
            </div>
            <span className='text-xs font-medium text-base-content/70'>
              Total Points
            </span>
            <motion.div
              className='text-2xl font-bold text-secondary'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {stats.totalPoints.toLocaleString('en-US')}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={statsCardVariants}
        className='relative overflow-hidden rounded-xl'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-warning/20 to-warning/30 rounded-xl'></div>
        <div className='relative p-4 bg-base-100/80 backdrop-blur-sm border border-warning/30 rounded-xl shadow-xl'>
          <div className='flex flex-col items-center text-center space-y-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-warning to-error rounded-lg flex items-center justify-center shadow-lg'>
              <Crown size={16} className='text-white' />
            </div>
            <span className='text-xs font-medium text-base-content/70'>
              Level 7 Champions
            </span>
            <motion.div
              className='text-2xl font-bold text-warning'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              {stats.level7Champions}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={statsCardVariants}
        className='relative overflow-hidden rounded-xl'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/30 rounded-xl'></div>
        <div className='relative p-4 bg-base-100/80 backdrop-blur-sm border border-accent/30 rounded-xl shadow-xl'>
          <div className='flex flex-col items-center text-center space-y-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-accent to-info rounded-lg flex items-center justify-center shadow-lg'>
              <TrendingUp size={16} className='text-white' />
            </div>
            <span className='text-xs font-medium text-base-content/70'>
              Average Level
            </span>
            <motion.div
              className='text-2xl font-bold text-accent'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              {stats.avgLevel.toFixed(1)}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
