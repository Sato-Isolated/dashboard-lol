import { useMemo } from 'react';
import { UIMatch } from '@/features/matches/types/uiMatchTypes';
import { CalculatedMatchData } from '../matchCardTypes';
import {
  calculateTeams,
  calculateKDA,
  findMainPlayer,
  calculatePlayerBadges,
} from '../utils';

/**
 * Custom hook to calculate and memoize all match-related data
 */
export const useMatchCalculations = (match: UIMatch): CalculatedMatchData => {
  // Memoize team calculations
  const { redTeam, blueTeam } = useMemo(
    () => calculateTeams(match.players),
    [match.players],
  );

  // Memoize KDA calculations
  const { kdaParts, kdaValue, pKill } = useMemo(
    () => calculateKDA(match.kda, match.teamKills),
    [match.kda, match.teamKills],
  );

  // Memoize main player and special badges
  const { mainPlayer, specialBadges } = useMemo(() => {
    const player = findMainPlayer(match.players, match.champion);
    const badges = calculatePlayerBadges(player);

    return {
      mainPlayer: player,
      specialBadges: badges,
    };
  }, [match.players, match.champion]);

  return {
    redTeam,
    blueTeam,
    kdaParts,
    kdaValue: String(kdaValue),
    pKill,
    mainPlayer,
    specialBadges,
  };
};
