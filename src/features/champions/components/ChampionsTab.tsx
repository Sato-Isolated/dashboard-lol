"use client";
import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Search,
  RefreshCw,
  TrendingUp,
  Trophy,
  Target,
  Zap,
  User,
  Sword,
} from "lucide-react";
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

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.4,
    },
  },
  hover: {
    x: 4,
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

// Modernized ChampionRow component with animations
const ChampionRow: React.FC<{
  champ: ChampionStats;
  championInfo?: ChampionData;
  getWinrate: (champ: ChampionStats) => number;
  index: number;
}> = React.memo(({ champ, championInfo, getWinrate, index }) => {
  const winrate = getWinrate(champ);
  const isHighWinrate = winrate >= 60;
  const isGoodKDA = champ.kda >= 2.0;

  return (
    <motion.tr
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
      className="group relative overflow-hidden transition-all duration-300 
                 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5
                 border-b border-base-content/10"
    >
      {/* Animated background effect */}
      <td className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </td>

      {/* Champion info with avatar */}
      <td className="relative py-4 px-6">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative"
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={getChampionIcon(champ.champion)}
              alt={champ.champion}
              width={48}
              height={48}
              className="w-12 h-12 rounded-xl shadow-lg border-2 border-base-content/20
                         group-hover:border-primary/50 transition-all duration-300"
            />
            {isGoodKDA && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full 
                           flex items-center justify-center shadow-lg"
              >
                <Sword size={8} className="text-success-content" />
              </motion.div>
            )}
          </motion.div>
          <div className="flex flex-col">
            <span
              className="font-bold text-lg text-base-content group-hover:text-primary 
                           transition-colors duration-300"
            >
              {championInfo ? championInfo.name : champ.champion}
            </span>
            <span className="text-xs text-base-content/60 font-medium">
              {champ.games} game{champ.games !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>
      </td>

      {/* Games played */}
      <td className="relative py-4 px-6 text-center">
        <motion.div
          className="flex items-center justify-center gap-2"
          whileHover={{ scale: 1.1 }}
        >
          <User size={16} className="text-base-content/60" />
          <span className="font-bold text-lg">{champ.games}</span>
        </motion.div>
      </td>

      {/* Wins */}
      <td className="relative py-4 px-6 text-center">
        <motion.div
          className="flex items-center justify-center gap-2"
          whileHover={{ scale: 1.1 }}
        >
          <Trophy size={16} className="text-success" />
          <span className="font-bold text-lg text-success">{champ.wins}</span>
        </motion.div>
      </td>

      {/* Winrate badge */}
      <td className="relative py-4 px-6 text-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 2 }}
          transition={{ duration: 0.2 }}
        >
          <span
            className={`badge badge-lg font-bold px-4 py-2 shadow-lg
                          ${
                            isHighWinrate
                              ? "badge-success text-success-content"
                              : winrate >= 45
                              ? "badge-warning text-warning-content"
                              : "badge-error text-error-content"
                          }`}
          >
            <TrendingUp size={14} className="mr-1" />
            {winrate.toFixed(1)}%
          </span>
        </motion.div>
      </td>

      {/* KDA badge */}
      <td className="relative py-4 px-6 text-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -2 }}
          transition={{ duration: 0.2 }}
        >
          <span
            className={`badge badge-lg font-bold px-4 py-2 shadow-lg
                          ${
                            isGoodKDA
                              ? "badge-info text-info-content"
                              : champ.kda >= 1.5
                              ? "badge-warning text-warning-content"
                              : "badge-ghost"
                          }`}
          >
            <Target size={14} className="mr-1" />
            {champ.kda.toFixed(2)}
          </span>
        </motion.div>
      </td>

      {/* KDA breakdown */}
      <td className="relative py-4 px-6 text-center">
        <motion.div
          className="flex items-center justify-center gap-1 text-sm font-semibold"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-success">{champ.kills}</span>
          <span className="text-base-content/40">/</span>
          <span className="text-error">{champ.deaths}</span>
          <span className="text-base-content/40">/</span>
          <span className="text-info">{champ.assists}</span>
        </motion.div>
      </td>
    </motion.tr>
  );
});

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
  const [searchTerm, setSearchTerm] = useState<string>("");
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
  // Memoized sorted and filtered stats
  const sortedStats = useMemo(() => {
    return [...stats]
      .filter((champ) => {
        if (!searchTerm) return true;
        const championInfo =
          championDataLookup[champ.champion as keyof typeof championDataLookup];
        const name = championInfo ? championInfo.name : champ.champion;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
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
  }, [stats, sortKey, sortDir, getWinrate, searchTerm, championDataLookup]);

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
    const filteredStats = searchTerm
      ? stats.filter((champ) => {
          const championInfo =
            championDataLookup[
              champ.champion as keyof typeof championDataLookup
            ];
          const name = championInfo ? championInfo.name : champ.champion;
          return name.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : stats;

    const totalGames = filteredStats.reduce(
      (acc: number, champ: ChampionStats) => acc + champ.games,
      0
    );
    const totalWins = filteredStats.reduce(
      (acc: number, champ: ChampionStats) => acc + champ.wins,
      0
    );
    const totalKills = filteredStats.reduce(
      (acc: number, champ: ChampionStats) => acc + champ.kills,
      0
    );
    const totalDeaths = filteredStats.reduce(
      (acc: number, champ: ChampionStats) => acc + champ.deaths,
      0
    );
    const totalAssists = filteredStats.reduce(
      (acc: number, champ: ChampionStats) => acc + champ.assists,
      0
    );
    const globalWinrate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
    const globalKda =
      filteredStats.length > 0
        ? filteredStats.reduce(
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
  }, [stats, searchTerm, championDataLookup]);

  // Memoized sort icon function
  const sortIcon = useCallback(
    (key: string) => {
      if (sortKey !== key) return <span className="opacity-30">⇅</span>;
      return sortDir === "asc" ? <span>▲</span> : <span>▼</span>;
    },
    [sortKey, sortDir]
  );
  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw size={32} className="text-primary" />
        </motion.div>
        <p className="text-lg font-semibold text-base-content/80">
          Loading champion statistics...
        </p>
      </motion.div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="alert alert-error shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Error Loading Champions</h3>
            <div className="text-xs opacity-80">{error}</div>
          </div>
        </div>
        <motion.button
          onClick={clearCacheAndRefetch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-warning gap-2 shadow-lg"
        >
          <RefreshCw size={16} />
          Clear Cache & Retry
        </motion.button>
      </motion.div>
    );

  if (!stats || stats.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="alert alert-info shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 className="font-bold">No Champions Found</h3>
            <div className="text-xs opacity-80">
              No champion statistics available for this summoner.
            </div>
          </div>
        </div>
        <motion.button
          onClick={clearCacheAndRefetch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-warning gap-2 shadow-lg"
        >
          <RefreshCw size={16} />
          Clear Cache & Retry
        </motion.button>
      </motion.div>
    );
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Global Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Games Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="stats stats-vertical lg:stats-horizontal shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
        >
          <div className="stat place-items-center">
            <div className="stat-figure text-primary">
              <User size={28} />
            </div>
            <div className="stat-title text-primary font-semibold">
              Total Games
            </div>
            <div className="stat-value text-primary text-2xl">
              {globalStats.totalGames}
            </div>
          </div>
        </motion.div>

        {/* Winrate Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="stats stats-vertical lg:stats-horizontal shadow-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
        >
          <div className="stat place-items-center">
            <div className="stat-figure text-success">
              <Trophy size={28} />
            </div>
            <div className="stat-title text-success font-semibold">
              Win Rate
            </div>
            <div className="stat-value text-success text-2xl">
              {globalStats.globalWinrate.toFixed(1)}%
            </div>
          </div>
        </motion.div>

        {/* KDA Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="stats stats-vertical lg:stats-horizontal shadow-lg bg-gradient-to-br from-info/10 to-info/5 border border-info/20"
        >
          <div className="stat place-items-center">
            <div className="stat-figure text-info">
              <Target size={28} />
            </div>
            <div className="stat-title text-info font-semibold">Avg KDA</div>
            <div className="stat-value text-info text-2xl">
              {globalStats.globalKda.toFixed(2)}
            </div>
          </div>
        </motion.div>

        {/* Champions Played Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="stats stats-vertical lg:stats-horizontal shadow-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20"
        >
          <div className="stat place-items-center">
            <div className="stat-figure text-accent">
              <Zap size={28} />
            </div>
            <div className="stat-title text-accent font-semibold">
              Champions
            </div>
            <div className="stat-value text-accent text-2xl">
              {stats.length}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Search and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        {/* Search Bar */}
        <div className="relative w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.02 }} className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/60"
              size={20}
            />
            <input
              type="text"
              placeholder="Search champions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-primary w-full sm:w-80 pl-12 pr-4 shadow-lg
                         focus:ring-2 focus:ring-primary/20 transition-all duration-300
                         bg-base-100/80 backdrop-blur-sm"
            />
          </motion.div>
        </div>

        {/* Refresh Button */}
        <motion.button
          onClick={clearCacheAndRefetch}
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary gap-2 shadow-lg"
        >
          <RefreshCw size={16} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Champions Table */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-x-auto"
      >
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.3 }}
          className="bg-base-100 rounded-2xl shadow-2xl border border-base-content/10 overflow-hidden"
        >
          <table className="table table-zebra w-full">
            <thead className="bg-gradient-to-r from-primary/10 to-accent/10">
              <tr>
                <motion.th
                  whileHover={{ backgroundColor: "rgba(var(--p)/0.1)" }}
                  className="cursor-pointer select-none transition-colors duration-200 font-bold text-base-content"
                  onClick={() => handleSort("champion")}
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Champion {sortIcon("champion")}
                  </div>
                </motion.th>
                <motion.th
                  whileHover={{ backgroundColor: "rgba(var(--p)/0.1)" }}
                  className="cursor-pointer select-none transition-colors duration-200 font-bold text-base-content"
                  onClick={() => handleSort("games")}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <TrendingUp size={16} />
                    Games {sortIcon("games")}
                  </div>
                </motion.th>
                <motion.th
                  whileHover={{ backgroundColor: "rgba(var(--p)/0.1)" }}
                  className="cursor-pointer select-none transition-colors duration-200 font-bold text-base-content"
                  onClick={() => handleSort("wins")}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Trophy size={16} />
                    Wins {sortIcon("wins")}
                  </div>
                </motion.th>
                <motion.th
                  whileHover={{ backgroundColor: "rgba(var(--p)/0.1)" }}
                  className="cursor-pointer select-none transition-colors duration-200 font-bold text-base-content"
                  onClick={() => handleSort("winrate")}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <TrendingUp size={16} />
                    Winrate {sortIcon("winrate")}
                  </div>
                </motion.th>
                <motion.th
                  whileHover={{ backgroundColor: "rgba(var(--p)/0.1)" }}
                  className="cursor-pointer select-none transition-colors duration-200 font-bold text-base-content"
                  onClick={() => handleSort("kda")}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Target size={16} />
                    KDA {sortIcon("kda")}
                  </div>
                </motion.th>
                <th className="font-bold text-base-content text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <Sword size={16} />
                    K/D/A
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {sortedStats.map((champ, index) => {
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
                      index={index}
                    />
                  );
                })}
              </AnimatePresence>
            </tbody>
            <tfoot className="bg-gradient-to-r from-base-200 to-base-300">
              <motion.tr
                className="font-bold text-base-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <td className="font-extrabold text-lg">
                  <div className="flex items-center gap-2">
                    <Trophy size={20} className="text-primary" />
                    Total ({searchTerm ? "Filtered" : "All"})
                  </div>
                </td>
                <td className="text-center font-bold text-lg">
                  {globalStats.totalGames}
                </td>
                <td className="text-center font-bold text-lg text-success">
                  {globalStats.totalWins}
                </td>
                <td className="text-center">
                  <span className="badge badge-success badge-lg font-bold px-4 py-2">
                    {globalStats.globalWinrate.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center">
                  <span className="badge badge-info badge-lg font-bold px-4 py-2">
                    {globalStats.globalKda.toFixed(2)}
                  </span>
                </td>
                <td className="text-center font-bold">
                  <span className="text-success">{globalStats.totalKills}</span>
                  <span className="text-base-content/40 mx-1">/</span>
                  <span className="text-error">{globalStats.totalDeaths}</span>
                  <span className="text-base-content/40 mx-1">/</span>
                  <span className="text-info">{globalStats.totalAssists}</span>
                </td>
              </motion.tr>
            </tfoot>
          </table>
        </motion.div>
      </motion.div>

      {/* Empty State for Search */}
      {searchTerm && sortedStats.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-base-content/80 mb-2">
            No champions found
          </h3>
          <p className="text-base-content/60">Try adjusting your search term</p>
        </motion.div>
      )}
    </motion.div>
  );
});

ChampionsTab.displayName = "ChampionsTab";

// Export with performance tracking
export default withPerformanceTracking(ChampionsTab, "ChampionsTab");
