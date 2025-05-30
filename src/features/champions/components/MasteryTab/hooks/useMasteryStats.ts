import { useMemo } from 'react';
import type { Mastery } from '../masteryTabTypes';

export interface MasteryStats {
  totalPoints: number;
  totalChampions: number;
  level7Champions: number;
  level5Plus: number;
  avgLevel: number;
}

export const useMasteryStats = (masteries: Mastery[]): MasteryStats => {
  return useMemo(() => {
    const totalPoints = masteries.reduce(
      (acc: number, m: Mastery) => acc + m.championPoints,
      0,
    );
    const totalChampions = masteries.length;
    const level7Champions = masteries.filter(m => m.championLevel >= 7).length;
    const level5Plus = masteries.filter(m => m.championLevel >= 5).length;
    const avgLevel =
      totalChampions > 0
        ? masteries.reduce(
            (acc: number, m: Mastery) => acc + m.championLevel,
            0,
          ) / totalChampions
        : 0;

    return {
      totalPoints,
      totalChampions,
      level7Champions,
      level5Plus,
      avgLevel,
    };
  }, [masteries]);
};
