import { useMemo } from 'react';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';
import type { MatchStats } from '../matchHistoryTypes';

// Enhanced stats computation function with modern animations
const computeMatchStats = (matches: UIMatch[]): MatchStats => {
  if (!matches || matches.length === 0) {
    return {
      kda: '-',
      winrate: '-',
      championPool: [],
      totalMatches: 0,
      wins: 0,
      losses: 0,
      avgCs: 0,
    };
  }

  let kills = 0;
  let deaths = 0;
  let assists = 0;
  let wins = 0;
  let totalCs = 0;
  const championCount: Record<string, number> = {};

  matches.forEach(match => {
    // Parse KDA from string format
    const [k, d, a] = match.kda.split('/').map(Number);
    kills += k || 0;
    deaths += d || 0;
    assists += a || 0;

    // Count wins using the result field
    if (match.result === 'Win') {
      wins++;
    }

    // Get CS from player data
    const playerCs =
      match.players?.find(p => p.name === match.champion)?.cs || 0;
    totalCs += playerCs;

    // Track champion usage
    championCount[match.champion] = (championCount[match.champion] || 0) + 1;
  });

  const kda =
    deaths === 0
      ? (kills + assists).toFixed(2)
      : ((kills + assists) / deaths).toFixed(2);

  const winrate = ((wins / matches.length) * 100).toFixed(1) + '%';
  const avgCs = Math.round(totalCs / matches.length);

  // Get top 3 most played champions
  const championPool = Object.entries(championCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([champion]) => champion);

  return {
    kda,
    winrate,
    championPool,
    totalMatches: matches.length,
    wins,
    losses: matches.length - wins,
    avgCs,
  };
};

export const useMatchStats = (matches: UIMatch[]): MatchStats => {
  return useMemo(() => computeMatchStats(matches), [matches]);
};
