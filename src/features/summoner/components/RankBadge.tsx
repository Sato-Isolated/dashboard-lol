import React, { useMemo } from "react";
import { getAramRank } from "@/features/aram/utils/aramRankSystem";
import { withPerformanceTracking } from "@/shared/components/performance/SimplePerformanceWrapper";

interface RankBadgeProps {
  aramScore: number;
  leagues: Array<{
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }>;
}

interface RankItemProps {
  rank: {
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  };
}

const RankItemComponent: React.FC<RankItemProps> = ({ rank }) => (
  <div className="flex justify-between items-center w-full bg-base-200 rounded-lg px-3 py-2 border border-base-300 hover:shadow-md transition">
    <span className="font-semibold text-base-content/90">
      {rank.queueType
        .replace("RANKED_", "")
        .replace("_5x5", "")
        .replace("_SR", "")}
    </span>
    <span className="text-primary font-bold">
      {rank.tier} {rank.rank}
      <span className="text-xs text-base-content/60">
        ({rank.leaguePoints} LP)
      </span>
    </span>
    <span className="text-xs text-success font-semibold">{rank.wins}W</span>
    <span className="text-xs text-error font-semibold">{rank.losses}L</span>
  </div>
);

const RankItem = React.memo(RankItemComponent);
RankItem.displayName = "RankItem";

const RankBadge: React.FC<RankBadgeProps> = ({ aramScore, leagues }) => {
  const aramRank = useMemo(() => getAramRank(aramScore), [aramScore]);
  const rankedLeagues = useMemo(() => {
    if (!leagues || leagues.length === 0) {
      return (
        <span className="badge badge-outline text-base-content/50 text-xs py-2 px-4">
          Unranked
        </span>
      );
    }

    return leagues.map((rank, i) => (
      <RankItem key={`${rank.queueType}-${i}`} rank={rank} />
    ));
  }, [leagues]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="card bg-base-100 rounded-2xl shadow-xl p-4 w-full border border-primary/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar placeholder">
            <div className="bg-gradient-to-br from-primary to-accent text-neutral-content rounded-full w-14 h-14 flex items-center justify-center border-4 border-primary/30">
              <span
                className="text-2xl font-bold"
                style={{ color: aramRank.color }}
              >
                {aramRank.displayName[0]}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span
              className="text-lg font-bold"
              style={{ color: aramRank.color }}
            >
              {aramRank.displayName}
            </span>
            <span className="text-xs text-base-content/60">
              ARAM Score:
              <span className="font-semibold text-base-content/80">
                {aramScore}
              </span>
            </span>
          </div>
        </div>
        <div className="divider text-xs text-base-content/40">League Rank</div>
        <div className="flex flex-col gap-2 w-full">{rankedLeagues}</div>
      </div>
    </div>
  );
};

export default withPerformanceTracking(RankBadge, "RankBadge");
