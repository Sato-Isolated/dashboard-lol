export interface Badge {
  label: string;
  color: string;
  icon: string;
}

export interface StatsBlockProps {
  kdaParts: string[];
  kdaValue: string | number;
  pKill: string;
  specialBadges: Badge[];
}

export interface KDADisplayProps {
  kills: string;
  deaths: string;
  assists: string;
}

export interface KDARatioProps {
  kdaValue: string | number;
}

export interface ParticipationProps {
  pKill: string;
}

export interface BadgesListProps {
  badges: Badge[];
}

export interface KDAPartsHook {
  kills: string;
  deaths: string;
  assists: string;
}
