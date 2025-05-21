import { UIMatch } from "@/types/ui-match";
import { getChampionIcon } from "@/utils/helper";
import Image from "next/image";
import React, { useState } from "react";
import TeamTable from "./TeamTable";

export const MatchCard: React.FC<{ match: UIMatch }> = ({ match }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const redTeam = match.players.filter((p) => p.team === "Red");
  const blueTeam = match.players.filter((p) => p.team === "Blue");
  return (
    <div className="border rounded-xl shadow p-3 bg-base-200 mb-2">
      <div
        className="flex flex-col md:flex-row md:justify-between md:items-center cursor-pointer gap-2"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex flex-wrap gap-2 items-center">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <Image
                src={getChampionIcon(match.champion)}
                alt={match.champion}
                width={48}
                height={48}
              />
            </div>
          </div>
          <span className="text-base-content/80">{match.kda}</span>
          <span
            className={match.result === "Win" ? "text-success" : "text-error"}
          >
            {match.result}
          </span>
          <span className="text-xs text-base-content/60">
            {match.date} • {match.mode} • {match.duration}
          </span>
        </div>
        <div className="flex gap-2 items-center text-xs">
          <span className="text-blue-600 font-bold">
            {match.teamKills} Kills
          </span>
          <span className="text-blue-600 font-bold">{match.teamGold} Gold</span>
          <span className="text-red-600 font-bold">
            {match.enemyKills} Kills
          </span>
          <span className="text-red-600 font-bold">{match.enemyGold} Gold</span>
        </div>
      </div>
      {open && (
        <div className="mt-3">
          <div className="flex gap-2 border-b border-base-300 mb-2">
            <button
              className={`tab ${tab === "overview" ? "tab-active" : ""}`}
              onClick={() => setTab("overview")}
            >
              Overview
            </button>
            <button
              className={`tab ${tab === "team" ? "tab-active" : ""}`}
              onClick={() => setTab("team")}
            >
              Team analysis
            </button>
            <button
              className={`tab ${tab === "build" ? "tab-active" : ""}`}
              onClick={() => setTab("build")}
            >
              Build
            </button>
          </div>
          {tab === "overview" && (
            <>
              <TeamTable
                players={redTeam}
                team="Victory (Red)"
                teamColor="red"
              />
              <TeamTable
                players={blueTeam}
                team="Defeat (Blue)"
                teamColor="blue"
              />
            </>
          )}
          {tab === "team" && (
            <div className="flex flex-col gap-2 text-base-content/80">
              <div>
                Duration: <b>{match.details.duration}</b>
              </div>
              <div>
                Gold: <b>Red {match.details.gold.red}</b> /{" "}
                <b>Blue {match.details.gold.blue}</b>
              </div>
              <div>
                Kills: <b>Red {match.details.kills.red}</b> /{" "}
                <b>Blue {match.details.kills.blue}</b>
              </div>
              <div>
                Towers: <b>Red {match.details.towers.red}</b> /{" "}
                <b>Blue {match.details.towers.blue}</b>
              </div>
              <div>
                Dragons: <b>Red {match.details.dragons.red}</b> /{" "}
                <b>Blue {match.details.dragons.blue}</b>
              </div>
            </div>
          )}
          {tab === "build" && (
            <div className="flex flex-col gap-2 text-base-content/80">
              <div>Build, runes, spells, etc. (à venir)</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
