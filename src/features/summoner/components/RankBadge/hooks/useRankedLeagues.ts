import { useMemo } from 'react';
import type { League } from '../types';

/**
 * Hook pour traiter et filtrer les ligues ranked
 */
export const useRankedLeagues = (leagues: League[]) => {
  return useMemo(() => {
    if (!leagues || leagues.length === 0) {
      return [];
    }
    return leagues;
  }, [leagues]);
};
