'use client';
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { default as MatchCard } from '../../MatchCard';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';

interface StableMatchCardProps {
  match: UIMatch;
  index: number;
  isVisible: boolean;
}

const StableMatchCardComponent: React.FC<StableMatchCardProps> = ({
  match,
  index,
  isVisible,
}) => {
  // Generate stable key for the match
  const stableKey = useMemo(() => {
    return (
      match.gameId || `${match.champion}-${match.result}-${index}-${match.date}`
    );
  }, [match.gameId, match.champion, match.result, index, match.date]);

  return (
    <motion.div
      key={stableKey}
      layout='position'
      layoutId={stableKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0.7,
        y: 0,
        scale: isVisible ? 1 : 0.98,
      }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
        layout: { duration: 0.2 },
      }}
      style={{
        transformOrigin: 'center',
        willChange: 'transform, opacity',
      }}
    >
      <MatchCard match={match} />
    </motion.div>
  );
};

// Memoize with custom comparison to prevent unnecessary rerenders
export const StableMatchCard = React.memo(
  StableMatchCardComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.match.gameId === nextProps.match.gameId &&
      prevProps.match.kda === nextProps.match.kda &&
      prevProps.match.result === nextProps.match.result &&
      prevProps.index === nextProps.index &&
      prevProps.isVisible === nextProps.isVisible
    );
  },
);

StableMatchCard.displayName = 'StableMatchCard';
