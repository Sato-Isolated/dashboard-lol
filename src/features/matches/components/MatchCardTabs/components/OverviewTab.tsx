import React, { lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import TableSkeleton from './TableSkeleton';
import type { OverviewTabProps } from '../matchCardTabsTypes';

// Lazy load heavy table component - direct import from MatchTeamTable component
const MatchTeamTable = lazy(() =>
  import('../../MatchTeamTable/MatchTeamTable').then(module => ({
    default: module.MatchTeamTable,
  })),
);

const OverviewTabComponent: React.FC<OverviewTabProps> = ({
  match,
  redTeam,
  blueTeam,
  teamStats,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='p-6 space-y-6'
    >
      <div className='flex items-center gap-3 mb-6'>
        <span className='text-2xl'>📊</span>
        <h3 className='text-xl font-bold text-base-content'>Match Overview</h3>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MatchTeamTable
            players={redTeam}
            team='Victory (Red)'
            teamColor='red'
            teamStats={teamStats.red}
          />
        </motion.div>
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MatchTeamTable
            players={blueTeam}
            team='Defeat (Blue)'
            teamColor='blue'
            teamStats={teamStats.blue}
          />
        </motion.div>
      </Suspense>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const OverviewTab = React.memo(OverviewTabComponent);
OverviewTab.displayName = 'OverviewTab';

export default OverviewTab;
