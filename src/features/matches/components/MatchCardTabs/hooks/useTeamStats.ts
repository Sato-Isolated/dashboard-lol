import { useMemo } from 'react';
import type { TeamStats } from '../matchCardTabsTypes';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';

export const useTeamStats = (match: UIMatch): TeamStats => {
  return useMemo(
    () => ({
      red: {
        kills: match.details.kills.red,
        gold: match.details.gold.red,
      },
      blue: {
        kills: match.details.kills.blue,
        gold: match.details.gold.blue,
      },
    }),
    [
      match.details.kills.red,
      match.details.gold.red,
      match.details.kills.blue,
      match.details.gold.blue,
    ],
  );
};
