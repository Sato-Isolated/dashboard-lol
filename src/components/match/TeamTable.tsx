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
    className={`card rounded-xl mb-4 border shadow bg-base-200 ${
      teamColor === "red" ? "border-red-400" : "border-blue-400"
    }`}
  >
    <div
      className={`px-4 py-2 font-bold flex items-center gap-2 text-lg rounded-t-xl ${
        teamColor === "red"
          ? "text-red-400 bg-base-100"
          : "text-blue-400 bg-base-100"
      }`}
    >
      <span>{team} Team</span>
      {teamStats && (
        <>
          <span className="badge badge-info badge-outline ml-2">
            {teamStats.kills} Kills
          </span>
          <span className="badge badge-success badge-outline ml-1">
            {teamStats.gold} Gold
          </span>
        </>
      )}
    </div>
    <div className="overflow-x-auto p-2">
      <table className="table table-zebra rounded-xl">
        <thead>
          <tr className="text-base-content/70">
            <th className="p-1 ">Summoner</th>
            <th>KDA</th>
            <th>CS</th>
            <th>Damage</th>
            <th>Gold</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr
              key={p.name}
              className="hover:bg-base-300 border-b border-base-200 last:border-b-0"
            >
              <td className="p-1 font-semibold text-base-content flex items-center gap-1 w-[180px] min-w-[140px] max-w-[200px]">
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
                  className="hover:underline text-primary"
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                  onClick={(e) => e.stopPropagation()}
                  prefetch={false}
                >
                  {p.name}
                </Link>
                {p.mvp && <span className="badge badge-warning ml-1">MVP</span>}
              </td>
              <td>
                <span className="badge badge-info badge-outline font-mono">
                  {p.kda}
                </span>
              </td>
              <td>{p.cs}</td>
              <td>
                <span className="badge badge-error badge-outline">
                  {p.damage}
                </span>
              </td>
              <td>
                <span className="badge badge-success badge-outline">
                  {p.gold}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-1">
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

export const TeamTable = React.memo(TeamTableComponent);
TeamTable.displayName = "TeamTable";

export default TeamTable;
