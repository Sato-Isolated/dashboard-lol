import React from "react";
import { UIPlayer } from "@/types/ui-match";
import Image from "next/image";
import Link from "next/link";
import { getRegion } from "@/utils/helper";

const TeamTableComponent: React.FC<{
  players: UIPlayer[];
  team: string;
  teamColor: string;
  teamStats?: { kills: number; gold: number };
}> = ({ players, team, teamColor, teamStats }) => (
  <div
    className={`card rounded-2xl mb-6 border-2 shadow-xl bg-base-200/80 backdrop-blur-md w-full max-w-full`}
    style={{
      boxShadow:
        teamColor === "red"
          ? "0 0 24px 2px rgba(255,0,0,0.10)"
          : "0 0 24px 2px rgba(0,128,255,0.10)",
      borderColor:
        teamColor === "red" ? "rgba(255,0,0,0.6)" : "rgba(0,128,255,0.6)",
    }}
  >
    <div
      className={`px-4 py-2 font-bold flex items-center gap-2 text-lg rounded-t-2xl w-full ${
        teamColor === "red"
          ? "text-red-400 bg-base-100/90 border-b-2 border-red-400/30"
          : "text-blue-400 bg-base-100/90 border-b-2 border-blue-400/30"
      }`}
    >
      <span>{team} Team</span>
      {teamStats && (
        <>
          <span className="badge badge-info badge-outline ml-2 text-base font-bold px-3 py-1">
            {teamStats.kills} Kills
          </span>
          <span className="badge badge-success badge-outline ml-1 text-base font-bold px-3 py-1">
            {teamStats.gold} Gold
          </span>
        </>
      )}
    </div>
    <div className="overflow-x-auto w-full">
      <table className="table table-zebra rounded-xl min-w-[700px] w-full">
        <colgroup>
          <col style={{ width: "22%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "25%" }} />
        </colgroup>
        <thead>
          <tr className="text-base-content/70">
            <th className="p-1 pl-4 text-left">Summoner</th>
            <th className="text-left">KDA</th>
            <th className="text-left">CS</th>
            <th className="text-left">Damage</th>
            <th className="text-left">Gold</th>
            <th className="text-left">Items</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr
              key={p.name}
              className="hover:bg-primary/10 hover:scale-[1.01] transition-all border-b border-base-200 last:border-b-0 group"
              style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.03)" }}
            >
              <td className="p-1 pl-4 font-semibold text-base-content flex items-center gap-2 min-w-[120px] max-w-[220px]">
                <div className="avatar">
                  <div className="mask mask-squircle h-12 w-12">
                    <Image
                      src={"/assets/champion/" + p.champion + ".png"}
                      alt={p.champion}
                      width={48}
                      height={48}
                    />
                  </div>
                </div>
                <Link
                  href={`/${getRegion()}/summoner/${encodeURIComponent(
                    p.name
                  )}/${encodeURIComponent(p.tagline || "EUW")}`}
                  className="hover:underline text-primary max-w-[110px]"
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                  onClick={(e) => e.stopPropagation()}
                  prefetch={false}
                  title={p.name}
                >
                  {p.name}
                </Link>
                {p.mvp && (
                  <span className="badge badge-warning ml-1 animate-pulse">
                    MVP
                  </span>
                )}
              </td>
              <td className="min-w-[70px] max-w-[120px]">
                <span className="badge badge-info badge-outline font-mono px-3 py-1 rounded-full">
                  {p.kda}
                </span>
              </td>
              <td className="min-w-[40px] text-left">{p.cs}</td>
              <td className="min-w-[60px] text-left">
                <span className="badge badge-error badge-outline px-3 py-1 rounded-full animate-glow">
                  {p.damage}
                </span>
              </td>
              <td className="min-w-[60px] text-left">
                <span className="badge badge-success badge-outline px-3 py-1 rounded-full animate-glow">
                  {p.gold}
                </span>
              </td>
              <td className="min-w-[120px] max-w-[220px]">
                <div className="flex items-center gap-1 flex-wrap">
                  {p.items.map((item, idx) => (
                    <div key={item + "-" + idx} className="avatar">
                      <div className="mask mask-squircle h-8 w-8">
                        <Image
                          src={`/assets/item/${item}.png`}
                          alt={`Item ${item}`}
                          width={32}
                          height={32}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const MatchTeamTable = React.memo(TeamTableComponent);
MatchTeamTable.displayName = "MatchTeamTable";

export default MatchTeamTable;
