import { useMemo } from 'react';
import type { UIMatch } from '@/features/matches/types/ui-match.types';

/**
 * Hook to generate stable keys for matches to prevent rerender issues
 * Uses multiple match properties to create unique, stable identifiers
 */
export const useStableMatchKeys = (matches: UIMatch[]) => {
  return useMemo(() => {
    if (!matches || matches.length === 0) return [];

    return matches.map((match, index) => {
      // Create a more robust stable key using multiple properties
      const keyParts = [
        match.gameId || 'unknown',
        match.champion || 'unknown',
        match.result || 'unknown',
        match.date || 'unknown',
        match.kda || 'unknown',
        index.toString(),
      ];

      const stableKey = keyParts.join('-');

      return {
        ...match,
        stableKey,
        // Add a hash for quick comparison
        matchHash: btoa(
          JSON.stringify({
            gameId: match.gameId,
            champion: match.champion,
            result: match.result,
            kda: match.kda,
          })
        ).slice(0, 8),
      };
    });
  }, [matches]);
};

/**
 * Hook to detect significant changes in match data
 * Helps prevent unnecessary rerenders while ensuring updates are reflected
 */
export const useMatchChangeDetection = (matches: UIMatch[]) => {
  return useMemo(() => {
    if (!matches || matches.length === 0) {
      return { hasMatches: false, changeId: 'empty', matchCount: 0 };
    }

    // Create a change detection ID based on match count and first few matches
    const significantMatches = matches.slice(0, 5);
    const changeData = {
      count: matches.length,
      firstMatchIds: significantMatches
        .map(m => m.gameId || m.champion)
        .join(','),
      lastUpdate: Date.now(),
    };

    const changeId = btoa(JSON.stringify(changeData)).slice(0, 12);

    return {
      hasMatches: true,
      changeId,
      matchCount: matches.length,
      significantMatches,
    };
  }, [matches]);
};
