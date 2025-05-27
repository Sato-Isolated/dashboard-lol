import React, { lazy, Suspense, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ); // Loading component for lazy-loaded tables
  const TableSkeleton = useMemo(() => {
    const SkeletonComponent = () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="animate-pulse space-y-4"
      >
        <div className="h-8 bg-gradient-to-r from-base-300 to-base-200 rounded-lg shimmer" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-12 bg-gradient-to-r from-base-200 to-base-100 rounded-lg shimmer"
            />
          ))}
        </div>
      </motion.div>
    );
    return SkeletonComponent;
  }, []);

  // Tab configuration with icons and colors
  const tabs = useMemo(
    () => [
      {
        id: "overview",
        label: "Overview",
        icon: "📊",
        color: "primary",
        description: "Match details and team stats",
      },
      {
        id: "team",
        label: "Analysis",
        icon: "🔍",
        color: "secondary",
        description: "In-depth team analysis",
      },
      {
        id: "build",
        label: "Build",
        icon: "⚔️",
        color: "accent",
        description: "Items, runes and spells",
      },
    ],
    []
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Modern Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-2 bg-base-200/50 rounded-2xl backdrop-blur-sm border border-base-content/10">
        {tabs.map((tabItem, index) => (
          <motion.button
            key={tabItem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTabChange(tabItem.id)}
            className={`relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-3 min-w-[120px] justify-center
              ${
                tab === tabItem.id
                  ? `bg-${tabItem.color} text-${tabItem.color}-content shadow-lg shadow-${tabItem.color}/30 border border-${tabItem.color}/50`
                  : "bg-base-100/70 text-base-content/70 hover:bg-base-100 hover:text-base-content border border-base-content/10"
              }`}
          >
            <span className="text-lg">{tabItem.icon}</span>
            <span>{tabItem.label}</span>

            {/* Active indicator */}
            {tab === tabItem.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/20"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-base-100/80 to-base-200/40 backdrop-blur-sm rounded-2xl border border-base-content/10 shadow-xl overflow-hidden"
        >
          {/* Overview Tab Content */}
          {tab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📊</span>
                <h3 className="text-xl font-bold text-base-content">
                  Match Overview
                </h3>
              </div>

              <Suspense fallback={<TableSkeleton />}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <MatchTeamTable
                    players={redTeam}
                    team="Victory (Red)"
                    teamColor="red"
                    teamStats={teamStats.red}
                  />
                </motion.div>
              </Suspense>

              <Suspense fallback={<TableSkeleton />}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MatchTeamTable
                    players={blueTeam}
                    team="Defeat (Blue)"
                    teamColor="blue"
                    teamStats={teamStats.blue}
                  />
                </motion.div>
              </Suspense>
            </motion.div>
          )}

          {/* Team Analysis Tab Content */}
          {tab === "team" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🔍</span>
                <h3 className="text-xl font-bold text-base-content">
                  Team Analysis
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Duration Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="stat bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300"
                >
                  <div className="stat-figure text-primary">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <div className="stat-title">Duration</div>
                  <div className="stat-value text-primary">
                    {match.details.duration}
                  </div>
                </motion.div>

                {/* Gold Comparison */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="stat bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl shadow-lg hover:shadow-warning/20 transition-all duration-300"
                >
                  <div className="stat-figure text-warning">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="2" r="3" />
                      <path d="M12 21v-6m0 0l-3-3m3 3l3-3" />
                    </svg>
                  </div>
                  <div className="stat-title">Total Gold</div>
                  <div className="stat-value text-lg">
                    <span className="text-error">{match.details.gold.red}</span>
                    <span className="text-base-content/50 mx-2">vs</span>
                    <span className="text-info">{match.details.gold.blue}</span>
                  </div>
                </motion.div>

                {/* Kills Comparison */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="stat bg-gradient-to-br from-error/10 to-error/5 border border-error/20 rounded-xl shadow-lg hover:shadow-error/20 transition-all duration-300"
                >
                  <div className="stat-figure text-error">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                  </div>
                  <div className="stat-title">Total Kills</div>
                  <div className="stat-value text-lg">
                    <span className="text-error">
                      {match.details.kills.red}
                    </span>
                    <span className="text-base-content/50 mx-2">vs</span>
                    <span className="text-info">
                      {match.details.kills.blue}
                    </span>
                  </div>
                </motion.div>

                {/* Towers */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="stat bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl shadow-lg hover:shadow-secondary/20 transition-all duration-300"
                >
                  <div className="stat-figure text-secondary">🏰</div>
                  <div className="stat-title">Towers</div>
                  <div className="stat-value text-lg">
                    <span className="text-error">
                      {match.details.towers.red}
                    </span>
                    <span className="text-base-content/50 mx-2">vs</span>
                    <span className="text-info">
                      {match.details.towers.blue}
                    </span>
                  </div>
                </motion.div>

                {/* Dragons */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="stat bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl shadow-lg hover:shadow-accent/20 transition-all duration-300"
                >
                  <div className="stat-figure text-accent">🐉</div>
                  <div className="stat-title">Dragons</div>
                  <div className="stat-value text-lg">
                    <span className="text-error">
                      {match.details.dragons.red}
                    </span>
                    <span className="text-base-content/50 mx-2">vs</span>
                    <span className="text-info">
                      {match.details.dragons.blue}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Build Tab Content */}
          {tab === "build" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">⚔️</span>
                <h3 className="text-xl font-bold text-base-content">
                  Build Analysis
                </h3>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="alert bg-gradient-to-r from-info/20 to-info/10 border border-info/30 shadow-lg"
              >
                <svg
                  className="w-6 h-6 stroke-current stroke-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold">Coming Soon!</h3>
                  <div className="text-xs">
                    Detailed build analysis, runes breakdown, and spell usage
                    statistics will be available in the next update.
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
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
