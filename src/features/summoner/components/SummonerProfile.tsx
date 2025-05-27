"use client";
import React, { useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Users,
  Trophy,
  TrendingUp,
  Award,
  Zap,
  User,
  Crown,
  Star,
  ChevronRight,
  RefreshCw,
  Shield,
  Sword,
  Target,
} from "lucide-react";
import type { UIRecentlyPlayed } from "@/shared/types/ui-leftcolumn";
import { useEffectiveUser } from "@/shared/hooks/useEffectiveUser";
import { useAccountSummoner } from "@/features/summoner/hooks/useAccountSummoner";
import { useOptimizedFetch } from "@/shared/hooks/useOptimizedFetch";
import { withPerformanceTracking } from "@/shared/components/performance/SimplePerformanceWrapper";
import RankBadge from "./RankBadge";

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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.4,
    },
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  hover: {
    x: 4,
    backgroundColor: "rgba(var(--p)/0.1)",
    transition: { duration: 0.2 },
  },
};

// Enhanced RecentlyPlayedRow with modern design and animations
const RecentlyPlayedRow: React.FC<{
  player: UIRecentlyPlayed;
  effectiveRegion: string;
  effectiveTagline: string;
  index: number;
}> = React.memo(({ player, effectiveRegion, effectiveTagline, index }) => {
  const winrate = player.winrate;
  const isHighWinrate = winrate >= 60;
  const isGoodPerformance = player.games >= 3 && winrate >= 50;

  return (
    <motion.tr
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
      className="group relative overflow-hidden transition-all duration-300 
                 border-b border-base-content/10 last:border-b-0"
    >
      {/* Summoner Name with enhanced styling */}
      <td className="py-4 px-4 font-semibold">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-2 h-2 rounded-full ${
                isGoodPerformance ? "bg-success" : "bg-base-content/40"
              }`}
              animate={{
                scale: isGoodPerformance ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isGoodPerformance ? Infinity : 0,
              }}
            />
            <a
              href={`/${effectiveRegion}/summoner/${encodeURIComponent(
                player.name
              )}/${encodeURIComponent(
                player.tagline ? player.tagline : effectiveTagline
              )}`}
              className="link link-primary hover:link-accent font-bold 
                         group-hover:text-primary transition-colors duration-300
                         flex items-center gap-1"
            >
              <User size={14} className="opacity-60 group-hover:opacity-100" />
              <span className="truncate max-w-[120px]">{player.name}</span>
              <ChevronRight
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </motion.div>
      </td>

      {/* Games with enhanced badge */}
      <td className="py-4 px-4 text-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <span
            className={`badge badge-lg font-bold px-3 py-2 shadow-lg
                        ${
                          player.games >= 5
                            ? "badge-info text-info-content"
                            : player.games >= 3
                            ? "badge-warning text-warning-content"
                            : "badge-ghost"
                        }`}
          >
            <Trophy size={12} className="mr-1" />
            {player.games}
          </span>
        </motion.div>
      </td>

      {/* Winrate with dynamic styling */}
      <td className="py-4 px-4 text-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -2 }}
          transition={{ duration: 0.2 }}
        >
          <span
            className={`badge badge-lg font-bold px-3 py-2 shadow-lg
                        ${
                          isHighWinrate
                            ? "badge-success text-success-content"
                            : winrate >= 45
                            ? "badge-warning text-warning-content"
                            : "badge-error text-error-content"
                        }`}
          >
            <TrendingUp size={12} className="mr-1" />
            {winrate}%
          </span>
        </motion.div>
      </td>

      {/* W/L with enhanced display */}
      <td className="py-4 px-4 text-center">
        <motion.div
          className="flex items-center justify-center gap-1 text-sm font-semibold"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-success font-bold">{player.wins}W</span>
          <span className="text-base-content/40">/</span>
          <span className="text-error font-bold">
            {player.games - player.wins}L
          </span>
        </motion.div>
      </td>
    </motion.tr>
  );
});

RecentlyPlayedRow.displayName = "RecentlyPlayedRow";

const LeftColumn: React.FC = React.memo(() => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const {
    leagues,
    aramScore = 0,
    loading: loadingSummoner,
  } = useAccountSummoner(effectiveRegion, effectiveName, effectiveTagline);

  // Use optimized fetch for recently played data
  const recentlyPlayedUrl = useMemo(() => {
    if (!effectiveName || !effectiveRegion || !effectiveTagline) return null;
    return `/api/summoner/recently-played?name=${encodeURIComponent(
      effectiveName
    )}&region=${encodeURIComponent(
      effectiveRegion
    )}&tagline=${encodeURIComponent(effectiveTagline)}&limit=5`;
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  const {
    data: recentlyPlayedData,
    loading: recentlyPlayedLoading,
    error: fetchError,
  } = useOptimizedFetch<{ data: UIRecentlyPlayed[] }>(recentlyPlayedUrl, {
    cacheKey: `recently-played:${effectiveRegion}:${effectiveName}:${effectiveTagline}`,
    cacheTTL: 2 * 60 * 1000, // 2 minutes
  });

  const recentlyPlayed = useMemo(
    () => recentlyPlayedData?.data || [],
    [recentlyPlayedData]
  );

  const isLoading = loadingSummoner || recentlyPlayedLoading;

  // Memoized error state
  const errorMessage = useMemo(() => fetchError, [fetchError]);
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-6"
      >
        {/* Rank & Badges Loading Skeleton */}
        <motion.div
          variants={cardVariants}
          className="card bg-gradient-to-br from-primary/5 to-accent/5 
                     rounded-2xl shadow-2xl border border-primary/20 overflow-hidden"
        >
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
              />
              <div className="skeleton h-6 w-32" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="skeleton h-16 w-full rounded-xl" />
              <div className="skeleton h-12 w-3/4 rounded-lg" />
            </div>
          </div>
        </motion.div>

        {/* Recently Played Loading Skeleton */}
        <motion.div
          variants={cardVariants}
          className="card bg-gradient-to-br from-accent/5 to-info/5 
                     rounded-2xl shadow-2xl border border-accent/20 overflow-hidden"
        >
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full"
              />
              <div className="skeleton h-6 w-40" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton h-6 w-12 rounded-full" />
                  <div className="skeleton h-6 w-16 rounded-full" />
                  <div className="skeleton h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      {/* Error Alert with enhanced styling */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="alert alert-error shadow-lg rounded-xl border border-error/20"
          >
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
              <h3 className="font-bold">Connection Error</h3>
              <div className="text-xs opacity-80">{errorMessage}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rank & Badges Card - Enhanced Design */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="card bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 
                   rounded-2xl shadow-2xl border border-primary/20 overflow-hidden
                   hover:shadow-primary/20 transition-shadow duration-300"
      >
        <div className="card-body p-6">
          {/* Header with animated icon */}
          <motion.div
            className="flex items-center gap-3 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center justify-center w-8 h-8 rounded-full 
                         bg-primary/20 text-primary"
            >
              <Crown size={18} />
            </motion.div>
            <h3 className="font-bold text-primary text-xl flex items-center gap-2">
              Rank & Badges
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            </h3>
          </motion.div>

          {/* Rank Badge Container */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <RankBadge aramScore={aramScore} leagues={leagues} />
          </motion.div>
        </div>
      </motion.div>

      {/* Recently Played Card - Enhanced Design */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="card bg-gradient-to-br from-accent/10 via-accent/5 to-info/10 
                   rounded-2xl shadow-2xl border border-accent/20 overflow-hidden
                   hover:shadow-accent/20 transition-shadow duration-300"
      >
        <div className="card-body p-6">
          {/* Header with animated icon */}
          <motion.div
            className="flex items-center justify-between mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center justify-center w-8 h-8 rounded-full 
                           bg-accent/20 text-accent"
              >
                <Users size={18} />
              </motion.div>
              <h3 className="font-bold text-accent text-xl flex items-center gap-2">
                Recently Played With
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-accent"
                />
              </h3>
            </div>
            {recentlyPlayed.length > 0 && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <RefreshCw size={16} />
              </motion.div>
            )}
          </motion.div>

          {/* Content */}
          <div className="w-full">
            {recentlyPlayed.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4 opacity-60"
                >
                  👥
                </motion.div>
                <span className="text-base-content/60 text-sm font-medium">
                  No recent teammates found
                </span>
                <span className="text-base-content/40 text-xs mt-1">
                  Play some games to see your recent teammates!
                </span>
              </motion.div>
            ) : (
              <div className="overflow-x-auto rounded-xl">
                <table className="table w-full">
                  {/* Enhanced Table Header */}
                  <thead className="bg-gradient-to-r from-base-200 to-base-300">
                    <tr>
                      <th className="font-bold text-base-content/80">
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          Summoner
                        </div>
                      </th>
                      <th className="text-center font-bold text-base-content/80">
                        <div className="flex items-center justify-center gap-2">
                          <Trophy size={14} />
                          Games
                        </div>
                      </th>
                      <th className="text-center font-bold text-base-content/80">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp size={14} />
                          WR
                        </div>
                      </th>
                      <th className="text-center font-bold text-base-content/80">
                        <div className="flex items-center justify-center gap-2">
                          <Target size={14} />
                          W/L
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {recentlyPlayed.map((p, i) => (
                        <RecentlyPlayedRow
                          key={`${p.name}-${i}`}
                          player={p}
                          effectiveRegion={effectiveRegion}
                          effectiveTagline={effectiveTagline}
                          index={i}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer with stats summary */}
          {recentlyPlayed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-4 border-t border-base-content/10"
            >
              <div className="flex items-center justify-between text-xs text-base-content/60">
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {recentlyPlayed.length} recent teammate
                  {recentlyPlayed.length !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {Math.round(
                    recentlyPlayed.reduce((acc, p) => acc + p.winrate, 0) /
                      recentlyPlayed.length
                  )}
                  % avg winrate
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

LeftColumn.displayName = "LeftColumn";

// Export with performance tracking
export default withPerformanceTracking(
  React.memo(LeftColumn),
  "SummonerProfile"
);
