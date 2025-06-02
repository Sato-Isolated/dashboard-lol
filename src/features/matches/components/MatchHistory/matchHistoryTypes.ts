export interface MatchStats {
  kda: string;
  winrate: string;
  championPool: string[];
  totalMatches: number;
  wins: number;
  losses: number;
  avgCs: number;
}

export interface StatsCardConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  gradient: string;
  iconColor: string;
  valueColor: string;
}
