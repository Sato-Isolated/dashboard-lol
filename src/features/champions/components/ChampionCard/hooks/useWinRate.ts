import { useMemo } from 'react';
import { calculateWinRate } from '../utils';
import type { ChampionStats } from '../types';

export const useWinRate = (stats?: ChampionStats): number => {
  const winRate = useMemo(() => {
    return stats ? calculateWinRate(stats.wins, stats.games) : 0;
  }, [stats]);

  return winRate;
};
