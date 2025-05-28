export interface Mastery {
  championId: number;
  championPoints: number;
  championLevel: number;
}

export interface ChampionData {
  id: string;
  key: string;
  name: string;
}

export interface MasteriesResponse {
  success: boolean;
  data: Mastery[];
}

export interface MasteryWithChampion extends Mastery {
  champ?: ChampionData;
}

export interface MasteryStats {
  totalPoints: number;
  totalChampions: number;
  level7Champions: number;
  level5Plus: number;
  avgLevel: number;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'points' | 'level' | 'name';

export interface MasteryStyleConfig {
  badge: string;
  gradient: string;
  icon: any;
  glow: string;
}

export interface MasteryCardProps {
  mastery: MasteryWithChampion;
  index: number;
}

export interface MasteryListRowProps {
  mastery: MasteryWithChampion;
  index: number;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: any;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
  delay: number;
}

export interface ControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
}
