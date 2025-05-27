'use client';
import React, { useState } from 'react';
import {
  getAramRank,
  aramRankTiers,
  type AramRankInfo,
} from '@/features/aram/utils/aramRankSystem';
import { Button } from '@/shared/components/ui/Button';
import type { UIMatch } from '@/features/matches/types/ui-match.types';

interface AramStatsProps {
  aramScore: number;
  aramMatches?: UIMatch[];
  loading?: boolean;
  error?: string | null;
  variant?: 'default' | 'compact' | 'detailed';
  showLeaderboard?: boolean;
  showMatchHistory?: boolean;
  className?: string;
  onScoreUpdate?: () => void;
  updatingScore?: boolean;
}

interface AramMatchStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  averageKda: string;
  favoriteChampions: Array<{
    champion: string;
    games: number;
    winRate: number;
  }>;
  recentForm: Array<{ result: 'Win' | 'Loss'; champion: string; kda: string }>;
}

const calculateAramMatchStats = (matches: UIMatch[]): AramMatchStats => {
  if (!matches || matches.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      averageKda: '0.00',
      favoriteChampions: [],
      recentForm: [],
    };
  }

  const totalGames = matches.length;
  const wins = matches.filter(m => m.result === 'Win').length;
  const losses = totalGames - wins;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

  // Calculate average KDA
  let totalKills = 0,
    totalDeaths = 0,
    totalAssists = 0;
  matches.forEach(match => {
    const kdaParts = match.kda.includes('/')
      ? match.kda.split('/')
      : match.kda.split(':');
    totalKills += Number(kdaParts[0]) || 0;
    totalDeaths += Number(kdaParts[1]) || 0;
    totalAssists += Number(kdaParts[2]) || 0;
  });

  const averageKda =
    totalDeaths === 0
      ? (totalKills + totalAssists).toFixed(2)
      : ((totalKills + totalAssists) / totalDeaths).toFixed(2);

  // Calculate favorite champions
  const championCount: Record<string, { games: number; wins: number }> = {};
  matches.forEach(match => {
    if (!championCount[match.champion]) {
      championCount[match.champion] = { games: 0, wins: 0 };
    }
    championCount[match.champion].games++;
    if (match.result === 'Win') {
      championCount[match.champion].wins++;
    }
  });

  const favoriteChampions = Object.entries(championCount)
    .map(([champion, stats]) => ({
      champion,
      games: stats.games,
      winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);

  // Recent form (last 10 games)
  const recentForm = matches.slice(0, Math.min(10, totalGames)).map(match => ({
    result: match.result,
    champion: match.champion,
    kda: match.kda,
  }));

  return {
    totalGames,
    wins,
    losses,
    winRate,
    averageKda,
    favoriteChampions,
    recentForm,
  };
};

const RankProgressBar: React.FC<{
  currentRank: AramRankInfo & { displayName: string };
  aramScore: number;
}> = ({ currentRank, aramScore }) => {
  const progress =
    currentRank.max === Infinity
      ? 100
      : Math.min(
          100,
          ((aramScore - currentRank.min) /
            (currentRank.max - currentRank.min)) *
            100
        );

  const nextRankIndex =
    aramRankTiers.findIndex(rank => rank.name === currentRank.name) + 1;
  const nextRank =
    nextRankIndex < aramRankTiers.length ? aramRankTiers[nextRankIndex] : null;

  return (
    <div className='space-y-2'>
      <div className='flex justify-between text-sm'>
        <span className='text-base-content'>{currentRank.displayName}</span>
        {nextRank && (
          <span className='text-base-content/60'>{nextRank.name}</span>
        )}
      </div>
      <div className='relative'>
        <div className='w-full bg-base-300 rounded-full h-3'>
          <div
            className='bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className='text-xs text-base-content/60 mt-1 text-center'>
          {aramScore} / {currentRank.max === Infinity ? 'Max' : currentRank.max}
          points
        </div>
      </div>
    </div>
  );
};

const RankTierCard: React.FC<{
  rank: AramRankInfo;
  isCurrentRank: boolean;
  aramScore: number;
}> = ({ rank, isCurrentRank, aramScore: _aramScore }) => (
  <div
    className={`p-3 rounded-lg border transition-all ${
      isCurrentRank
        ? 'bg-primary/10 border-primary shadow-lg'
        : 'bg-base-300/50 border-base-300'
    }`}
  >
    <div className='flex items-center justify-between'>
      <div>
        <div
          className={`font-semibold ${
            isCurrentRank ? 'text-primary' : 'text-base-content'
          }`}
        >
          {rank.name}
        </div>
        <div className='text-xs text-base-content/60'>
          {rank.min} - {rank.max === Infinity ? '∞' : rank.max} points
        </div>
      </div>
      {isCurrentRank && <div className='text-primary text-xl'>★</div>}
    </div>
  </div>
);

const CompactAramDisplay: React.FC<{
  aramScore: number;
  className?: string;
}> = ({ aramScore, className = '' }) => {
  const currentRank = getAramRank(aramScore);

  return (
    <div className={`bg-base-300 rounded-lg p-3 ${className}`}>
      <div className='flex items-center justify-between'>
        <div>
          <div className='text-sm font-semibold text-info'>
            {currentRank.displayName}
          </div>
          <div className='text-xs text-base-content/60'>{aramScore} points</div>
        </div>
        <div className='text-info text-lg'>🏆</div>
      </div>
    </div>
  );
};

export const AramStats: React.FC<AramStatsProps> = ({
  aramScore,
  aramMatches = [],
  loading = false,
  error = null,
  variant = 'default',
  showLeaderboard = false,
  showMatchHistory = true,
  className = '',
  onScoreUpdate,
  updatingScore = false,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ranks' | 'matches' | 'leaderboard'
  >('overview');

  const currentRank = getAramRank(aramScore);
  const matchStats = calculateAramMatchStats(aramMatches);

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className='skeleton h-8 w-48' />
        <div className='bg-base-200 rounded-xl p-6 animate-pulse'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <div className='skeleton h-6 w-24' />
                <div className='skeleton h-4 w-32' />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`bg-base-200 rounded-xl p-6 border border-error/20 text-center ${className}`}
      >
        <div className='text-error text-lg mb-2'>
          ⚠️ Error Loading ARAM Stats
        </div>
        <div className='text-base-content/70 text-sm'>{error}</div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return <CompactAramDisplay aramScore={aramScore} className={className} />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-base-content'>
          ARAM Statistics
        </h2>
        {onScoreUpdate && (
          <Button
            variant='primary'
            size='sm'
            onClick={onScoreUpdate}
            isLoading={updatingScore}
            disabled={updatingScore}
          >
            {updatingScore ? 'Updating...' : 'Update Score'}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className='tabs tabs-boxed bg-base-200'>
        <button
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'ranks' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('ranks')}
        >
          Ranks
        </button>
        {showMatchHistory && (
          <button
            className={`tab ${activeTab === 'matches' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </button>
        )}
        {showLeaderboard && (
          <button
            className={`tab ${activeTab === 'leaderboard' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className='space-y-6'>
          {/* Current Rank Card */}
          <div className='bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20'>
            <div className='flex flex-col md:flex-row items-center gap-6'>
              <div className='text-center md:text-left'>
                <div className='text-3xl font-bold text-primary mb-2'>
                  {currentRank.displayName}
                </div>
                <div className='text-lg text-base-content'>
                  {aramScore} Points
                </div>
                <div className='text-sm text-base-content/60'>
                  Rank
                  {aramRankTiers.findIndex(r => r.name === currentRank.name) +
                    1}
                  of {aramRankTiers.length}
                </div>
              </div>
              <div className='flex-1 w-full md:w-auto'>
                <RankProgressBar
                  currentRank={currentRank}
                  aramScore={aramScore}
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-base-200 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-base-content'>
                {matchStats.totalGames}
              </div>
              <div className='text-xs text-base-content/60'>Total Games</div>
            </div>
            <div className='bg-base-200 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-success'>
                {matchStats.winRate.toFixed(1)}%
              </div>
              <div className='text-xs text-base-content/60'>Win Rate</div>
            </div>
            <div className='bg-base-200 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-info'>
                {matchStats.averageKda}
              </div>
              <div className='text-xs text-base-content/60'>Avg KDA</div>
            </div>
            <div className='bg-base-200 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-primary'>
                {matchStats.recentForm.filter(f => f.result === 'Win').length}/
                {matchStats.recentForm.length}
              </div>
              <div className='text-xs text-base-content/60'>Recent Form</div>
            </div>
          </div>

          {/* Favorite Champions */}
          {matchStats.favoriteChampions.length > 0 && (
            <div className='bg-base-200 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-base-content mb-4'>
                Favorite Champions
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3'>
                {matchStats.favoriteChampions.map(
                  ({ champion, games, winRate }) => (
                    <div
                      key={champion}
                      className='bg-base-300 rounded-lg p-3 text-center'
                    >
                      <div className='font-semibold text-base-content'>
                        {champion}
                      </div>
                      <div className='text-sm text-base-content/70'>
                        {games} games
                      </div>
                      <div className='text-xs text-base-content/50'>
                        {winRate.toFixed(0)}% WR
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ranks' && (
        <div className='space-y-4'>
          <div className='text-center mb-6'>
            <h3 className='text-xl font-semibold text-base-content mb-2'>
              ARAM Ranking System
            </h3>
            <p className='text-base-content/70'>
              Progress through the ranks by improving your ARAM performance
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
            {aramRankTiers.map(rank => (
              <RankTierCard
                key={rank.name}
                rank={rank}
                isCurrentRank={rank.name === currentRank.name}
                aramScore={aramScore}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'matches' && showMatchHistory && (
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold text-base-content'>
            Recent ARAM Matches
          </h3>
          {matchStats.recentForm.length > 0 ? (
            <div className='space-y-2'>
              {matchStats.recentForm.map((match, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    match.result === 'Win'
                      ? 'bg-success/10 border-l-4 border-success'
                      : 'bg-error/10 border-l-4 border-error'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`font-semibold ${
                        match.result === 'Win' ? 'text-success' : 'text-error'
                      }`}
                    >
                      {match.result}
                    </div>
                    <div className='text-base-content'>{match.champion}</div>
                    <div className='text-base-content/60 text-sm'>
                      {match.kda}
                    </div>
                  </div>
                  <div className='text-base-content/50 text-sm'>
                    Game #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-base-content/60'>
              No ARAM matches found
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && showLeaderboard && (
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold text-base-content'>
            ARAM Leaderboard
          </h3>
          <div className='text-center py-8 text-base-content/60'>
            Leaderboard feature coming soon...
          </div>
        </div>
      )}
    </div>
  );
};

export default AramStats;
