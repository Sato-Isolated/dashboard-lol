'use client';

import React from 'react';
import { motion } from 'motion/react';
import LeaderboardRow from './LeaderboardRow';

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
    <div className='w-full'>
      <div className='overflow-x-auto bg-base-100 rounded-lg shadow-sm border border-base-300'>
        <table className='table table-zebra w-full min-w-[600px]'>
          <thead className='sticky top-0 bg-base-200 z-10'>
            <tr className='bg-base-200'>
              <th className='text-sm sm:text-lg font-bold w-16'>#</th>
              <th className='text-sm sm:text-lg font-bold min-w-[200px]'>
                Summoner
              </th>
              <th className='text-sm sm:text-lg font-bold hidden sm:table-cell w-32'>
                ARAM Score
              </th>
              <th className='text-sm sm:text-lg font-bold table-cell sm:hidden w-20'>
                Score
              </th>
              <th className='text-sm sm:text-lg font-bold hidden md:table-cell w-24'>
                Tier
              </th>
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
                  delay: Math.min(i * 0.05, 1), // Limit maximum delay
                }}
                className='transition-all duration-200'
              >
                <LeaderboardRow
                  entry={entry}
                  rank={i + 1}
                  platform={platform}
                  isPriority={i < 10}
                  asTableRow={false} // We handle the tr in this component
                />
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const LeaderboardTable = React.memo(LeaderboardTableComponent);

LeaderboardTable.displayName = 'LeaderboardTable';

export default LeaderboardTable;
