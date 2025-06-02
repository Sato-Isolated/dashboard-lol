'use client';
import React from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Target,
  Zap,
  Users,
  TrendingUp,
  GamepadIcon,
} from 'lucide-react';
import { containerVariants, statsCardVariants } from '../constants';
import type { MatchStats, StatsCardConfig } from '../matchHistoryTypes';

interface StatsOverviewProps {
  stats: MatchStats;
}

const StatsOverviewComponent: React.FC<StatsOverviewProps> = ({ stats }) => {
  // Stats cards configuration
  const statsCards: StatsCardConfig[] = [
    {
      icon: GamepadIcon,
      label: 'Total Games',
      value: stats.totalMatches,
      gradient: 'from-blue-500/10 to-purple-500/10',
      iconColor: 'text-blue-400',
      valueColor: 'text-base-content',
    },
    {
      icon: Trophy,
      label: 'Wins',
      value: stats.wins,
      gradient: 'from-green-500/10 to-emerald-500/10',
      iconColor: 'text-green-400',
      valueColor: 'text-green-400',
    },
    {
      icon: Target,
      label: 'Losses',
      value: stats.losses,
      gradient: 'from-red-500/10 to-pink-500/10',
      iconColor: 'text-red-400',
      valueColor: 'text-red-400',
    },
    {
      icon: TrendingUp,
      label: 'Win Rate',
      value: stats.winrate,
      gradient: 'from-yellow-500/10 to-orange-500/10',
      iconColor: 'text-yellow-400',
      valueColor: 'text-yellow-400',
    },
    {
      icon: Zap,
      label: 'Avg KDA',
      value: stats.kda,
      gradient: 'from-purple-500/10 to-indigo-500/10',
      iconColor: 'text-purple-400',
      valueColor: 'text-purple-400',
    },
  ];

  return (
    <div className='card bg-base-100/90 backdrop-blur-sm rounded-xl shadow border border-base-300/50 p-6'>
      <motion.h3
        className='font-semibold text-lg text-base-content mb-4 flex items-center'
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TrendingUp className='w-5 h-5 mr-2 text-primary' />
        Statistics Overview
      </motion.h3>

      <motion.div
        className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'
        variants={containerVariants}
      >
        {statsCards.map(card => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={statsCardVariants}
              className={`bg-gradient-to-r ${card.gradient} rounded-xl p-4 border border-base-300/50 cursor-pointer transition-all duration-300 backdrop-blur-sm`}
            >
              <div className='flex items-center space-x-3'>
                <motion.div transition={{ duration: 0.6, ease: 'easeInOut' }}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </motion.div>
                <div>
                  <p className='text-sm text-base-content/70 font-medium'>
                    {card.label}
                  </p>
                  <motion.p
                    className={`text-xl font-bold ${card.valueColor}`}
                    transition={{ duration: 0.2 }}
                  >
                    {card.value}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
const StatsOverview = React.memo(StatsOverviewComponent);
StatsOverview.displayName = 'StatsOverview';

export default StatsOverview;
