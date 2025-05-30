import { useMemo } from 'react';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';
import type { MatchStats } from '../matchListTypes';

export const useMatchStats = (matches: UIMatch[]): MatchStats => {
  return useMemo(() => {
    if (!matches || matches.length === 0) {
      return {
        totalGames: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        avgKda: '0.00',
        recentFormWins: 0,
        recentFormTotal: 0,
        mostPlayedChampions: [],
      };
    }

    const totalGames = matches.length;
    const wins = matches.filter(m => m.result === 'Win').length;
    const losses = totalGames - wins;
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

    // Calculate average KDA
    let totalKills = 0,
      totalDeaths = 0,
      totalAssists = 0;
    matches.forEach(match => {
      const kdaParts = match.kda.includes('/')
        ? match.kda.split('/')
        : match.kda.split(':');
      totalKills += Number(kdaParts[0]) || 0;
      totalDeaths += Number(kdaParts[1]) || 0;
      totalAssists += Number(kdaParts[2]) || 0;
    });

    const avgKda =
      totalDeaths === 0
        ? (totalKills + totalAssists).toFixed(2)
        : ((totalKills + totalAssists) / totalDeaths).toFixed(2);

    // Recent form (last 10 games)
    const recentMatches = matches.slice(0, Math.min(10, totalGames));
    const recentFormWins = recentMatches.filter(m => m.result === 'Win').length;
    const recentFormTotal = recentMatches.length;

    // Most played champions
    const championCount: Record<string, { games: number; wins: number }> = {};
    matches.forEach(match => {
      if (!championCount[match.champion]) {
        championCount[match.champion] = { games: 0, wins: 0 };
      }
      championCount[match.champion].games++;
      if (match.result === 'Win') {
        championCount[match.champion].wins++;
      }
    });

    const mostPlayedChampions = Object.entries(championCount)
      .map(([champion, stats]) => ({
        champion,
        games: stats.games,
        winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
      }))
      .sort((a, b) => b.games - a.games)
      .slice(0, 3);

    return {
      totalGames,
      wins,
      losses,
      winRate,
      avgKda,
      recentFormWins,
      recentFormTotal,
      mostPlayedChampions,
    };
  }, [matches]);
};
