'use client';
import { useState, useMemo, useCallback } from 'react';
import { ChampionStats, SortConfig } from '../championsTabTypes';
import { getWinrate } from '../utils/calculations';

export const useChampionSorting = (
  stats: ChampionStats[],
  championDataLookup: Record<string, any>,
) => {
  const [sortKey, setSortKey] = useState<string>('games');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Memoized sorted and filtered stats
  const sortedStats = useMemo(() => {
    return [...stats]
      .filter(champ => {
        if (!searchTerm) {
          return true;
        }
        const championInfo = championDataLookup[champ.champion];
        const name = championInfo ? championInfo.name : champ.champion;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        let aValue = a[sortKey as keyof ChampionStats] ?? 0;
        let bValue = b[sortKey as keyof ChampionStats] ?? 0;
        if (sortKey === 'winrate') {
          aValue = getWinrate(a);
          bValue = getWinrate(b);
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDir === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
  }, [stats, sortKey, sortDir, searchTerm, championDataLookup]);

  // Memoized sort handler
  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir(key === 'champion' ? 'asc' : 'desc');
      }
    },
    [sortKey],
  );

  // Memoized sort icon function
  const sortIcon = useCallback(
    (key: string) => {
      if (sortKey !== key) {
        return '⇅';
      }
      return sortDir === 'asc' ? '▲' : '▼';
    },
    [sortKey, sortDir],
  );

  return {
    sortedStats,
    searchTerm,
    setSearchTerm,
    handleSort,
    sortIcon,
    sortConfig: { key: sortKey, direction: sortDir } as SortConfig,
  };
};
