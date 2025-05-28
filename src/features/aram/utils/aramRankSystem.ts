export type AramRank =
  | 'Poro'
  | 'Frosted'
  | 'Yeti'
  | 'Bridge Guard'
  | 'Icebreaker'
  | 'Abyss Master'
  | 'Bridge Legend'
  | 'Blizzard Spirit';

export interface AramRankInfo {
  name: AramRank;
  min: number;
  max: number;
  color: string;
}

export const aramRankTiers: AramRankInfo[] = [
  { name: 'Poro', min: 0, max: 499, color: '#e0e6eb' },
  { name: 'Frosted', min: 500, max: 999, color: '#b3d0e7' },
  { name: 'Yeti', min: 1000, max: 1499, color: '#8bb6d6' },
  { name: 'Bridge Guard', min: 1500, max: 1999, color: '#5e8ca7' },
  { name: 'Icebreaker', min: 2000, max: 2499, color: '#3e5c7e' },
  { name: 'Abyss Master', min: 2500, max: 2999, color: '#2b3a4b' },
  { name: 'Bridge Legend', min: 3000, max: 3499, color: '#c9e6ff' },
  { name: 'Blizzard Spirit', min: 3500, max: Infinity, color: '#aee9f9' },
];

export function getAramRank(
  score: number,
): AramRankInfo & { displayName: string } {
  const rank =
    aramRankTiers.find(tier => score >= tier.min && score <= tier.max) ||
    aramRankTiers[0];
  return { ...rank, displayName: rank.name };
}
