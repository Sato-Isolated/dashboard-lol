// types/ui-match.ts

export interface UIMatch {
  champion: string;
  result: "Win" | "Loss";
  kda: string;
  date: string;
  mode: string;
  duration: string;
  team: "Red" | "Blue";
  teamKills: number;
  teamGold: number;
  enemyKills: number;
  enemyGold: number;
  players: UIPlayer[];
  details: {
    duration: string;
    gold: {
      red: number;
      blue: number;
    };
    kills: {
      red: number;
      blue: number;
    };
    towers: {
      red: number;
      blue: number;
    };
    dragons: {
      red: number;
      blue: number;
    };
  };
}

export interface UIPlayer {
  name: string;
  champion: string;
  kda: string;
  cs: number;
  damage: number;
  gold: number;
  items: number[];
  team: "Red" | "Blue";
  win: boolean;
  mvp: boolean;
}