import React from 'react';
import { motion } from 'motion/react';
import type { AnalysisTabProps } from '../matchCardTabsTypes';

const AnalysisTabComponent: React.FC<AnalysisTabProps> = ({ match }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='p-6'
    >
      <div className='flex items-center gap-3 mb-6'>
        <span className='text-2xl'>🔍</span>
        <h3 className='text-xl font-bold text-base-content'>Team Analysis</h3>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Duration Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className='stat bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl shadow-lg transition-all duration-300'
        >
          <div className='stat-figure text-primary'>
            <svg
              className='w-8 h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <circle cx='12' cy='12' r='10' />
              <polyline points='12,6 12,12 16,14' />
            </svg>
          </div>
          <div className='stat-title'>Duration</div>
          <div className='stat-value text-primary'>
            {match.details.duration}
          </div>
        </motion.div>

        {/* Gold Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className='stat bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl shadow-lg transition-all duration-300'
        >
          <div className='stat-figure text-warning'>
            <svg
              className='w-8 h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <circle cx='12' cy='2' r='3' />
              <path d='M12 21v-6m0 0l-3-3m3 3l3-3' />
            </svg>
          </div>
          <div className='stat-title'>Total Gold</div>
          <div className='stat-value text-lg'>
            <span className='text-error'>{match.details.gold.red}</span>
            <span className='text-base-content/50 mx-2'>vs</span>
            <span className='text-info'>{match.details.gold.blue}</span>
          </div>
        </motion.div>

        {/* Kills Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className='stat bg-gradient-to-br from-error/10 to-error/5 border border-error/20 rounded-xl shadow-lg transition-all duration-300'
        >
          <div className='stat-figure text-error'>
            <svg
              className='w-8 h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 11l5-5m0 0l5 5m-5-5v12'
              />
            </svg>
          </div>
          <div className='stat-title'>Total Kills</div>
          <div className='stat-value text-lg'>
            <span className='text-error'>{match.details.kills.red}</span>
            <span className='text-base-content/50 mx-2'>vs</span>
            <span className='text-info'>{match.details.kills.blue}</span>
          </div>
        </motion.div>

        {/* Towers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className='stat bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl shadow-lg transition-all duration-300'
        >
          <div className='stat-figure text-secondary'>🏰</div>
          <div className='stat-title'>Towers</div>
          <div className='stat-value text-lg'>
            <span className='text-error'>{match.details.towers.red}</span>
            <span className='text-base-content/50 mx-2'>vs</span>
            <span className='text-info'>{match.details.towers.blue}</span>
          </div>
        </motion.div>

        {/* Dragons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className='stat bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl shadow-lg transition-all duration-300'
        >
          <div className='stat-figure text-accent'>🐉</div>
          <div className='stat-title'>Dragons</div>
          <div className='stat-value text-lg'>
            <span className='text-error'>{match.details.dragons.red}</span>
            <span className='text-base-content/50 mx-2'>vs</span>
            <span className='text-info'>{match.details.dragons.blue}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const AnalysisTab = React.memo(AnalysisTabComponent);
AnalysisTab.displayName = 'AnalysisTab';

export default AnalysisTab;
