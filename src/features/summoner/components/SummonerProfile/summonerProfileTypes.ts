import type { UIRecentlyPlayed } from '@/types/sidebarTypes';

export interface RecentlyPlayedRowProps {
  player: UIRecentlyPlayed;
  effectiveRegion: string;
  effectiveTagline: string;
  index: number;
}

export interface RankBadgeCardProps {
  aramScore: number;
  leagues: any; // TODO: Type this according to your actual leagues type
}

export interface RecentlyPlayedCardProps {
  recentlyPlayed: UIRecentlyPlayed[];
  effectiveRegion: string;
  effectiveTagline: string;
}

export interface UseRecentlyPlayedOptions {
  effectiveName: string;
  effectiveRegion: string;
  effectiveTagline: string;
  limit?: number;
}

export interface UseRecentlyPlayedReturn {
  recentlyPlayed: UIRecentlyPlayed[];
  loading: boolean;
  error: string | null;
  averageWinrate: number;
}
