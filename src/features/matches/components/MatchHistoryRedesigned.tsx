"use client";
import React, { useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  Zap,
  Users,
  TrendingUp,
  RotateCcw,
  AlertCircle,
  GamepadIcon,
} from "lucide-react";
import MatchCard, { MatchCardSkeleton } from "./MatchCard";
import { withPerformanceTracking } from "@/shared/components/performance/SimplePerformanceWrapper";
import SectionCard from "@/shared/components/ui/SectionCard";
import { useMatchHistory } from "@/features/matches/hooks/useMatchHistory";
import { useEffectiveUser } from "@/shared/hooks/useEffectiveUser";
import type { UIMatch } from "@/features/matches/types/ui-match.types";

// Memoized stats computation function outside component for better performance
const computeMatchStats = (
  matches: UIMatch[]
): {
  kda: string;
  winrate: string;
  championPool: string[];
  totalMatches: number;
  wins: number;
  losses: number;
  avgCs: number;
} => {
  if (!matches || matches.length === 0) {
    return {
      kda: "-",
      winrate: "-",
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

  matches.forEach((match) => {
    const [k, d, a] = match.kda.split("/").map(Number);
    kills += k || 0;
    deaths += d || 0;
    assists += a || 0;
    if (match.result === "Win") wins++;

    // Calculate average CS from players data - find the current player
    const currentPlayer = match.players?.find(
      (p) => p.name === match.champion || p.champion === match.champion
    );
    totalCs += currentPlayer?.cs || 0;

    championCount[match.champion] = (championCount[match.champion] || 0) + 1;
  });

  const kda =
    deaths === 0
      ? (kills + assists).toFixed(2)
      : ((kills + assists) / deaths).toFixed(2);

  const winrate = ((wins / matches.length) * 100).toFixed(1) + "%";
  const avgCs = Math.round(totalCs / matches.length);

  // Take the 3 most played champions from the last games
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

const MatchHistory: React.FC = React.memo(() => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();

  const {
    matches,
    error: parseError,
    loading,
    hasMore,
    fetchMatches,
  } = useMatchHistory();

  // Memoize stats computation with matches dependency
  const stats = useMemo(() => computeMatchStats(matches), [matches]);

  // Memoize fetch callback to prevent unnecessary re-renders
  const handleFetchMatches = useCallback(
    (isRefresh: boolean) => {
      fetchMatches(isRefresh);
    },
    [fetchMatches]
  );

  // Memoize load more callback
  const handleLoadMore = useCallback(() => {
    handleFetchMatches(false);
  }, [handleFetchMatches]);

  useEffect(() => {
    if (!effectiveName || !effectiveRegion || !effectiveTagline) {
      return;
    }
    handleFetchMatches(true);
  }, [effectiveName, effectiveRegion, effectiveTagline, handleFetchMatches]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const statsCards = [
    {
      icon: Users,
      label: "Total Games",
      value: stats.totalMatches,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Trophy,
      label: "Win Rate",
      value: stats.winrate,
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      icon: Target,
      label: "Avg KDA",
      value: stats.kda,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: Zap,
      label: "Avg CS",
      value: stats.avgCs,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ];

  // Memoize error message computation
  const errorMessage = useMemo(() => {
    if (!parseError) return null;

    return parseError.includes("Riot") || parseError.includes("base de données")
      ? "Unable to fetch matches. Riot API or database may be unavailable. Please try again later."
      : parseError;
  }, [parseError]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card bg-base-100/90 backdrop-blur-sm shadow-xl border border-base-content/10"
      >
        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary"
            >
              <TrendingUp className="w-6 h-6 text-primary-content" />
            </motion.div>
            <div>
              <h2 className="card-title text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Match History
              </h2>
              <p className="text-base-content/70">Loading recent matches...</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="stat bg-base-200/50 rounded-xl border border-base-content/10"
              >
                <div className="stat-figure">
                  <div className="w-8 h-8 rounded-lg bg-base-content/20 animate-pulse" />
                </div>
                <div className="stat-value">
                  <div className="w-16 h-8 bg-base-content/20 rounded animate-pulse" />
                </div>
                <div className="stat-desc">
                  <div className="w-20 h-4 bg-base-content/20 rounded animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="h-20 bg-base-content/10 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (errorMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card bg-base-100/90 backdrop-blur-sm shadow-xl border border-error/20"
      >
        <div className="card-body text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto p-4 rounded-full bg-error/10 mb-4"
          >
            <AlertCircle className="w-8 h-8 text-error" />
          </motion.div>
          <h3 className="text-xl font-semibold text-error mb-2">
            Failed to load matches
          </h3>
          <p className="text-base-content/70 mb-4">{errorMessage}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFetchMatches(true)}
            disabled={loading}
            className="btn btn-error btn-outline gap-2"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RotateCcw className="w-4 h-4" />
              </motion.div>
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            {loading ? "Retrying..." : "Try Again"}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!effectiveName || !effectiveRegion || !effectiveTagline) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card bg-base-100/90 backdrop-blur-sm shadow-xl border border-warning/20"
      >
        <div className="card-body text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto p-4 rounded-full bg-warning/10 mb-4"
          >
            <Users className="w-8 h-8 text-warning" />
          </motion.div>
          <h3 className="text-xl font-semibold text-warning mb-2">
            Summoner Information Required
          </h3>
          <p className="text-base-content/70">
            Please provide a summoner name and tagline to view match history
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header with stats */}
      <motion.div
        variants={itemVariants}
        className="card bg-base-100/90 backdrop-blur-sm shadow-xl border border-base-content/10 overflow-hidden"
      >
        <div className="card-body">
          <motion.div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg"
              >
                <TrendingUp className="w-6 h-6 text-primary-content" />
              </motion.div>
              <div>
                <h2 className="card-title text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Match History
                </h2>
                <p className="text-base-content/70">
                  Recent {stats.totalMatches} matches
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFetchMatches(true)}
              disabled={loading}
              className="btn btn-ghost btn-circle"
            >
              <motion.div
                animate={loading ? { rotate: 360 } : {}}
                transition={{
                  duration: 1,
                  repeat: loading ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <RotateCcw className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {statsCards.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`stat ${stat.bgColor} backdrop-blur-sm rounded-xl border ${stat.borderColor} shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group`}
                >
                  <div className="stat-figure">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} shadow-md`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <motion.div
                    className="stat-value text-2xl font-bold text-base-content"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="stat-desc text-base-content/70 font-medium group-hover:text-base-content/90 transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Match List Section */}
      <motion.div variants={itemVariants}>
        <SectionCard
          title="Recent Matches"
          loading={loading}
          error={errorMessage}
        >
          <AnimatePresence mode="wait">
            {matches && matches.length > 0 ? (
              <motion.div
                key="matches"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col gap-2"
              >
                <span className="text-xs text-base-content/60 mb-1">
                  Matches displayed: {matches.length}
                </span>

                <div className="space-y-2">
                  {matches.map((match, idx) => (
                    <motion.div
                      key={match.gameId || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      <MatchCard match={match} />
                    </motion.div>
                  ))}
                </div>

                {hasMore && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-sm btn-outline mt-4 gap-2"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </motion.div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <GamepadIcon className="w-4 h-4" />
                        Load More
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto p-6 rounded-full bg-base-content/5 mb-4 w-fit"
                >
                  <GamepadIcon className="w-12 h-12 text-base-content/50" />
                </motion.div>
                <h3 className="text-xl font-semibold text-base-content/80 mb-2">
                  No matches found
                </h3>
                <p className="text-base-content/60">
                  Start playing to see your match history here
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>
      </motion.div>
    </motion.div>
  );
});

MatchHistory.displayName = "MatchHistory";

export default withPerformanceTracking(MatchHistory, "MatchHistory");
