export interface ChampionFile {
  type: string;
  format: string;
  version: string;
  data: Record<string, ChampionData>;
}

export interface ChampionData {
  version: string;
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: Info;
  image: Image;
  tags: Tag[];
  partype: string;
  stats: Record<string, number>;
}

export interface Info {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

export interface Image {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Tag =
  | 'Assassin'
  | 'Fighter'
  | 'Mage'
  | 'Marksman'
  | 'Support'
  | 'Tank';
