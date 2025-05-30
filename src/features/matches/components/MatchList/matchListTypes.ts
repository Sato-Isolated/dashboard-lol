import type { UIMatch } from '@/features/matches/types/uiMatchTypes';

export interface MatchListProps {
  matches: UIMatch[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  showStats?: boolean;
  maxInitialItems?: number;
  enablePagination?: boolean;
  className?: string;
  emptyStateMessage?: string;
  title?: string;
}

export interface MatchStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  avgKda: string;
  recentFormWins: number;
  recentFormTotal: number;
  mostPlayedChampions: Array<{
    champion: string;
    games: number;
    winRate: number;
  }>;
}

export interface MatchItemProps {
  match: UIMatch;
  index?: number;
}

export interface MatchStatsCardProps {
  stats: MatchStats;
}
