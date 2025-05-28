export interface RankBadgeProps {
  aramScore: number;
  leagues: League[];
}

export interface League {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}
