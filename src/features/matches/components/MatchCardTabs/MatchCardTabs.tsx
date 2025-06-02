import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TabNavigation,
  OverviewTab,
  AnalysisTab,
  BuildTab,
} from './components';
import { TAB_CONFIGS } from './constants';
import { useTabState, useTeamStats } from './hooks';
import type { MatchCardTabsProps } from './matchCardTabsTypes';

const MatchCardTabsComponent: React.FC<MatchCardTabsProps> = ({
  tab,
  setTab,
  match,
  redTeam,
  blueTeam,
}) => {
  // Custom hooks
  const { groupId, handleTabChange } = useTabState(match, setTab);
  const teamStats = useTeamStats(match);

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (tab) {
      case 'overview':
        return (
          <OverviewTab
            match={match}
            redTeam={redTeam}
            blueTeam={blueTeam}
            teamStats={teamStats}
          />
        );
      case 'team':
        return <AnalysisTab match={match} />;
      case 'build':
        return <BuildTab />;
      default:
        return (
          <OverviewTab
            match={match}
            redTeam={redTeam}
            blueTeam={blueTeam}
            teamStats={teamStats}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full space-y-6'
    >
      {/* Tab Navigation */}
      <TabNavigation
        tabs={TAB_CONFIGS}
        activeTab={tab}
        onTabChange={handleTabChange}
      />

      {/* Tab Content with AnimatePresence */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className='bg-gradient-to-br from-base-100/80 to-base-200/40 backdrop-blur-sm rounded-2xl border border-base-content/10 shadow-xl overflow-hidden'
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Memoize the component for performance
const MatchCardTabs = React.memo(
  MatchCardTabsComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.tab === nextProps.tab &&
      prevProps.match.gameId === nextProps.match.gameId &&
      prevProps.redTeam.length === nextProps.redTeam.length &&
      prevProps.blueTeam.length === nextProps.blueTeam.length
    );
  },
);

MatchCardTabs.displayName = 'MatchCardTabs';

export default MatchCardTabs;
