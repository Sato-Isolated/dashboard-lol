import React from "react";
import { UIPlayer } from "@/types/ui-match";
import Image from "next/image";
import Link from "next/link";
import { getRegion } from "@/utils/helper";

const TeamTable: React.FC<{
  players: UIPlayer[];
  team: string;
  teamColor: string;
}> = ({
  players,
  team,
  teamColor,
}) => (
  <div
    className={`rounded-xl mb-2 border ${
      teamColor === "red" ? "border-red-400" : "border-blue-400"
    }`}
  >
    <div
      className={`px-2 py-1 font-bold text-${teamColor}-700 flex items-center gap-2`}
    >
      {team} Team
    </div>
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="text-base-content/70">
            <th className="p-1">Summoner</th>
            <th>KDA</th>
            <th>CS</th>
            <th>Damage</th>
            <th>Gold</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.name} className="border-b border-base-200 last:border-b-0">
              <td className="p-1 font-semibold text-base-content flex items-center gap-1">
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
                  onClick={(e) => e.stopPropagation()}
                  prefetch={false}
                >
                  {p.name}
                </Link>
                {p.mvp && <span className="badge badge-warning ml-1">MVP</span>}
              </td>
              <td>{p.kda}</td>
              <td>{p.cs}</td>
              <td>{p.damage}</td>
              <td>{p.gold}</td>
              <td>
                <div className="flex items-center gap-1">
                  {p.items.map((item) => (
                    <div key={item} className="avatar">
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
export default TeamTable; 