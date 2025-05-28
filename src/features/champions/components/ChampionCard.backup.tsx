import React from 'react';
import Image from 'next/image';
import { getChampionIcon } from '@/shared/lib/utils/helpers';
import type { ChampionData } from '@/shared/types/data/champion';

// Add CSS styles
const _styles = `
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
`;

// Helper function to format numbers with commas consistently
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

// Champion Statistics Interface (from ChampionsTab)
export interface ChampionStats {
  champion: string;
  games: number;
  wins: number;
  kda: number;
  kills: number;
  deaths: number;
  assists: number;
}

// Champion Mastery Interface (from MasteryTab)
export interface ChampionMastery {
  championId: number;
  championPoints: number;
  championLevel: number;
}

// Combined Champion Data for the Card
export interface ChampionCardData {
  championData: ChampionData;
  stats?: ChampionStats;
  mastery?: ChampionMastery;
}

export interface ChampionCardProps {
  champion: ChampionCardData;
  variant?: 'compact' | 'default' | 'detailed';
  loading?: boolean;
  onClick?: () => void;
  showStats?: boolean;
  showMastery?: boolean;
}

// Loading skeleton component
const ChampionCardSkeleton: React.FC<{
  variant?: 'compact' | 'default' | 'detailed';
}> = ({ variant = 'default' }) => {
  if (variant === 'compact') {
    return (
      <div className='card bg-base-200 rounded-xl shadow p-3 animate-pulse'>
        <div className='flex items-center gap-3'>
          <div className='skeleton w-12 h-12 rounded-lg' />
          <div className='flex-1'>
            <div className='skeleton h-4 w-20 mb-1' />
            <div className='skeleton h-3 w-16' />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className='card bg-base-200 rounded-xl shadow-xl p-6 animate-pulse'>
        <div className='flex flex-col items-center gap-4'>
          <div className='skeleton w-24 h-24 rounded-xl' />
          <div className='text-center'>
            <div className='skeleton h-6 w-32 mb-2' />
            <div className='skeleton h-4 w-40 mb-4' />
          </div>
          <div className='flex gap-2'>
            <div className='skeleton h-6 w-16 rounded-full' />
            <div className='skeleton h-6 w-16 rounded-full' />
          </div>
          <div className='w-full space-y-2'>
            <div className='skeleton h-10 w-full rounded-lg' />
            <div className='skeleton h-10 w-full rounded-lg' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='card bg-base-200 rounded-xl shadow p-4 animate-pulse'>
      <div className='flex items-center gap-4'>
        <div className='skeleton w-16 h-16 rounded-xl' />
        <div className='flex-1'>
          <div className='skeleton h-5 w-24 mb-2' />
          <div className='skeleton h-4 w-32 mb-3' />
          <div className='flex gap-2'>
            <div className='skeleton h-6 w-16 rounded-full' />
            <div className='skeleton h-6 w-16 rounded-full' />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main ChampionCard Component
export const ChampionCard: React.FC<ChampionCardProps> = ({
  champion,
  variant = 'default',
  loading = false,
  onClick,
  showStats = true,
  showMastery = true,
}) => {
  if (loading) {
    return <ChampionCardSkeleton variant={variant} />;
  }

  const { championData, stats, mastery } = champion;
  const winRate =
    stats && stats.games > 0 ? (stats.wins / stats.games) * 100 : 0;

  // Compact variant - minimal display
  if (variant === 'compact') {
    return (
      <div
        className={`card bg-base-200 rounded-xl shadow transition-all duration-200 p-3 ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick}
      >
        <div className='flex items-center gap-3'>
          <div className='avatar'>
            <div className='w-12 h-12 rounded-lg border-2 border-primary/30'>
              <Image
                src={getChampionIcon(championData.id)}
                alt={championData.name}
                width={48}
                height={48}
                className='object-cover rounded-lg'
              />
            </div>
          </div>
          <div className='flex-1 min-w-0'>
            <h4 className='font-semibold text-base-content truncate'>
              {championData.name}
            </h4>
            {showMastery && mastery && (
              <div className='flex items-center gap-2 mt-1'>
                <span className='badge badge-primary badge-xs'>
                  M{mastery.championLevel}
                </span>
                <span className='text-xs text-base-content/60'>
                  {formatNumber(mastery.championPoints)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant - full information display
  if (variant === 'detailed') {
    return (
      <div
        className={`card bg-base-200 rounded-xl shadow-xl transition-all duration-300 p-6 ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick}
      >
        <div className='flex flex-col items-center gap-4'>
          {/* Champion Image */}
          <div className='avatar'>
            <div className='w-24 h-24 rounded-xl border-4 border-primary shadow-lg'>
              <Image
                src={getChampionIcon(championData.id)}
                alt={championData.name}
                width={96}
                height={96}
                className='object-cover rounded-xl'
              />
            </div>
          </div>

          {/* Champion Info */}
          <div className='text-center'>
            <h3 className='text-xl font-bold text-base-content'>
              {championData.name}
            </h3>
            <p className='text-sm text-base-content/70 italic'>
              {championData.title}
            </p>
            <p className='text-xs text-base-content/60 mt-2 max-w-xs'>
              {championData.blurb}
            </p>
          </div>

          {/* Tags */}
          <div className='flex flex-wrap gap-2 justify-center'>
            {championData.tags.map(tag => (
              <span key={tag} className='badge badge-outline badge-sm'>
                {tag}
              </span>
            ))}
          </div>

          {/* Statistics */}
          <div className='w-full space-y-3'>
            {showStats && stats && (
              <div className='bg-base-100 rounded-lg p-4'>
                <h4 className='font-semibold text-sm text-base-content/80 mb-3'>
                  Performance Stats
                </h4>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='stat-item'>
                    <span className='text-xs text-base-content/60'>Games</span>
                    <span className='font-bold text-base-content'>
                      {stats.games}
                    </span>
                  </div>
                  <div className='stat-item'>
                    <span className='text-xs text-base-content/60'>
                      Win Rate
                    </span>
                    <span className='font-bold text-success'>
                      {winRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className='stat-item'>
                    <span className='text-xs text-base-content/60'>KDA</span>
                    <span className='font-bold text-info'>
                      {stats.kda.toFixed(2)}
                    </span>
                  </div>
                  <div className='stat-item'>
                    <span className='text-xs text-base-content/60'>
                      Avg K/D/A
                    </span>
                    <span className='font-bold text-base-content'>
                      {(stats.kills / stats.games).toFixed(1)}/
                      {(stats.deaths / stats.games).toFixed(1)}/
                      {(stats.assists / stats.games).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {showMastery && mastery && (
              <div className='bg-base-100 rounded-lg p-4'>
                <h4 className='font-semibold text-sm text-base-content/80 mb-3'>
                  Mastery Info
                </h4>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='badge badge-primary'>
                      Level {mastery.championLevel}
                    </span>
                    <span className='text-sm text-base-content/70'>
                      {formatNumber(mastery.championPoints)} points
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Champion Difficulty */}
          <div className='w-full'>
            <div className='flex items-center justify-between text-xs text-base-content/60 mb-1'>
              <span>Difficulty</span>
              <span>{championData.info.difficulty}/10</span>
            </div>
            <div className='w-full bg-base-300 rounded-full h-2'>
              <div
                className='bg-primary h-2 rounded-full transition-all duration-300'
                style={{
                  width: `${(championData.info.difficulty / 10) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant - balanced display
  return (
    <div
      className={`card bg-base-200 rounded-xl shadow transition-all duration-200 p-4 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className='flex items-center gap-4'>
        {/* Champion Image */}
        <div className='avatar'>
          <div className='w-16 h-16 rounded-xl border-2 border-primary/30 shadow'>
            <Image
              src={getChampionIcon(championData.id)}
              alt={championData.name}
              width={64}
              height={64}
              className='object-cover rounded-xl'
            />
          </div>
        </div>

        {/* Champion Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between mb-2'>
            <div>
              <h3 className='font-bold text-base-content truncate'>
                {championData.name}
              </h3>
              <p className='text-sm text-base-content/70 italic truncate'>
                {championData.title}
              </p>
            </div>
            {showMastery && mastery && (
              <span className='badge badge-primary badge-lg'>
                M{mastery.championLevel}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className='flex flex-wrap gap-1 mb-3'>
            {championData.tags.slice(0, 2).map(tag => (
              <span key={tag} className='badge badge-outline badge-xs'>
                {tag}
              </span>
            ))}
          </div>

          {/* Stats Row */}
          <div className='flex gap-3 text-sm'>
            {showStats && stats && (
              <>
                <div className='text-center'>
                  <div className='font-bold text-base-content'>
                    {stats.games}
                  </div>
                  <div className='text-xs text-base-content/60'>Games</div>
                </div>
                <div className='text-center'>
                  <div className='font-bold text-success'>
                    {winRate.toFixed(1)}%
                  </div>
                  <div className='text-xs text-base-content/60'>Win Rate</div>
                </div>
                <div className='text-center'>
                  <div className='font-bold text-info'>
                    {stats.kda.toFixed(2)}
                  </div>
                  <div className='text-xs text-base-content/60'>KDA</div>
                </div>
              </>
            )}
            {showMastery && mastery && (
              <div className='text-center'>
                <div className='font-bold text-base-content'>
                  {formatNumber(mastery.championPoints)}
                </div>
                <div className='text-xs text-base-content/60'>Points</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChampionCard);
