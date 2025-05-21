// Types pour LeftColumn (recentlyPlayed et mastery)

export interface UIRecentlyPlayed {
  name: string;
  games: number;
  winrate: number;
  wins: number;
}

export interface UIMastery {
  championId: number;
  championPoints: number;
}
