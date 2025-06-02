export const COLUMN_STYLES = {
  summoner: { width: '25%' },
  kda: { width: '15%' },
  cs: { width: '10%' },
  damage: { width: '15%' },
  gold: { width: '15%' },
  items: { width: '20%' },
} as const;

export const TEAM_COLORS = {
  red: {
    gradient: 'from-error/10 via-base-100/95 to-error/5',
    border: 'border-error/30',
    header: 'from-error/20 to-error/10',
    text: 'text-error',
    headerBorder: 'border-error/30',
    bgEffect: 'bg-error/20',
    bgEffectSecondary: 'bg-error/15',
  },
  blue: {
    gradient: 'from-info/10 via-base-100/95 to-info/5',
    border: 'border-info/30',
    header: 'from-info/20 to-info/10',
    text: 'text-info',
    headerBorder: 'border-info/30',
    bgEffect: 'bg-info/20',
    bgEffectSecondary: 'bg-info/15',
  },
} as const;

export type TeamColorType = keyof typeof TEAM_COLORS;
