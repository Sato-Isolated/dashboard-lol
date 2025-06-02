import { ChampionData } from '@/types/data/champion';

export const getSummonerIcon = (iconId: number) =>
  '/assets/profileicon/' + iconId + '.png';

export const getChampionIcon = (champion: string) =>
  `/assets/champion/${champion}.png`;

export const getRegion = () => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.split('/');
    if (path.length > 1 && path[1]) {
      return path[1];
    }
  }
  return 'euw1';
};

import type { Match } from '@/types/api/matchTypes';
import type { UIMatch, UIPlayer } from '@/features/matches/types/uiMatchTypes';

export function mapRiotMatchToUIMatch(
  riotMatch: Match,
  summonerName: string,
): UIMatch {
  const participant = riotMatch.info.participants.find(
    p => p.riotIdGameName === summonerName,
  );
  const redTeam = riotMatch.info.participants.filter(p => p.teamId === 200);
  const blueTeam = riotMatch.info.participants.filter(p => p.teamId === 100);
  const win = participant?.win;
  const kda = participant
    ? `${participant.kills}/${participant.deaths}/${participant.assists}`
    : '-/-/-';
  const players: UIPlayer[] = [...redTeam, ...blueTeam].map(p => ({
    name: p.riotIdGameName || p.summonerName || '?',
    tagline: p.riotIdTagline || undefined,
    champion: p.championName,
    kda: `${p.kills}/${p.deaths}/${p.assists}`,
    cs: p.totalMinionsKilled + p.neutralMinionsKilled,
    damage: p.totalDamageDealtToChampions,
    gold: p.goldEarned,
    items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
    team: p.teamId === 200 ? 'Red' : 'Blue',
    win: p.win,
    mvp: false,
    spell1: p.summoner1Id,
    spell2: p.summoner2Id,
    rune1: p.perks?.styles?.[0]?.selections?.[0]?.perk ?? 0,
    rune2: p.perks?.styles?.[1]?.style ?? 0,
    doubleKills: p.doubleKills,
    tripleKills: p.tripleKills,
    quadraKills: p.quadraKills,
    pentaKills: p.pentaKills,
    killingSprees: p.killingSprees,
  }));
  const result = win ? 'Win' : 'Loss';
  const date = riotMatch.info.gameEndTimestamp
    ? new Date(riotMatch.info.gameEndTimestamp).toLocaleDateString()
    : '';
  const mode = riotMatch.info.gameMode || '';
  const duration = riotMatch.info.gameDuration
    ? `${Math.floor(riotMatch.info.gameDuration / 60)}m ${
        riotMatch.info.gameDuration % 60
      }s`
    : '';
  const teamKills = redTeam.reduce((acc, p) => acc + p.kills, 0);
  const enemyKills = blueTeam.reduce((acc, p) => acc + p.kills, 0);
  const teamGold = redTeam.reduce((acc, p) => acc + p.goldEarned, 0);
  const enemyGold = blueTeam.reduce((acc, p) => acc + p.goldEarned, 0);
  let towers = { red: 0, blue: 0 };
  let dragons = { red: 0, blue: 0 };
  if (riotMatch.info.teams && riotMatch.info.teams.length === 2) {
    const red = riotMatch.info.teams.find(t => t.teamId === 200);
    const blue = riotMatch.info.teams.find(t => t.teamId === 100);
    towers = {
      red: red?.objectives?.tower?.kills ?? 0,
      blue: blue?.objectives?.tower?.kills ?? 0,
    };
    dragons = {
      red: red?.objectives?.dragon?.kills ?? 0,
      blue: blue?.objectives?.dragon?.kills ?? 0,
    };
  }
  return {
    gameId: riotMatch.metadata.matchId,
    champion: participant?.championName || '?',
    result,
    kda,
    date,
    mode,
    duration,
    team: win ? 'Red' : 'Blue',
    teamKills,
    teamGold,
    enemyKills,
    enemyGold,
    players,
    details: {
      duration,
      gold: { red: teamGold, blue: enemyGold },
      kills: { red: teamKills, blue: enemyKills },
      towers,
      dragons,
    },
  };
}

import summonerData from '../../../public/assets/data/en_US/summoner.json';

const spellIdToImg: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  // Use an explicit type for summonerData.data
  const data: Record<string, { key: string; image: { full: string } }> = (
    summonerData as {
      data: Record<string, { key: string; image: { full: string } }>;
    }
  ).data;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const spell = data[key];
      if (spell.key && spell.image && spell.image.full) {
        map[spell.key] = spell.image.full;
      }
    }
  }
  return map;
})();

export function getSummonerSpellImage(id: number | string): string | undefined {
  const fileName = spellIdToImg[String(id)];
  return fileName ? `/assets/spell/${fileName}` : undefined;
}

// TODO: Re-enable when runesReforged.json data is available
import runesData from '../../../public/assets/data/en_US/runesReforged.json';

const runeIdToIcon: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  // Use an explicit type for runesData
  const data: Array<{
    id: number;
    icon: string;
    slots?: Array<{ runes?: Array<{ id: number; icon: string }> }>;
  }> = runesData as Array<{
    id: number;
    icon: string;
    slots?: Array<{ runes?: Array<{ id: number; icon: string }> }>;
  }>;
  for (const style of data) {
    // Main style (tree)
    if (style.id && style.icon) {
      map[String(style.id)] = style.icon;
    }
    // Runes in slots
    if (style.slots && Array.isArray(style.slots)) {
      for (const slot of style.slots) {
        if (slot.runes && Array.isArray(slot.runes)) {
          for (const rune of slot.runes) {
            if (rune.id && rune.icon) {
              map[String(rune.id)] = rune.icon;
            }
          }
        }
      }
    }
  }
  return map;
})();

export function getRuneIcon(id: number | string): string | undefined {
  const iconPath = runeIdToIcon[String(id)];
  return iconPath ? `/assets/${iconPath}` : undefined;
}
