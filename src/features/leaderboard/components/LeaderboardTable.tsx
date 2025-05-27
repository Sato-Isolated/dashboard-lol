"use client";

import React from "react";
import LeaderboardRow from "./LeaderboardRow";
import { withPerformanceTracking } from "@/shared/components/performance/SimplePerformanceWrapper";

interface LeaderboardTableProps {
  leaderboard: Array<{
    name: string;
    aramScore: number;
    profileIconId: number;
    tagline: string;
  }>;
  platform: string;
}

const LeaderboardTableComponent: React.FC<LeaderboardTableProps> = ({
  leaderboard,
  platform,
}) => (
  <table className="table table-zebra table-lg w-full flex-grow">
    <thead>
      <tr>
        <th className="text-lg">#</th>
        <th className="text-lg">Summoner</th>
        <th className="text-lg">ARAM Score</th>
      </tr>
    </thead>
    <tbody>
      {leaderboard.map((entry, i) => (
        <LeaderboardRow
          key={`${entry.name}-${entry.tagline}-${i}`}
          entry={entry}
          rank={i + 1}
          platform={platform}
          isPriority={i < 10}
        />
      ))}
    </tbody>
  </table>
);

const LeaderboardTable = withPerformanceTracking(
  React.memo(LeaderboardTableComponent),
  "LeaderboardTable"
);
LeaderboardTable.displayName = "LeaderboardTable";

export default LeaderboardTable;