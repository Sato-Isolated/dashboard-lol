import React from "react";

interface MatchCardHeaderProps {
  mode: string;
  date: string;
  result: string;
  duration: string;
}

const MatchCardHeader: React.FC<MatchCardHeaderProps> = ({
  mode,
  date,
  result,
  duration,
}) => (
  <div className="flex flex-col justify-center min-w-[120px] max-w-[160px] bg-base-200/90 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none border-2 border-primary/30 shadow-inner px-3 py-2 gap-1">
    <span className="badge badge-primary badge-sm font-bold uppercase tracking-wider mb-1 w-fit">
      {mode}
    </span>
    <span className="text-xs text-base-content/60 font-mono">{date}</span>
    <span
      className={`mt-2 text-base font-bold ${
        result === "Win" ? "text-success" : "text-error"
      }`}
    >
      {result === "Win" ? "Victory" : "Defeat"}
    </span>
    <span className="text-xs text-base-content/70 mt-1 font-mono">
      {duration}
    </span>
  </div>
);

export default MatchCardHeader;
