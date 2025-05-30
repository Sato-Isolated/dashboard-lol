import React from 'react';
import type { MatchStatsCardProps } from '../matchListTypes';

export const MatchStatsCard: React.FC<MatchStatsCardProps> = ({ stats }) => (
  <div className='bg-base-200 rounded-xl p-4 mb-6'>
    <h3 className='text-lg font-semibold text-base-content mb-4'>
      Match Statistics
    </h3>
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <div className='text-center'>
        <div className='text-2xl font-bold text-base-content'>
          {stats.totalGames}
        </div>
        <div className='text-xs text-base-content/60'>Total Games</div>
      </div>
      <div className='text-center'>
        <div className='text-2xl font-bold text-success'>
          {stats.winRate.toFixed(1)}%
        </div>
        <div className='text-xs text-base-content/60'>Win Rate</div>
      </div>
      <div className='text-center'>
        <div className='text-2xl font-bold text-info'>{stats.avgKda}</div>
        <div className='text-xs text-base-content/60'>Avg KDA</div>
      </div>
      <div className='text-center'>
        <div className='text-2xl font-bold text-primary'>
          {stats.recentFormWins}/{stats.recentFormTotal}
        </div>
        <div className='text-xs text-base-content/60'>Recent Form</div>
      </div>
    </div>

    {stats.mostPlayedChampions.length > 0 && (
      <div className='mt-4'>
        <div className='text-sm font-medium text-base-content mb-2'>
          Most Played
        </div>
        <div className='flex gap-2'>
          {stats.mostPlayedChampions.map(({ champion, games, winRate }) => (
            <div
              key={champion}
              className='bg-base-300 rounded-lg p-2 flex-1 text-center'
            >
              <div className='text-sm font-semibold text-base-content'>
                {champion}
              </div>
              <div className='text-xs text-base-content/70'>{games} games</div>
              <div className='text-xs text-base-content/50'>
                {winRate.toFixed(0)}% WR
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
