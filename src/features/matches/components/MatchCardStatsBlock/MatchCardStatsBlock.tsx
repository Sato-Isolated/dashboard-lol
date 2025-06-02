import React from 'react';
import { motion } from 'motion/react';
import { useKDAParts } from './hooks/useKDAParts';
import {
  KDADisplay,
  KDARatio,
  ParticipationPercentage,
  BadgesList,
} from './components';
import { statsBlockVariants } from './constants';
import type { StatsBlockProps } from './matchCardStatsTypes';

const MatchCardStatsBlockComponent: React.FC<StatsBlockProps> = ({
  kdaParts,
  kdaValue,
  pKill,
  specialBadges,
}) => {
  const { kills, deaths, assists } = useKDAParts(kdaParts);

  return (
    <motion.div
      variants={statsBlockVariants}
      initial='initial'
      animate='animate'
      className='flex flex-col items-center justify-center flex-1 px-4 min-w-[160px] 
                 bg-gradient-to-br from-base-200/30 to-base-100/20 rounded-2xl 
                 border border-base-content/10 backdrop-blur-sm shadow-inner
                 transition-all duration-300 py-4'
    >
      {/* KDA Display */}
      <KDADisplay kills={kills} deaths={deaths} assists={assists} />

      {/* KDA Ratio */}
      <KDARatio kdaValue={kdaValue} />

      {/* P/Kill Percentage */}
      <ParticipationPercentage pKill={pKill} />

      {/* Special Badges */}
      <BadgesList badges={specialBadges} />
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchCardStatsBlock = React.memo(MatchCardStatsBlockComponent);
MatchCardStatsBlock.displayName = 'MatchCardStatsBlock';

export default MatchCardStatsBlock;
