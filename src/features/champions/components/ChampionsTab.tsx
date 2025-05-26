"use client";
import React, { useState, useMemo, useCallback } from "react";
import championData from "@/../public/assets/data/en_US/champion.json";
import { getChampionIcon } from "@/shared/lib/utils/helpers";
import { useEffectiveUser } from "@/shared/hooks/useEffectiveUser";
import { useOptimizedChampionStats } from "@/shared/hooks/useOptimizedFetch";
import { withPerformanceTracking } from "@/shared/components/performance/SimplePerformanceWrapper";
import { apiCache } from "@/shared/lib/cache/CacheManager";
import Image from "next/image";
import { ChampionData } from "@/shared/types/data/champion";
import type { UseOptimizedFetchResult } from "@/shared/hooks/useOptimizedFetch";

interface ChampionStats {
  champion: string;
  games: number;
  wins: number;
  kda: number;
  kills: number;
  deaths: number;
  assists: number;
}

// Memoized row component for better performance
const ChampionRow: React.FC<{
  champ: ChampionStats;
  championInfo?: ChampionData;
  getWinrate: (champ: ChampionStats) => number;
}> = React.memo(({ champ, championInfo, getWinrate }) => (
  <tr key={champ.champion} className="hover:bg-base-200">
    <td className="flex items-center gap-2">
      <Image
        src={getChampionIcon(champ.champion)}
        alt={champ.champion}
        width={32}
        height={32}
        className="w-8 h-8 rounded"
      />
      <span>{championInfo ? championInfo.name : champ.champion}</span>
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
));

ChampionRow.displayName = "ChampionRow";

const ChampionsTab: React.FC = React.memo(() => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();

  // Memoize parameters to prevent unnecessary re-renders
  const memoizedParams = useMemo(
    () => ({
      region: effectiveRegion,
      name: effectiveName,
      tagline: effectiveTagline,
    }),
    [effectiveRegion, effectiveName, effectiveTagline]
  );

  const [sortKey, setSortKey] = useState<string>("games");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  // Use optimized fetch for champion stats
  const {
    data: statsResponse,
    loading,
    error,
    refetch,
  } = useOptimizedChampionStats(
    memoizedParams.region,
    memoizedParams.name,
    memoizedParams.tagline
  ) as UseOptimizedFetchResult<{ success: boolean; data: ChampionStats[] }>;

  const stats = useMemo<ChampionStats[]>(() => {
    // Handle both direct array and wrapped response format
    if (Array.isArray(statsResponse)) {
      return statsResponse;
    }
    if (
      statsResponse &&
      typeof statsResponse === "object" &&
      "data" in statsResponse
    ) {
      return (statsResponse as any).data || [];
    }
    return [];
  }, [statsResponse]);

  // Clear cache and refetch
  const clearCacheAndRefetch = useCallback(async () => {
    apiCache.clearChampionsAndMasteriesCache();
    await refetch();
  }, [refetch]);

  // Memoized winrate calculation
  const getWinrate = useCallback(
    (champ: ChampionStats) =>
      champ.games > 0 ? (champ.wins / champ.games) * 100 : 0,
    []
  ); // Memoized champion data lookup for performance
  const championDataLookup = useMemo(() => {
    return championData.data as Record<string, ChampionData>;
  }, []);

  // Memoized sorted stats
  const sortedStats = useMemo(() => {
    return [...stats].sort((a, b) => {
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
  }, [stats, sortKey, sortDir, getWinrate]);

  // Memoized sort handler
  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir(key === "champion" ? "asc" : "desc");
      }
    },
    [sortKey]
  ); // Memoized stats calculations
  const globalStats = useMemo(() => {
    const totalGames = stats.reduce(
      (acc: number, champ: ChampionStats) => acc + champ.games,
      0
    );
    const totalWins = stats.reduce(
      (acc: number, champ: ChampionStats) => acc + champ.wins,
      0
    );
    const totalKills = stats.reduce(
      (acc: number, champ: ChampionStats) => acc + champ.kills,
      0
    );
    const totalDeaths = stats.reduce(
      (acc: number, champ: ChampionStats) => acc + champ.deaths,
      0
    );
    const totalAssists = stats.reduce(
      (acc: number, champ: ChampionStats) => acc + champ.assists,
      0
    );
    const globalWinrate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
    const globalKda =
      stats.length > 0
        ? stats.reduce(
            (acc: number, champ: ChampionStats) =>
              acc + champ.kda * champ.games,
            0
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
  }, [stats]);

  // Memoized sort icon function
  const sortIcon = useCallback(
    (key: string) => {
      if (sortKey !== key) return <span className="opacity-30">⇅</span>;
      return sortDir === "asc" ? <span>▲</span> : <span>▼</span>;
    },
    [sortKey, sortDir]
  );
  if (loading)
    return <div className="loading loading-spinner loading-lg mx-auto my-8" />;
  if (error)
    return (
      <div className="space-y-4">
        <div className="alert alert-error">Error: {error}</div>
        <button
          onClick={clearCacheAndRefetch}
          className="btn btn-warning btn-sm"
        >
          Clear Cache & Retry
        </button>
      </div>
    );
  if (!stats || stats.length === 0)
    return (
      <div className="space-y-4">
        <div className="alert alert-info">No champion played.</div>
        <button
          onClick={clearCacheAndRefetch}
          className="btn btn-warning btn-sm"
        >
          Clear Cache & Retry
        </button>
      </div>
    );
  return (
    <div className="space-y-4">
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
                championDataLookup[
                  champ.champion as keyof typeof championDataLookup
                ];
              return (
                <ChampionRow
                  key={champ.champion}
                  champ={champ}
                  championInfo={champInfo}
                  getWinrate={getWinrate}
                />
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td>Total</td>
              <td>{globalStats.totalGames}</td>
              <td>{globalStats.totalWins}</td>
              <td>
                <span className="badge badge-success badge-outline">
                  {globalStats.globalWinrate.toFixed(1)}%
                </span>
              </td>
              <td>
                <span className="badge badge-info badge-outline">
                  {globalStats.globalKda.toFixed(2)}
                </span>
              </td>
              <td>{globalStats.totalKills}</td>
              <td>{globalStats.totalDeaths}</td>
              <td>{globalStats.totalAssists}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
});

ChampionsTab.displayName = "ChampionsTab";

// Export with performance tracking
export default withPerformanceTracking(ChampionsTab, "ChampionsTab");
