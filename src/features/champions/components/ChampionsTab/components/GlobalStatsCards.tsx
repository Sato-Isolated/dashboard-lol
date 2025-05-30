import React from 'react';
import { motion } from 'motion/react';
import { User, Trophy, Target, Zap } from 'lucide-react';
import { GlobalStats } from '../championsTabTypes';
import { cardVariants } from '../utils/animations';

interface GlobalStatsCardsProps {
  globalStats: GlobalStats;
  totalChampions: number;
}

export const GlobalStatsCards: React.FC<GlobalStatsCardsProps> = ({
  globalStats,
  totalChampions,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
    >
      {/* Total Games Card */}
      <motion.div
        variants={cardVariants}
        className='stats stats-vertical lg:stats-horizontal shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20'
      >
        <div className='stat place-items-center'>
          <div className='stat-figure text-primary'>
            <User size={28} />
          </div>
          <div className='stat-title text-primary font-semibold'>
            Total Games
          </div>
          <div className='stat-value text-primary text-2xl'>
            {globalStats.totalGames}
          </div>
        </div>
      </motion.div>

      {/* Winrate Card */}
      <motion.div
        variants={cardVariants}
        className='stats stats-vertical lg:stats-horizontal shadow-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20'
      >
        <div className='stat place-items-center'>
          <div className='stat-figure text-success'>
            <Trophy size={28} />
          </div>
          <div className='stat-title text-success font-semibold'>Win Rate</div>
          <div className='stat-value text-success text-2xl'>
            {globalStats.globalWinrate.toFixed(1)}%
          </div>
        </div>
      </motion.div>

      {/* KDA Card */}
      <motion.div
        variants={cardVariants}
        className='stats stats-vertical lg:stats-horizontal shadow-lg bg-gradient-to-br from-info/10 to-info/5 border border-info/20'
      >
        <div className='stat place-items-center'>
          <div className='stat-figure text-info'>
            <Target size={28} />
          </div>
          <div className='stat-title text-info font-semibold'>Avg KDA</div>
          <div className='stat-value text-info text-2xl'>
            {globalStats.globalKda.toFixed(2)}
          </div>
        </div>
      </motion.div>

      {/* Champions Played Card */}
      <motion.div
        variants={cardVariants}
        className='stats stats-vertical lg:stats-horizontal shadow-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20'
      >
        <div className='stat place-items-center'>
          <div className='stat-figure text-accent'>
            <Zap size={28} />
          </div>
          <div className='stat-title text-accent font-semibold'>Champions</div>
          <div className='stat-value text-accent text-2xl'>
            {totalChampions}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
