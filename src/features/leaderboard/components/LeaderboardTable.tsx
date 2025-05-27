'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LeaderboardRow from './LeaderboardRow';
import { withPerformanceTracking } from '@/shared/components/performance/SimplePerformanceWrapper';

interface LeaderboardTableProps {
  leaderboard: Array<{
    name: string;
    aramScore: number;
    profileIconId: number;
    tagline: string;
  }>;
  platform: string;
}

const LeaderboardTableComponent: React.FC<LeaderboardTableProps> = ({
  leaderboard,
  platform,
}) => {
  if (leaderboard.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-6xl mb-4'>🏆</div>
        <h3 className='text-xl font-bold mb-2'>No players found</h3>
        <p className='text-base-content/70'>
          Be the first to be ranked on this platform!
        </p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='table table-zebra w-full'>
        <thead>
          <tr className='bg-base-200'>
            <th className='text-lg font-bold'>#</th>
            <th className='text-lg font-bold'>Summoner</th>
            <th className='text-lg font-bold'>ARAM Score</th>
            <th className='text-lg font-bold'>Tier</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, i) => (
            <motion.tr
              key={`${entry.name}-${entry.tagline}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: Math.min(i * 0.05, 1), // Limite le délai maximum
              }}
              whileHover={{
                scale: 1.02,
                backgroundColor: 'rgba(var(--p), 0.1)',
                transition: { duration: 0.2 },
              }}
              className='transition-all duration-200'
            >
              <LeaderboardRow
                entry={entry}
                rank={i + 1}
                platform={platform}
                isPriority={i < 10}
                asTableRow={false} // On gère le tr dans ce composant
              />
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const LeaderboardTable = withPerformanceTracking(
  React.memo(LeaderboardTableComponent),
  'LeaderboardTable'
);

LeaderboardTable.displayName = 'LeaderboardTable';

export default LeaderboardTable;
