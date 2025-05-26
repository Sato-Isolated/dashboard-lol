import React, { lazy, Suspense, useMemo, useCallback } from "react";
import { UIMatch, UIPlayer } from "@/features/matches/types/ui-match.types";
import { withPerformanceTracking } from "@/shared/components/performance/SimplePerformanceWrapper";

// Lazy load heavy table component
const MatchTeamTable = lazy(() => import("./MatchTeamTable"));

interface MatchCardTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  match: UIMatch;
  redTeam: UIPlayer[];
  blueTeam: UIPlayer[];
}

const MatchCardTabsComponent: React.FC<MatchCardTabsProps> = ({
  tab,
  setTab,
  match,
  redTeam,
  blueTeam,
}) => {
  // Use a unique group name for each match card (use gameId)
  const groupId = useMemo(
    () => `match_tabs_${match.gameId || "default"}`,
    [match.gameId]
  );

  // Memoize team stats to prevent recalculation
  const teamStats = useMemo(
    () => ({
      red: {
        kills: match.details.kills.red,
        gold: match.details.gold.red,
      },
      blue: {
        kills: match.details.kills.blue,
        gold: match.details.gold.blue,
      },
    }),
    [
      match.details.kills.red,
      match.details.gold.red,
      match.details.kills.blue,
      match.details.gold.blue,
    ]
  );
  // Memoize event handlers
  const handleTabChange = useCallback(
    (newTab: string) => {
      setTab(newTab);
    },
    [setTab]
  );
  // Loading component for lazy-loaded tables
  const TableSkeleton = useMemo(() => {
    const SkeletonComponent = () => (
      <div className="animate-pulse">
        <div className="h-8 bg-base-300 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-base-200 rounded"></div>
          ))}
        </div>
      </div>
    );
    return SkeletonComponent;
  }, []);
  return (
    <div className="w-full">
      <div className="tabs tabs-lift w-full">
        {/* Overview Tab */}
        <input
          type="radio"
          name={groupId}
          className="tab"
          aria-label="Overview"
          checked={tab === "overview"}
          onChange={() => handleTabChange("overview")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              <Suspense fallback={<TableSkeleton />}>
                <MatchTeamTable
                  players={redTeam}
                  team="Victory (Red)"
                  teamColor="red"
                  teamStats={teamStats.red}
                />
              </Suspense>
              <Suspense fallback={<TableSkeleton />}>
                <MatchTeamTable
                  players={blueTeam}
                  team="Defeat (Blue)"
                  teamColor="blue"
                  teamStats={teamStats.blue}
                />
              </Suspense>
            </div>
          )}
        </div>
        {/* Team analysis Tab */}
        <input
          type="radio"
          name={groupId}
          className="tab"
          aria-label="Team analysis"
          checked={tab === "team"}
          onChange={() => handleTabChange("team")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          {tab === "team" && (
            <div className="flex flex-col gap-2 text-base-content/80 p-2">
              <div>
                <span className="font-semibold">Duration:</span>
                <span className="badge badge-outline ml-1 badge-lg">
                  {match.details.duration}
                </span>
              </div>
              <div>
                <span className="font-semibold">Gold:</span>
                <span className="badge badge-error ml-1 badge-lg">
                  Red {match.details.gold.red}
                </span>
                /
                <span className="badge badge-info ml-1 badge-lg">
                  Blue {match.details.gold.blue}
                </span>
              </div>
              <div>
                <span className="font-semibold">Kills:</span>
                <span className="badge badge-error ml-1 badge-lg">
                  Red {match.details.kills.red}
                </span>
                /
                <span className="badge badge-info ml-1 badge-lg">
                  Blue {match.details.kills.blue}
                </span>
              </div>
              <div>
                <span className="font-semibold">Towers:</span>
                <span className="badge badge-error ml-1 badge-lg">
                  Red {match.details.towers.red}
                </span>
                /
                <span className="badge badge-info ml-1 badge-lg">
                  Blue {match.details.towers.blue}
                </span>
              </div>
              <div>
                <span className="font-semibold">Dragons:</span>
                <span className="badge badge-error ml-1 badge-lg">
                  Red {match.details.dragons.red}
                </span>
                /
                <span className="badge badge-info ml-1 badge-lg">
                  Blue {match.details.dragons.blue}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Build Tab */}
        <input
          type="radio"
          name={groupId}
          className="tab"
          aria-label="Build"
          checked={tab === "build"}
          onChange={() => handleTabChange("build")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          {tab === "build" && (
            <div className="flex flex-col gap-2 text-base-content/80 p-2">
              <div className="alert alert-info shadow-lg">
                Build, runes, spells, etc. (à venir)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Memoize the component for performance
const MatchCardTabs = React.memo(
  MatchCardTabsComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.tab === nextProps.tab &&
      prevProps.match.gameId === nextProps.match.gameId &&
      prevProps.redTeam.length === nextProps.redTeam.length &&
      prevProps.blueTeam.length === nextProps.blueTeam.length
    );
  }
);

MatchCardTabs.displayName = "MatchCardTabs";

// Apply performance tracking
const TrackedMatchCardTabs = withPerformanceTracking(
  MatchCardTabs,
  "MatchCardTabs"
);

export default TrackedMatchCardTabs;
