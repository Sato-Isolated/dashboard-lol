import { useMemo } from 'react';
import { getAramRank } from '@/features/aram/utils/aramRankSystem';

/**
 * Hook pour récupérer le rang ARAM basé sur le score
 */
export const useAramRank = (aramScore: number) => {
  return useMemo(() => getAramRank(aramScore), [aramScore]);
};
