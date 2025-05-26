import React, { useMemo } from "react";

interface MatchCardHeaderProps {
  mode: string;
  date: string;
  result: string;
  duration: string;
}

const MatchCardHeaderComponent: React.FC<MatchCardHeaderProps> = ({
  mode,
  date,
  result,
  duration,
}) => {
  // Memoize computed values to avoid recalculations
  const isWin = result === "Win";
  const displayResult = useMemo(() => (isWin ? "Victory" : "Defeat"), [isWin]);
  const resultClass = useMemo(
    () => (isWin ? "text-success" : "text-error"),
    [isWin]
  );

  return (
    <div className="flex flex-col justify-center min-w-[120px] max-w-[160px] bg-base-200/90 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none border-2 border-primary/30 shadow-inner px-3 py-2 gap-1">
      <span className="badge badge-primary badge-sm font-bold uppercase tracking-wider mb-1 w-fit">
        {mode}
      </span>
      <span className="text-xs text-base-content/60 font-mono">{date}</span>
      <span className={`mt-2 text-base font-bold ${resultClass}`}>
        {displayResult}
      </span>
      <span className="text-xs text-base-content/70 mt-1 font-mono">
        {duration}
      </span>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchCardHeader = React.memo(MatchCardHeaderComponent);
MatchCardHeader.displayName = "MatchCardHeader";

export default MatchCardHeader;
