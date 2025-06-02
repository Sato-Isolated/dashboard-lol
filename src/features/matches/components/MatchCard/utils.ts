// Utility functions for MatchCard calculations and transformations
import { UIPlayer } from '@/features/matches/types/uiMatchTypes';
import { PlayerBadge } from './matchCardTypes';
import { PLAYER_BADGES } from './constants';

/**
 * Calculates team divisions from players array
 */
export const calculateTeams = (players: UIPlayer[]) => ({
  redTeam: players.filter(p => p.team === 'Red'),
  blueTeam: players.filter(p => p.team === 'Blue'),
});

/**
 * Calculates KDA values and participation percentage
 */
export const calculateKDA = (kda: string, teamKills?: number) => {
  // Robust KDA split (supports "/" or ":")
  const parts = kda.includes('/') ? kda.split('/') : kda.split(':');

  // Calculate real KDA (K+A)/D
  const kills = Number(parts[0]);
  const deaths = Number(parts[1]);
  const assists = Number(parts[2]);
  const kdaValue =
    deaths === 0 ? kills + assists : ((kills + assists) / deaths).toFixed(2);

  // Calculate real P/Kill%
  let participation = '--';
  if (teamKills && teamKills > 0) {
    participation = Math.round(
      ((kills + assists) / teamKills) * 100,
    ).toString();
  }

  return {
    kdaParts: parts,
    kdaValue,
    pKill: participation,
  };
};

/**
 * Calculates player achievement badges based on performance
 */
export const calculatePlayerBadges = (
  player: UIPlayer | undefined,
): PlayerBadge[] => {
  if (!player) {
    return [];
  }

  const badges: PlayerBadge[] = [];

  if (player.pentaKills && player.pentaKills > 0) {
    badges.push(PLAYER_BADGES.PENTA_KILL);
  } else if (player.quadraKills && player.quadraKills > 0) {
    badges.push(PLAYER_BADGES.QUADRA_KILL);
  } else if (player.tripleKills && player.tripleKills > 0) {
    badges.push(PLAYER_BADGES.TRIPLE_KILL);
  } else if (player.doubleKills && player.doubleKills > 0) {
    badges.push(PLAYER_BADGES.DOUBLE_KILL);
  } else if (player.mvp) {
    badges.push(PLAYER_BADGES.MVP);
  } else if (player.killingSprees && player.killingSprees >= 8) {
    badges.push(PLAYER_BADGES.UNSTOPPABLE);
  }

  return badges;
};

/**
 * Finds the main player from players array based on champion
 */
export const findMainPlayer = (
  players: UIPlayer[],
  champion: string,
): UIPlayer | undefined => {
  return players.find(p => p.champion === champion);
};

/**
 * Gets appropriate styles based on match result
 */
export const getMatchResultStyles = (isWin: boolean) => {
  return isWin
    ? {
        background:
          'bg-gradient-to-br from-success/15 via-base-100/95 to-success/10',
        border: 'border-success/30',
        ring: 'ring-success/40',
        badge: {
          background: 'bg-success/30',
          text: 'text-success',
          border: 'border border-success/50',
          shadow: 'shadow-success/30',
        },
      }
    : {
        background:
          'bg-gradient-to-br from-error/15 via-base-100/95 to-error/10',
        border: 'border-error/30',
        ring: 'ring-error/40',
        badge: {
          background: 'bg-error/30',
          text: 'text-error',
          border: 'border border-error/50',
          shadow: 'shadow-error/30',
        },
      };
};

/**
 * Determines if a match result is a win
 */
export const isMatchWin = (result: string): boolean => {
  return result === 'Win';
};