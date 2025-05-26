"use client";
import React, { useEffect, useMemo, useCallback } from "react";
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
} => {
  if (!matches || matches.length === 0) {
    return {
      kda: "-",
      winrate: "-",
      championPool: [],
    };
  }

  let kills = 0;
  let deaths = 0;
  let assists = 0;
  let wins = 0;
  const championCount: Record<string, number> = {};

  matches.forEach((match) => {
    const [k, d, a] = match.kda.split("/").map(Number);
    kills += k || 0;
    deaths += d || 0;
    assists += a || 0;
    if (match.result === "Win") wins++;
    championCount[match.champion] = (championCount[match.champion] || 0) + 1;
  });

  const kda =
    deaths === 0
      ? (kills + assists).toFixed(2)
      : ((kills + assists) / deaths).toFixed(2);

  const winrate = ((wins / matches.length) * 100).toFixed(1) + "%";

  // Take the 3 most played champions from the last games
  const championPool = Object.entries(championCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([champion]) => champion);

  return {
    kda,
    winrate,
    championPool,
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
  // Memoize loading skeleton to prevent re-renders
  const loadingSkeleton = useMemo(
    () => (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="card bg-base-100 rounded-xl shadow p-4 min-h-[120px] flex flex-col items-center justify-center w-full border border-primary/10">
          <div className="skeleton h-6 w-32 mb-2" />
          <div className="skeleton h-4 w-24 mb-1" />
          <div className="skeleton h-4 w-24 mb-1" />
          <div className="skeleton h-4 w-24 mb-1" />
        </div>
        <div className="bg-base-100 rounded-xl shadow p-4 min-h-[200px] flex flex-col gap-2 w-full border border-primary/10">
          <div className="skeleton h-6 w-32 mb-2" />
          <div className="flex flex-col gap-2">
            {[...Array(10)].map((_, i) => (
              <MatchCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    ),
    []
  );

  // Memoize stats display
  const statsDisplay = useMemo(
    () => (
      <div className="card bg-base-100 rounded-xl shadow p-4 min-h-[120px] flex flex-col items-center justify-center w-full border border-primary/10">
        <span className="font-semibold text-base-content mb-2">
          Main Stats & Graphs
        </span>
        <div className="flex flex-col items-center gap-1">
          <div className="text-base-content/80">
            KDA:
            <span className="badge badge-info badge-outline font-bold">
              {stats.kda}
            </span>
          </div>
          <div className="text-base-content/80">
            Winrate:
            <span className="badge badge-success badge-outline font-bold">
              {stats.winrate}
            </span>
          </div>
          <div className="text-base-content/80">
            Champion Pool:
            <span className="badge badge-outline">
              {stats.championPool.join(", ")}
            </span>
          </div>
        </div>
      </div>
    ),
    [stats]
  );

  // Memoize error message computation
  const errorMessage = useMemo(() => {
    if (!parseError) return null;

    return parseError.includes("Riot") || parseError.includes("base de données")
      ? "Impossible de récupérer les matchs. L'API Riot ou la base de données est peut-être indisponible. Réessayez plus tard."
      : parseError;
  }, [parseError]);

  if (loading) {
    return loadingSkeleton;
  }
  return (
    <div className="flex flex-col gap-4">
      {statsDisplay}
      <SectionCard title="Match History" loading={loading} error={errorMessage}>
        <div className="w-full flex flex-col gap-2">
          <span className="text-xs text-base-content/60 mb-1">
            Matchs affichés : {matches.length}
          </span>
          {(!effectiveName || !effectiveRegion || !effectiveTagline) && (
            <SectionCard
              title="Match History"
              loading={false}
              error="Veuillez renseigner un nom de joueur et un tagline pour afficher l'historique."
            >
              <span className="text-base-content/50 text-xs">No data</span>
            </SectionCard>
          )}
          {matches.length === 0 && !loading && !parseError ? (
            <span className="text-base-content/50 text-xs">No data</span>
          ) : (
            matches.map((match, idx) => (
              <MatchCard key={match.gameId || idx} match={match} />
            ))
          )}
          {hasMore && (
            <button
              className="btn btn-sm btn-outline mt-2"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </SectionCard>
    </div>
  );
});

MatchHistory.displayName = "MatchHistory";

export default withPerformanceTracking(MatchHistory, "MatchHistory");
