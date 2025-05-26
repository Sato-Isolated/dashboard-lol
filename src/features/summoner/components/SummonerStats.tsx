"use client";
import React from "react";
import type { LeagueEntry } from "@/shared/types/api/summoners.types";
import { getAramRank } from "@/features/aram/utils/aramRankSystem";

interface SummonerStatsProps {
  leagues: LeagueEntry[];
  aramScore?: number;
  loading?: boolean;
  error?: string | null;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

const queueDisplayNames: Record<string, string> = {
  RANKED_SOLO_5x5: "Ranked Solo",
  RANKED_FLEX_SR: "Ranked Flex",
  RANKED_FLEX_TT: "Ranked Flex 3v3",
};

const tierColors: Record<string, string> = {
  IRON: "text-slate-500",
  BRONZE: "text-amber-600",
  SILVER: "text-slate-400",
  GOLD: "text-yellow-500",
  PLATINUM: "text-cyan-500",
  EMERALD: "text-emerald-500",
  DIAMOND: "text-blue-500",
  MASTER: "text-purple-500",
  GRANDMASTER: "text-red-500",
  CHALLENGER: "text-yellow-400",
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  className?: string;
}> = ({ title, value, subtitle, color, className = "" }) => (
  <div className={`bg-base-300 rounded-lg p-3 ${className}`}>
    <div className="text-xs text-base-content/60 uppercase tracking-wide">
      {title}
    </div>
    <div className={`text-lg font-bold ${color || "text-base-content"}`}>
      {value}
    </div>
    {subtitle && <div className="text-xs text-base-content/50">{subtitle}</div>}
  </div>
);

const RankCard: React.FC<{ league: LeagueEntry; compact?: boolean }> = ({
  league,
  compact = false,
}) => {
  const winRate =
    league.wins + league.losses > 0
      ? Math.round((league.wins / (league.wins + league.losses)) * 100)
      : 0;

  const tierColor = tierColors[league.tier] || "text-base-content";
  const queueName = queueDisplayNames[league.queueType] || league.queueType;

  if (compact) {
    return (
      <div className="bg-base-300 rounded-lg p-3">
        <div className="text-xs text-base-content/60 uppercase tracking-wide mb-1">
          {queueName}
        </div>
        <div className={`text-sm font-bold ${tierColor}`}>
          {league.tier} {league.rank}
        </div>
        <div className="text-xs text-base-content/60">
          {league.leaguePoints} LP • {winRate}% WR
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-300 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-xs text-base-content/60 uppercase tracking-wide">
            {queueName}
          </div>
          <div className={`text-xl font-bold ${tierColor}`}>
            {league.tier} {league.rank}
          </div>
          <div className="text-sm text-base-content/70">
            {league.leaguePoints} LP
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-base-content">
            {winRate}%
          </div>
          <div className="text-xs text-base-content/60">Win Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="text-center">
          <div className="text-sm font-semibold text-success">
            {league.wins}
          </div>
          <div className="text-xs text-base-content/60">Wins</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-error">
            {league.losses}
          </div>
          <div className="text-xs text-base-content/60">Losses</div>
        </div>
      </div>

      {(league.hotStreak || league.veteran || league.freshBlood) && (
        <div className="flex gap-1 mt-2">
          {league.hotStreak && (
            <span className="badge badge-warning badge-xs">🔥 Hot Streak</span>
          )}
          {league.veteran && (
            <span className="badge badge-info badge-xs">⭐ Veteran</span>
          )}
          {league.freshBlood && (
            <span className="badge badge-success badge-xs">🆕 Fresh Blood</span>
          )}
        </div>
      )}
    </div>
  );
};

export const SummonerStats: React.FC<SummonerStatsProps> = ({
  leagues,
  aramScore = 0,
  loading = false,
  error = null,
  variant = "default",
  className = "",
}) => {
  // Loading state
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="skeleton h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-base-300 rounded-lg p-4 animate-pulse">
              <div className="skeleton h-4 w-20 mb-2" />
              <div className="skeleton h-6 w-24 mb-2" />
              <div className="skeleton h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`bg-base-200 rounded-xl p-4 border border-error/20 ${className}`}
      >
        <div className="flex items-center gap-2 text-error">
          <span>⚠️</span>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  const aramRank = getAramRank(aramScore);
  const rankedLeagues = leagues.filter((league) =>
    league.queueType.includes("RANKED")
  );

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={`space-y-3 ${className}`}>
        <h3 className="text-lg font-semibold text-base-content">Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rankedLeagues.length > 0 ? (
            rankedLeagues.map((league, i) => (
              <RankCard
                key={`${league.queueType}-${i}`}
                league={league}
                compact
              />
            ))
          ) : (
            <div className="bg-base-300 rounded-lg p-3 col-span-full text-center">
              <span className="text-base-content/60 text-sm">
                No ranked data
              </span>
            </div>
          )}
          <StatCard
            title="ARAM Rank"
            value={aramRank.displayName}
            subtitle={`${aramScore} points`}
            color="text-info"
          />
        </div>
      </div>
    );
  }

  // Default and detailed variants
  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold text-base-content">Statistics</h2>

      {/* Ranked Stats */}
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-4">Ranked</h3>
        {rankedLeagues.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rankedLeagues.map((league, i) => (
              <RankCard key={`${league.queueType}-${i}`} league={league} />
            ))}
          </div>
        ) : (
          <div className="bg-base-300 rounded-lg p-6 text-center">
            <span className="text-base-content/60">
              No ranked games played this season
            </span>
          </div>
        )}
      </div>

      {/* ARAM Stats */}
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-4">ARAM</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="ARAM Rank"
            value={aramRank.displayName}
            subtitle={`Score: ${aramScore}`}
            color="text-info"
            className="md:col-span-2"
          />
          <StatCard
            title="Rank Progress"
            value={`${Math.min(
              100,
              Math.round(
                ((aramScore - aramRank.min) / (aramRank.max - aramRank.min)) *
                  100
              )
            )}%`}
            subtitle={`${
              aramRank.max !== Infinity
                ? `Next: ${aramRank.max + 1}`
                : "Max Rank"
            }`}
            color="text-primary"
          />
        </div>
      </div>

      {variant === "detailed" && (
        <div>
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Additional Info
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              title="Total Leagues"
              value={leagues.length}
              subtitle="Active queues"
            />
            <StatCard
              title="Highest Tier"
              value={
                rankedLeagues.length > 0
                  ? rankedLeagues[0]?.tier || "Unranked"
                  : "Unranked"
              }
              subtitle="Best rank"
            />
            <StatCard
              title="Total Games"
              value={rankedLeagues.reduce(
                (acc, league) => acc + league.wins + league.losses,
                0
              )}
              subtitle="This season"
            />
            <StatCard
              title="Overall WR"
              value={
                rankedLeagues.length > 0
                  ? `${Math.round(
                      (rankedLeagues.reduce(
                        (acc, league) => acc + league.wins,
                        0
                      ) /
                        rankedLeagues.reduce(
                          (acc, league) => acc + league.wins + league.losses,
                          1
                        )) *
                        100
                    )}%`
                  : "N/A"
              }
              subtitle="All ranked"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SummonerStats;
