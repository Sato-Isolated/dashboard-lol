import { UIMatch, UIPlayer } from "@/features/matches/types/ui-match.types";
import React, { useState, useMemo, useCallback } from "react";
import MatchCardHeader from "./MatchCardHeader";
import MatchCardChampionBlock from "./MatchCardChampionBlock";
import MatchCardStatsBlock from "./MatchCardStatsBlock";
import MatchCardTabs from "./MatchCardTabs";
import { withPerformanceTracking } from "@/shared/components/performance/SimplePerformanceWrapper";

// Extract complex calculations outside component to avoid recreation
const calculateTeams = (players: UIPlayer[]) => ({
  redTeam: players.filter((p) => p.team === "Red"),
  blueTeam: players.filter((p) => p.team === "Blue"),
});

const calculateKDA = (kda: string, teamKills?: number) => {
  // Robust KDA split (supports "/" or ":")
  const parts = kda.includes("/") ? kda.split("/") : kda.split(":");

  // Calculate real KDA (K+A)/D
  const kills = Number(parts[0]);
  const deaths = Number(parts[1]);
  const assists = Number(parts[2]);
  const kdaValue =
    deaths === 0 ? kills + assists : ((kills + assists) / deaths).toFixed(2);

  // Calculate real P/Kill%
  let participation = "--";
  if (teamKills && teamKills > 0) {
    participation = Math.round(
      ((kills + assists) / teamKills) * 100
    ).toString();
  }

  return {
    kdaParts: parts,
    kdaValue,
    pKill: participation,
  };
};

const calculatePlayerBadges = (player: UIPlayer | undefined) => {
  let badges: { label: string; color: string; icon: string }[] = [];

  if (!player) return badges;

  if (player.pentaKills && player.pentaKills > 0) {
    badges = [
      {
        label: "Penta Kill",
        color: "from-fuchsia-600 to-pink-600",
        icon: "👑",
      },
    ];
  } else if (player.quadraKills && player.quadraKills > 0) {
    badges = [
      {
        label: "Quadra Kill",
        color: "from-pink-500 to-red-500",
        icon: "🔥",
      },
    ];
  } else if (player.tripleKills && player.tripleKills > 0) {
    badges = [
      {
        label: "Triple Kill",
        color: "from-cyan-500 to-blue-500",
        icon: "💥",
      },
    ];
  } else if (player.doubleKills && player.doubleKills > 0) {
    badges = [
      {
        label: "Double Kill",
        color: "from-sky-400 to-blue-400",
        icon: "⚡",
      },
    ];
  } else if (player.mvp) {
    badges = [
      {
        label: "MVP",
        color: "from-yellow-400 to-orange-400",
        icon: "⭐",
      },
    ];
  } else if (player.killingSprees && player.killingSprees >= 8) {
    badges = [
      {
        label: "Unstoppable",
        color: "from-green-400 to-emerald-600",
        icon: "💪",
      },
    ];
  }

  return badges;
};

const MatchCardComponent: React.FC<{ match: UIMatch }> = ({ match }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("overview");

  // Memoized toggle functions for better performance
  const handleToggleOpen = useCallback(() => {
    setOpen((o) => !o);
  }, []);

  const handleSetTab = useCallback((newTab: string) => {
    setTab(newTab);
  }, []);

  // Memoize team calculations
  const { redTeam, blueTeam } = useMemo(
    () => calculateTeams(match.players),
    [match.players]
  );

  // Memoize KDA calculations
  const { kdaParts, kdaValue, pKill } = useMemo(
    () => calculateKDA(match.kda, match.teamKills),
    [match.kda, match.teamKills]
  );

  // Memoize main player and special badges
  const { mainPlayer, specialBadges } = useMemo(() => {
    // Find the main player (the one who played the displayed champion)
    const player = match.players.find((p) => p.champion === match.champion);
    const badges = calculatePlayerBadges(player);

    return {
      mainPlayer: player,
      specialBadges: badges,
    };
  }, [match.players, match.champion]);

  // Memoize responsive visibility check
  const shouldShowContent = useMemo(() => {
    return open || (typeof window !== "undefined" && window.innerWidth < 640);
  }, [open]);

  return (
    <div
      className={`card bg-gradient-to-br from-base-200/80 to-base-100/70 border-2 border-primary/40 shadow-2xl rounded-3xl mb-8 transition-all duration-300 pb-4 relative overflow-hidden group backdrop-blur-xl ring-1 ring-primary/10 ${
        open
          ? "ring-4 ring-primary/30 scale-[1.01]"
          : "hover:scale-[1.01] hover:ring-2 hover:ring-primary/10"
      }`}
      style={{
        boxShadow:
          "0 8px 40px 0 rgba(31,38,135,0.28), 0 2px 24px 0 rgba(80,80,255,0.18), 0 1.5px 8px 0 rgba(80,80,255,0.10)",
        border: "2px solid rgba(80,80,255,0.18)",
        backdropFilter: "blur(12px) saturate(1.2)",
      }}
    >
      {/* Decorative background blur */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl opacity-60" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl opacity-50" />
      </div>
      {/* HEADER réorganisé sur une seule ligne principale */}
      <div
        className="relative flex flex-col sm:flex-row items-stretch gap-0 w-full px-2 sm:px-4 pt-3 sm:pt-4 pb-2 z-10 cursor-pointer hover:bg-primary/5/80 transition rounded-t-3xl"
        onClick={handleToggleOpen}
      >
        {/* Bloc gauche : infos principales */}
        <MatchCardHeader
          mode={match.mode}
          date={match.date}
          result={match.result}
          duration={match.duration}
        />
        {/* Bloc centre : champion + spells/runes/items */}
        <MatchCardChampionBlock
          champion={match.champion}
          mainPlayer={mainPlayer}
        />
        {/* Bloc droit : KDA, badges, etc. */}
        <MatchCardStatsBlock
          kdaParts={kdaParts}
          kdaValue={kdaValue}
          pKill={pKill}
          specialBadges={specialBadges}
        />
      </div>
      {/* CONTENU COLLAPSABLE toujours visible sur mobile, collapsable sur sm+ */}
      <div
        className={`overflow-hidden transition-all duration-300 z-10 ${
          shouldShowContent
            ? "max-h-[1200px] opacity-100 py-4 px-2"
            : "max-h-0 opacity-0 p-0"
        }`}
        aria-hidden={!shouldShowContent}
      >
        <MatchCardTabs
          tab={tab}
          setTab={handleSetTab}
          match={match}
          redTeam={redTeam}
          blueTeam={blueTeam}
        />
      </div>
    </div>
  );
};

// Memoized MatchCard component for performance optimization
const MemoizedMatchCard = React.memo(
  MatchCardComponent,
  (prevProps, nextProps) => {
    // Custom comparison function for better memoization
    return (
      prevProps.match.gameId === nextProps.match.gameId &&
      prevProps.match.kda === nextProps.match.kda &&
      prevProps.match.result === nextProps.match.result &&
      prevProps.match.players.length === nextProps.match.players.length
    );
  }
);

MemoizedMatchCard.displayName = "MemoizedMatchCard";

// Apply performance tracking wrapper
const MatchCard = withPerformanceTracking(MemoizedMatchCard, "MatchCard");

export const MatchCardSkeleton: React.FC = () => (
  <div className="card bg-gradient-to-br from-base-200/90 to-base-100/80 border border-primary/30 shadow-2xl rounded-3xl mb-6 transition-all duration-300 pb-4 animate-pulse relative overflow-hidden">
    <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl opacity-60" />
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl opacity-50" />
    <div className="relative flex flex-row items-stretch gap-0 w-full px-4 pt-4 pb-2 group z-10">
      {/* Bloc gauche */}
      <div className="flex flex-col justify-center min-w-[120px] max-w-[160px] bg-base-200/80 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none border-b sm:border-b-0 sm:border-r border-primary/10 px-2">
        <div className="skeleton h-4 w-16 mb-2" />
        <div className="skeleton h-3 w-12 mb-2" />
        <div className="skeleton h-4 w-14 mb-2" />
        <div className="skeleton h-3 w-10" />
      </div>
      {/* Bloc centre */}
      <div className="flex flex-row items-center gap-3 px-4">
        <div className="avatar relative">
          <div className="mask mask-squircle w-16 h-16 border-4 border-primary shadow-lg shadow-primary/30">
            <div className="skeleton w-16 h-16 rounded" />
          </div>
          <span className="absolute -bottom-2 -right-2 skeleton badge badge-primary badge-xs shadow w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1 ml-2">
          <div className="flex gap-1">
            <div className="skeleton w-7 h-7 rounded" />
            <div className="skeleton w-7 h-7 rounded" />
          </div>
          <div className="flex gap-1 mt-1">
            <div className="skeleton w-7 h-7 rounded-full" />
            <div className="skeleton w-7 h-7 rounded-full" />
          </div>
          <div className="flex gap-1 mt-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton w-7 h-7 rounded" />
            ))}
          </div>
        </div>
      </div>
      {/* Bloc droit */}
      <div className="flex flex-col items-center justify-center flex-1 px-2">
        <div className="flex items-end gap-2 text-xl font-extrabold tracking-tight">
          <div className="skeleton h-6 w-8" />
          <div className="skeleton h-6 w-2" />
          <div className="skeleton h-6 w-8" />
          <div className="skeleton h-6 w-2" />
          <div className="skeleton h-6 w-8" />
        </div>
        <div className="skeleton h-4 w-16 mt-2" />
        <div className="skeleton h-3 w-12 mt-2" />
        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          <div className="skeleton h-6 w-20 rounded" />
          <div className="skeleton h-6 w-20 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export default MatchCard;
