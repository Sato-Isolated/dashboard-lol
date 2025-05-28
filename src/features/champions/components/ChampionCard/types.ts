import type { ChampionData } from '@/shared/types/data/champion';

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

export interface ChampionAvatarProps {
  championData: ChampionData;
  size: 'small' | 'medium' | 'large';
  bordered?: boolean;
}

export interface ChampionInfoProps {
  championData: ChampionData;
  variant: 'compact' | 'default' | 'detailed';
  mastery?: ChampionMastery;
  showMastery: boolean;
}

export interface ChampionStatsDisplayProps {
  stats: ChampionStats;
  variant: 'compact' | 'default' | 'detailed';
}

export interface ChampionMasteryDisplayProps {
  mastery: ChampionMastery;
  variant: 'compact' | 'default' | 'detailed';
}

export interface ChampionTagsProps {
  tags: string[];
  maxTags?: number;
}

export interface ChampionDifficultyProps {
  difficulty: number;
}

export interface ChampionCardSkeletonProps {
  variant?: 'compact' | 'default' | 'detailed';
}

export interface WinRateHook {
  winRate: number;
  formattedWinRate: string;
}
