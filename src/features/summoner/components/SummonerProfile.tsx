"use client";
import React, { useMemo } from "react";
import type { UIRecentlyPlayed } from "@/shared/types/ui-leftcolumn";
import { useEffectiveUser } from "@/shared/hooks/useEffectiveUser";
import { useAccountSummoner } from "@/features/summoner/hooks/useAccountSummoner";
import { useOptimizedFetch } from "@/shared/hooks/useOptimizedFetch";
import { withPerformanceTracking } from "@/shared/components/performance/SimplePerformanceWrapper";
import RankBadge from "./RankBadge";

// Memoized row component for better performance
const RecentlyPlayedRow: React.FC<{
  player: UIRecentlyPlayed;
  effectiveRegion: string;
  effectiveTagline: string;
  index: number;
}> = React.memo(({ player, effectiveRegion, effectiveTagline, index }) => (
  <tr key={index} className="bg-base-200 hover:bg-base-300 transition">
    <td className="w-1/2 truncate font-semibold text-base-content/90 py-3">
      <a
        href={`/${effectiveRegion}/summoner/${encodeURIComponent(
          player.name
        )}/${encodeURIComponent(
          player.tagline ? player.tagline : effectiveTagline
        )}`}
        className="link link-primary hover:underline"
      >
        {player.name}
      </a>
    </td>
    <td className="w-1/6 text-center py-3">
      <span className="inline-flex items-center justify-center rounded-full bg-info text-info-content font-bold text-base h-7 w-7">
        {player.games}
      </span>
    </td>
    <td className="w-1/6 text-center text-success font-semibold py-3">
      {player.winrate}%
    </td>
    <td className="w-1/6 text-center text-base-content/60 py-3">
      ({player.wins}W/{player.games - player.wins}L)
    </td>
  </tr>
));

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
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="card bg-base-100 rounded-xl shadow-xl p-4 w-full flex flex-col items-center border border-primary/20">
          <div className="skeleton h-6 w-32 mb-2" />
          <div className="skeleton h-10 w-24 rounded-full mb-2" />
          <div className="skeleton h-4 w-24 mb-1" />
        </div>
        <div className="card bg-base-100 rounded-xl shadow-xl p-4 w-full flex flex-col items-center border border-primary/20">
          <div className="skeleton h-6 w-32 mb-2" />
          <div className="flex flex-col gap-2 w-full">
            <div className="skeleton h-4 w-full mb-1" />
            <div className="skeleton h-4 w-full mb-1" />
            <div className="skeleton h-4 w-full mb-1" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {errorMessage && (
        <div className="alert alert-error text-xs text-center mb-2 py-1 px-2">
          {errorMessage}
        </div>
      )}
      <div className="card bg-base-100 rounded-xl shadow-xl p-4 w-full flex flex-col items-center border border-primary/20">
        <span className="font-bold text-primary text-lg mb-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          Rank & Badges
        </span>
        <div className="flex flex-col gap-2 w-full">
          {/* ARAM Rank Display */}
          <RankBadge aramScore={aramScore} leagues={leagues} />
        </div>
      </div>
      <div className="card bg-base-100 rounded-xl shadow-xl p-4 w-full flex flex-col items-center border border-primary/20">
        <span className="font-bold text-primary text-lg mb-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
          Recently Played With
        </span>
        <div className="w-full">
          {recentlyPlayed.length === 0 ? (
            <span className="text-base-content/50 text-xs">No data</span>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-md table-zebra w-full">
                <thead>
                  <tr className="text-sm text-base-content/60">
                    <th className="w-1/2">Summoner</th>
                    <th className="w-1/6 text-center">Games</th>
                    <th className="w-1/6 text-center">WR</th>
                    <th className="w-1/6 text-center">W/L</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyPlayed.map((p, i) => (
                    <RecentlyPlayedRow
                      key={`${p.name}-${i}`}
                      player={p}
                      effectiveRegion={effectiveRegion}
                      effectiveTagline={effectiveTagline}
                      index={i}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

LeftColumn.displayName = "LeftColumn";

// Export with performance tracking
export default withPerformanceTracking(
  React.memo(LeftColumn),
  "SummonerProfile"
);
