import { UIMatch, UIPlayer } from '@/features/matches/types/uiMatchTypes';

export interface MatchCardProps {
  match: UIMatch;
}

export interface MatchCardState {
  open: boolean;
  tab: string;
}

export interface CalculatedMatchData {
  redTeam: UIPlayer[];
  blueTeam: UIPlayer[];
  kdaParts: string[];
  kdaValue: string;
  pKill: string;
  mainPlayer: UIPlayer | undefined;
  specialBadges: PlayerBadge[];
}

export interface PlayerBadge {
  label: string;
  color: string;
  icon: string;
}

export interface AnimatedBackgroundEffectsProps {
  isWin: boolean;
}

export interface ResultBadgeProps {
  isWin: boolean;
}

export interface ExpandCollapseButtonProps {
  open: boolean;
  onClick: () => void;
}

export interface CollapsibleContentProps {
  open: boolean;
  tab: string;
  setTab: (tab: string) => void;
  match: UIMatch;
  redTeam: UIPlayer[];
  blueTeam: UIPlayer[];
}
