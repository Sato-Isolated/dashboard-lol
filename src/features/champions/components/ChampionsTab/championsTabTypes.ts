export interface ChampionStats {
  champion: string;
  games: number;
  wins: number;
  kda: number;
  kills: number;
  deaths: number;
  assists: number;
}

export interface GlobalStats {
  totalGames: number;
  totalWins: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  globalWinrate: number;
  globalKda: number;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface ChampionRowProps {
  champ: ChampionStats;
  championInfo?: any;
  getWinrate: (champ: ChampionStats) => number;
  index: number;
}

export interface ChampionStatsResponse {
  success: boolean;
  data: ChampionStats[];
}

export interface UseChampionStatsParams {
  region: string;
  name: string;
  tagline: string;
}
