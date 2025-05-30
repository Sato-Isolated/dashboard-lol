import { UIMatch, UIPlayer } from '@/features/matches/types/uiMatchTypes';

export interface MatchCardTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  match: UIMatch;
  redTeam: UIPlayer[];
  blueTeam: UIPlayer[];
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface TeamStats {
  red: {
    kills: number;
    gold: number;
  };
  blue: {
    kills: number;
    gold: number;
  };
}

export interface TabNavigationProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface OverviewTabProps {
  match: UIMatch;
  redTeam: UIPlayer[];
  blueTeam: UIPlayer[];
  teamStats: TeamStats;
}

export interface AnalysisTabProps {
  match: UIMatch;
}

export interface BuildTabProps {
  // For future implementation
}
