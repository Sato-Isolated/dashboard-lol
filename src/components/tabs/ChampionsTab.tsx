"use client";
import React, { useEffect, useState } from "react";
import championData from "@/../public/assets/data/en_US/champion.json";
import { getChampionIcon } from "@/utils/helper";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import Image from "next/image";

interface ChampionStats {
  champion: string;
  games: number;
  wins: number;
  kda: number;
  kills: number;
  deaths: number;
  assists: number;
}

const ChampionsTab: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const [stats, setStats] = useState<ChampionStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("games");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const controller = new AbortController();
    if (!effectiveName || !effectiveRegion || !effectiveTagline) return;
    setLoading(true);
    setError(null);
    fetch(
      `/api/stats/champions?name=${encodeURIComponent(
        effectiveName
      )}&region=${encodeURIComponent(
        effectiveRegion
      )}&tagline=${encodeURIComponent(effectiveTagline)}`,
      { signal: controller.signal }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error while loading stats");
        return res.json();
      })
      .then((data) => {
        setStats(data.data || []);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError(e.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  const getWinrate = (champ: ChampionStats) =>
    champ.games > 0 ? (champ.wins / champ.games) * 100 : 0;

  const sortedStats = [...stats].sort((a, b) => {
    let aValue = a[sortKey as keyof ChampionStats] ?? 0;
    let bValue = b[sortKey as keyof ChampionStats] ?? 0;
    if (sortKey === "winrate") {
      aValue = getWinrate(a);
      bValue = getWinrate(b);
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDir === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDir === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "champion" ? "asc" : "desc");
    }
  };

  if (loading)
    return <div className="loading loading-spinner loading-lg mx-auto my-8" />;
  if (error) return <div className="alert alert-error">Error: {error}</div>;
  if (!stats || stats.length === 0)
    return <div className="alert alert-info">No champion played.</div>;

  // Calculate totals
  const totalGames = stats.reduce((acc, champ) => acc + champ.games, 0);
  const totalWins = stats.reduce((acc, champ) => acc + champ.wins, 0);
  const globalWinrate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
  const globalKda =
    stats.length > 0
      ? stats.reduce((acc, champ) => acc + champ.kda * champ.games, 0) /
        totalGames
      : 0;

  const sortIcon = (key: string) => {
    if (sortKey !== key) return <span className="opacity-30">⇅</span>;
    return sortDir === "asc" ? <span>▲</span> : <span>▼</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra rounded-xl bg-base-100 shadow">
        <thead>
          <tr>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("champion")}
            >
              Champion {sortIcon("champion")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("games")}
            >
              Games {sortIcon("games")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("wins")}
            >
              Wins {sortIcon("wins")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("winrate")}
            >
              Winrate {sortIcon("winrate")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("kda")}
            >
              KDA {sortIcon("kda")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("kills")}
            >
              Kills {sortIcon("kills")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("deaths")}
            >
              Deaths {sortIcon("deaths")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("assists")}
            >
              Assists {sortIcon("assists")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map((champ) => {
            const champInfo =
              championData.data[
                champ.champion as keyof typeof championData.data
              ];
            return (
              <tr key={champ.champion} className="hover:bg-base-200">
                <td className="flex items-center gap-2">
                  <Image
                    src={getChampionIcon(champ.champion)}
                    alt={champ.champion}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded"
                  />
                  <span>{champInfo ? champInfo.name : champ.champion}</span>
                </td>
                <td>{champ.games}</td>
                <td>{champ.wins}</td>
                <td>
                  <span className="badge badge-success badge-outline">
                    {getWinrate(champ).toFixed(1)}%
                  </span>
                </td>
                <td>
                  <span className="badge badge-info badge-outline">
                    {champ.kda.toFixed(2)}
                  </span>
                </td>
                <td>{champ.kills}</td>
                <td>{champ.deaths}</td>
                <td>{champ.assists}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td>Total</td>
            <td>{totalGames}</td>
            <td>{totalWins}</td>
            <td>
              <span className="badge badge-success badge-outline">
                {globalWinrate.toFixed(1)}%
              </span>
            </td>
            <td>
              <span className="badge badge-info badge-outline">
                {globalKda.toFixed(2)}
              </span>
            </td>
            <td>{stats.reduce((acc, champ) => acc + champ.kills, 0)}</td>
            <td>{stats.reduce((acc, champ) => acc + champ.deaths, 0)}</td>
            <td>{stats.reduce((acc, champ) => acc + champ.assists, 0)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ChampionsTab;
