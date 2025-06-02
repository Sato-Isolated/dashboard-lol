'use client';
import React from 'react';
import { motion } from 'motion/react';
import { MatchCardProps } from './matchCardTypes';
import { cardVariants } from './constants';
import { isMatchWin, getMatchResultStyles } from './utils';
import { useMatchCardState } from './hooks/useMatchCardState';
import { useMatchCalculations } from './hooks/useMatchCalculations';

// Components
import AnimatedBackgroundEffects from './components/AnimatedBackgroundEffects';
import ExpandCollapseButton from './components/ExpandCollapseButton';
import CollapsibleContent from './components/CollapsibleContent';

// Existing sub-components
import MatchCardHeader from '../MatchCardHeader';
import MatchCardChampionBlock from '../MatchCardChampionBlock';
import MatchCardStatsBlock from '../MatchCardStatsBlock';

const MatchCardComponent: React.FC<MatchCardProps> = ({ match }) => {
  // State management
  const { state, actions } = useMatchCardState();

  // Calculations
  const calculations = useMatchCalculations(match);

  // Derived values
  const isWin = isMatchWin(match.result);
  const styles = getMatchResultStyles(isWin);

  return (
    <motion.div
      layout
      {...cardVariants}
      className={`group relative overflow-hidden backdrop-blur-md
        ${styles.background} ${styles.border}
        border-2 rounded-3xl shadow-2xl mb-6 transition-all duration-500
        ${state.open ? `ring-4 shadow-3xl ${styles.ring}` : ''}`}
    >
      {/* Animated Background Effects */}
      <AnimatedBackgroundEffects isWin={isWin} />

      {/* Expand/Collapse Button */}
      <ExpandCollapseButton open={state.open} onClick={actions.toggleOpen} />

      {/* Main Content Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='relative flex flex-col lg:flex-row items-stretch gap-0 w-full px-4 lg:px-6 pt-6 pb-4 z-10 cursor-pointer transition-all duration-300 rounded-t-3xl'
        onClick={actions.toggleOpen}
      >
        {/* Header - Game Info */}
        <MatchCardHeader
          date={match.date}
          result={match.result}
          duration={match.duration}
          mode={match.mode}
        />

        {/* Champion Block - Center */}
        <MatchCardChampionBlock
          champion={match.champion}
          mainPlayer={calculations.mainPlayer}
        />

        {/* Stats Block - Right */}
        <MatchCardStatsBlock
          kdaParts={calculations.kdaParts}
          kdaValue={calculations.kdaValue}
          pKill={calculations.pKill}
          specialBadges={calculations.specialBadges}
        />
      </motion.div>

      {/* Collapsible Content */}
      <CollapsibleContent
        open={state.open}
        tab={state.tab}
        setTab={actions.setTab}
        match={match}
        redTeam={calculations.redTeam}
        blueTeam={calculations.blueTeam}
      />
    </motion.div>
  );
};

// Memoized MatchCard component for performance optimization
const MemoizedMatchCard = React.memo(
  MatchCardComponent,
  (prevProps, nextProps) => {
    // Custom comparison function for better memoization
    return (
      prevProps.match.gameId === nextProps.match.gameId &&
      prevProps.match.kda === nextProps.match.kda &&
      prevProps.match.result === nextProps.match.result &&
      prevProps.match.players.length === nextProps.match.players.length
    );
  },
);

MemoizedMatchCard.displayName = 'MemoizedMatchCard';

export default MemoizedMatchCard;
