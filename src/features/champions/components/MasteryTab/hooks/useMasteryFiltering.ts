import { useMemo } from 'react';
import championData from '@/../public/assets/data/en_US/champion.json';
import type { Mastery, ChampionData, SortOption } from '../masteryTabTypes';

export const useMasteryFiltering = (
  masteries: Mastery[],
  searchTerm: string,
  sortBy: SortOption,
) => {
  // Memoized champion data lookup for performance
  const championDataLookup = useMemo(() => {
    return Object.values(championData.data) as ChampionData[];
  }, []);

  // Memoized masteries with champions
  const masteriesWithChampions = useMemo(() => {
    return masteries.map((m: Mastery) => {
      const champ = championDataLookup.find(
        (c: ChampionData) => parseInt(c.key) === m.championId,
      );
      return { ...m, champ };
    });
  }, [masteries, championDataLookup]);

  // Filtered and sorted masteries
  const filteredAndSortedMasteries = useMemo(() => {
    let filtered = masteriesWithChampions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(m =>
        (m.champ?.name || String(m.championId))
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.championPoints - a.championPoints;
        case 'level':
          return b.championLevel - a.championLevel;
        case 'name':
          const nameA = a.champ?.name || String(a.championId);
          const nameB = b.champ?.name || String(b.championId);
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });
  }, [masteriesWithChampions, searchTerm, sortBy]);

  return {
    masteriesWithChampions,
    filteredAndSortedMasteries,
  };
};
