import { ChampionStats, GlobalStats } from '../championsTabTypes';

export const getWinrate = (champ: ChampionStats): number => {
  return champ.games > 0 ? (champ.wins / champ.games) * 100 : 0;
};

export const calculateGlobalStats = (
  stats: ChampionStats[],
  searchTerm: string,
  championDataLookup: Record<string, any>,
): GlobalStats => {
  const filteredStats = searchTerm
    ? stats.filter(champ => {
        const championInfo = championDataLookup[champ.champion];
        const name = championInfo ? championInfo.name : champ.champion;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : stats;

  const totalGames = filteredStats.reduce(
    (acc: number, champ: ChampionStats) => acc + champ.games,
    0,
  );
  const totalWins = filteredStats.reduce(
    (acc: number, champ: ChampionStats) => acc + champ.wins,
    0,
  );
  const totalKills = filteredStats.reduce(
    (acc: number, champ: ChampionStats) => acc + champ.kills,
    0,
  );
  const totalDeaths = filteredStats.reduce(
    (acc: number, champ: ChampionStats) => acc + champ.deaths,
    0,
  );
  const totalAssists = filteredStats.reduce(
    (acc: number, champ: ChampionStats) => acc + champ.assists,
    0,
  );
  const globalWinrate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
  const globalKda =
    filteredStats.length > 0
      ? filteredStats.reduce(
          (acc: number, champ: ChampionStats) => acc + champ.kda * champ.games,
          0,
        ) / totalGames
      : 0;

  return {
    totalGames,
    totalWins,
    totalKills,
    totalDeaths,
    totalAssists,
    globalWinrate,
    globalKda,
  };
};
