// Types for LeftColumn (recentlyPlayed and mastery)

export interface UIRecentlyPlayed {
  name: string;
  tagline?: string;
  games: number;
  winrate: number;
  wins: number;
}

export interface UIMastery {
  championId: number;
  championPoints: number;
}
