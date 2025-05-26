"use client";
import React, { useState } from "react";
import { default as MatchCard, MatchCardSkeleton } from "./MatchCard";
import type { UIMatch } from "@/features/matches/types/ui-match.types";
import { Button } from "@/shared/components/ui/Button";

interface MatchListProps {
  matches: UIMatch[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  variant?: "default" | "compact" | "minimal";
  showStats?: boolean;
  maxInitialItems?: number;
  enablePagination?: boolean;
  className?: string;
  emptyStateMessage?: string;
  title?: string;
}

interface MatchStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  avgKda: string;
  recentFormWins: number;
  recentFormTotal: number;
  mostPlayedChampions: Array<{
    champion: string;
    games: number;
    winRate: number;
  }>;
}

const calculateMatchStats = (matches: UIMatch[]): MatchStats => {
  if (!matches || matches.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      avgKda: "0.00",
      recentFormWins: 0,
      recentFormTotal: 0,
      mostPlayedChampions: [],
    };
  }

  const totalGames = matches.length;
  const wins = matches.filter((m) => m.result === "Win").length;
  const losses = totalGames - wins;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

  // Calculate average KDA
  let totalKills = 0,
    totalDeaths = 0,
    totalAssists = 0;
  matches.forEach((match) => {
    const kdaParts = match.kda.includes("/")
      ? match.kda.split("/")
      : match.kda.split(":");
    totalKills += Number(kdaParts[0]) || 0;
    totalDeaths += Number(kdaParts[1]) || 0;
    totalAssists += Number(kdaParts[2]) || 0;
  });

  const avgKda =
    totalDeaths === 0
      ? (totalKills + totalAssists).toFixed(2)
      : ((totalKills + totalAssists) / totalDeaths).toFixed(2);

  // Recent form (last 10 games)
  const recentMatches = matches.slice(0, Math.min(10, totalGames));
  const recentFormWins = recentMatches.filter((m) => m.result === "Win").length;
  const recentFormTotal = recentMatches.length;

  // Most played champions
  const championCount: Record<string, { games: number; wins: number }> = {};
  matches.forEach((match) => {
    if (!championCount[match.champion]) {
      championCount[match.champion] = { games: 0, wins: 0 };
    }
    championCount[match.champion].games++;
    if (match.result === "Win") {
      championCount[match.champion].wins++;
    }
  });

  const mostPlayedChampions = Object.entries(championCount)
    .map(([champion, stats]) => ({
      champion,
      games: stats.games,
      winRate: stats.games > 0 ? (stats.wins / stats.games) * 100 : 0,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 3);

  return {
    totalGames,
    wins,
    losses,
    winRate,
    avgKda,
    recentFormWins,
    recentFormTotal,
    mostPlayedChampions,
  };
};

const MatchStatsCard: React.FC<{ stats: MatchStats }> = ({ stats }) => (
  <div className="bg-base-200 rounded-xl p-4 mb-6">
    <h3 className="text-lg font-semibold text-base-content mb-4">
      Match Statistics
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-base-content">
          {stats.totalGames}
        </div>
        <div className="text-xs text-base-content/60">Total Games</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-success">
          {stats.winRate.toFixed(1)}%
        </div>
        <div className="text-xs text-base-content/60">Win Rate</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-info">{stats.avgKda}</div>
        <div className="text-xs text-base-content/60">Avg KDA</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">
          {stats.recentFormWins}/{stats.recentFormTotal}
        </div>
        <div className="text-xs text-base-content/60">Recent Form</div>
      </div>
    </div>

    {stats.mostPlayedChampions.length > 0 && (
      <div className="mt-4">
        <div className="text-sm font-medium text-base-content mb-2">
          Most Played
        </div>
        <div className="flex gap-2">
          {stats.mostPlayedChampions.map(({ champion, games, winRate }) => (
            <div
              key={champion}
              className="bg-base-300 rounded-lg p-2 flex-1 text-center"
            >
              <div className="text-sm font-semibold text-base-content">
                {champion}
              </div>
              <div className="text-xs text-base-content/70">{games} games</div>
              <div className="text-xs text-base-content/50">
                {winRate.toFixed(0)}% WR
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const CompactMatchItem: React.FC<{ match: UIMatch; index: number }> = ({
  match,
  index,
}) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-lg ${
      match.result === "Win"
        ? "bg-success/10 border-l-4 border-success"
        : "bg-error/10 border-l-4 border-error"
    }`}
  >
    <div className="text-sm text-base-content/60">#{index + 1}</div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-base-content">
          {match.champion}
        </span>
        <span
          className={`text-sm font-medium ${
            match.result === "Win" ? "text-success" : "text-error"
          }`}
        >
          {match.result}
        </span>
      </div>
      <div className="text-xs text-base-content/60">
        {match.kda} • {match.mode} • {match.duration}
      </div>
    </div>
    <div className="text-xs text-base-content/50">{match.date}</div>
  </div>
);

const MinimalMatchItem: React.FC<{ match: UIMatch }> = ({ match }) => (
  <div className="flex items-center justify-between p-2 hover:bg-base-300/50 rounded-lg transition-colors">
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          match.result === "Win" ? "bg-success" : "bg-error"
        }`}
      />
      <span className="text-sm font-medium text-base-content">
        {match.champion}
      </span>
      <span className="text-xs text-base-content/60">{match.kda}</span>
    </div>
    <span className="text-xs text-base-content/50">{match.date}</span>
  </div>
);

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  loading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  variant = "default",
  showStats = true,
  maxInitialItems,
  enablePagination = false,
  className = "",
  emptyStateMessage = "No matches found",
  title = "Match History",
}) => {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const stats = calculateMatchStats(matches);

  // Handle pagination or initial item limit
  const getDisplayedMatches = () => {
    if (enablePagination) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return matches.slice(startIndex, startIndex + itemsPerPage);
    }

    if (maxInitialItems && !showAll) {
      return matches.slice(0, maxInitialItems);
    }

    return matches;
  };

  const displayedMatches = getDisplayedMatches();
  const totalPages = enablePagination
    ? Math.ceil(matches.length / itemsPerPage)
    : 1;

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {title && <div className="skeleton h-8 w-48" />}
        {showStats && (
          <div className="bg-base-200 rounded-xl p-4 animate-pulse">
            <div className="skeleton h-6 w-32 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="skeleton h-8 w-12 mx-auto mb-2" />
                  <div className="skeleton h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-4">
          {[...Array(variant === "minimal" ? 5 : 3)].map((_, i) =>
            variant === "minimal" ? (
              <div key={i} className="skeleton h-8 w-full rounded-lg" />
            ) : variant === "compact" ? (
              <div key={i} className="bg-base-200 rounded-lg p-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="skeleton h-4 w-8" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-32 mb-1" />
                    <div className="skeleton h-3 w-24" />
                  </div>
                  <div className="skeleton h-3 w-16" />
                </div>
              </div>
            ) : (
              <MatchCardSkeleton key={i} />
            )
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`bg-base-200 rounded-xl p-6 border border-error/20 text-center ${className}`}
      >
        <div className="text-error text-lg mb-2">⚠️ Error Loading Matches</div>
        <div className="text-base-content/70 text-sm">{error}</div>
      </div>
    );
  }

  // Empty state
  if (!matches || matches.length === 0) {
    return (
      <div className={`bg-base-200 rounded-xl p-8 text-center ${className}`}>
        <div className="text-6xl mb-4">🎮</div>
        <div className="text-lg font-semibold text-base-content mb-2">
          No Matches
        </div>
        <div className="text-base-content/60">{emptyStateMessage}</div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-base-content">{title}</h2>
      )}

      {showStats && variant !== "minimal" && <MatchStatsCard stats={stats} />}

      <div className="space-y-4">
        {variant === "minimal"
          ? displayedMatches.map((match, index) => (
              <MinimalMatchItem key={match.gameId || index} match={match} />
            ))
          : variant === "compact"
          ? displayedMatches.map((match, index) => (
              <CompactMatchItem
                key={match.gameId || index}
                match={match}
                index={index}
              />
            ))
          : displayedMatches.map((match, index) => (
              <MatchCard key={match.gameId || index} match={match} />
            ))}
      </div>

      {/* Pagination */}
      {enablePagination && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-base-content/70 px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Show More / Load More */}
      {!enablePagination && (
        <>
          {maxInitialItems && matches.length > maxInitialItems && !showAll && (
            <div className="text-center">
              <Button variant="outline" onClick={() => setShowAll(true)}>
                Show All {matches.length} Matches
              </Button>
            </div>
          )}

          {hasMore && onLoadMore && (
            <div className="text-center">
              <Button
                variant="primary"
                onClick={onLoadMore}
                isLoading={loadingMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Load More Matches"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MatchList;
