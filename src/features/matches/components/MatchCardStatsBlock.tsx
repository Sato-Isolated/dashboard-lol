import React, { useMemo } from "react";

interface Badge {
  label: string;
  color: string;
  icon: string;
}

interface MatchCardStatsBlockProps {
  kdaParts: string[];
  kdaValue: string | number;
  pKill: string;
  specialBadges: Badge[];
}

const MatchCardStatsBlockComponent: React.FC<MatchCardStatsBlockProps> = ({
  kdaParts,
  kdaValue,
  pKill,
  specialBadges,
}) => {
  // Memoize KDA parts to avoid array access on every render
  const { kills, deaths, assists } = useMemo(
    () => ({
      kills: kdaParts[0],
      deaths: kdaParts[1],
      assists: kdaParts[2],
    }),
    [kdaParts]
  );

  // Memoize badges to prevent unnecessary re-renders when array reference changes
  const renderBadges = useMemo(
    () =>
      specialBadges.map((b) => (
        <span
          key={b.label}
          className={`badge badge-lg text-white font-bold shadow-md bg-gradient-to-r ${b.color} border-0 flex items-center gap-1 px-3 py-2 text-sm animate-pulse`}
        >
          <span>{b.icon}</span> {b.label}
        </span>
      )),
    [specialBadges]
  );

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-2 min-w-[140px]">
      <div className="flex items-end gap-2 text-2xl font-extrabold tracking-tight">
        <span className="text-base-content drop-shadow font-mono">{kills}</span>
        <span className="text-error">/</span>
        <span className="text-base-content drop-shadow font-mono">
          {deaths}
        </span>
        <span className="text-error">/</span>
        <span className="text-base-content drop-shadow font-mono">
          {assists}
        </span>
      </div>
      <span className="text-xs font-bold text-primary/80 mt-1 flex items-center gap-1">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-info/20 text-info font-bold border border-info/40">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 20l9-5-9-5-9 5 9 5z" />
          </svg>
          KDA: {kdaValue}
        </span>
      </span>
      <span className="text-xs text-error font-bold mt-1 flex items-center gap-1">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/20 text-error font-bold border border-error/40">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          P/Kill {pKill}%
        </span>
      </span>
      <div className="flex gap-2 mt-2 flex-wrap justify-center">
        {renderBadges}
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchCardStatsBlock = React.memo(MatchCardStatsBlockComponent);
MatchCardStatsBlock.displayName = "MatchCardStatsBlock";

export default MatchCardStatsBlock;
