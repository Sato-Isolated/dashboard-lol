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
    <div
      className={`card bg-base-100 border border-base-200 rounded-2xl shadow-lg mb-4 transition-all duration-200 ${
        open ? "ring-2 ring-primary/30" : "hover:shadow-xl"
      }`}
    >
      {/* Header clickable */}
      <button
        className="flex flex-col md:flex-row md:justify-between md:items-center w-full gap-2 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-2xl bg-gradient-to-r from-base-100 to-base-200"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="avatar">
            <div className="mask mask-squircle h-14 w-14 border-2 border-primary">
              <Image
                src={getChampionIcon(match.champion)}
                alt={match.champion}
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-base-content truncate max-w-[120px]">
                {match.champion}
              </span>
              <span
                className={`badge badge-lg font-bold ${
                  match.result === "Win" ? "badge-success" : "badge-error"
                }`}
              >
                {match.result}
              </span>
              <span className="badge badge-outline font-mono">{match.kda}</span>
            </div>
            <span className="text-xs text-base-content/60 mt-1 truncate max-w-[180px]">
              {match.date} • {match.mode} • {match.duration}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-end text-xs">
          <span className="badge badge-info badge-outline">
            {match.teamKills} Kills
          </span>
          <span className="badge badge-success badge-outline">
            {match.teamGold} Gold
          </span>
          <span className="badge badge-error badge-outline">
            {match.enemyKills} Kills
          </span>
          <span className="badge badge-warning badge-outline">
            {match.enemyGold} Gold
          </span>
          <span className="ml-2 text-base-content/40">{open ? "▲" : "▼"}</span>
        </div>
      </button>
      {/* Collapse content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open
            ? "max-h-[1200px] opacity-100 py-4 px-2"
            : "max-h-0 opacity-0 p-0"
        }`}
        aria-hidden={!open}
      >
        <div className="w-full">
          <div className="tabs tabs-bordered mb-4 flex-wrap">
            <button
              className={`tab${tab === "overview" ? " tab-active" : ""}`}
              onClick={() => setTab("overview")}
              type="button"
            >
              <span className="font-semibold">Overview</span>
            </button>
            <button
              className={`tab${tab === "team" ? " tab-active" : ""}`}
              onClick={() => setTab("team")}
              type="button"
            >
              <span className="font-semibold">Team analysis</span>
            </button>
            <button
              className={`tab${tab === "build" ? " tab-active" : ""}`}
              onClick={() => setTab("build")}
              type="button"
            >
              <span className="font-semibold">Build</span>
            </button>
          </div>
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
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
            </div>
          )}
          {tab === "team" && (
            <div className="flex flex-col gap-2 text-base-content/80 p-2">
              <div>
                <span className="font-semibold">Duration:</span>{" "}
                <span className="badge badge-outline ml-1">
                  {match.details.duration}
                </span>
              </div>
              <div>
                <span className="font-semibold">Gold:</span>{" "}
                <span className="badge badge-error ml-1">
                  Red {match.details.gold.red}
                </span>{" "}
                /{" "}
                <span className="badge badge-info ml-1">
                  Blue {match.details.gold.blue}
                </span>
              </div>
              <div>
                <span className="font-semibold">Kills:</span>{" "}
                <span className="badge badge-error ml-1">
                  Red {match.details.kills.red}
                </span>{" "}
                /{" "}
                <span className="badge badge-info ml-1">
                  Blue {match.details.kills.blue}
                </span>
              </div>
              <div>
                <span className="font-semibold">Towers:</span>{" "}
                <span className="badge badge-error ml-1">
                  Red {match.details.towers.red}
                </span>{" "}
                /{" "}
                <span className="badge badge-info ml-1">
                  Blue {match.details.towers.blue}
                </span>
              </div>
              <div>
                <span className="font-semibold">Dragons:</span>{" "}
                <span className="badge badge-error ml-1">
                  Red {match.details.dragons.red}
                </span>{" "}
                /{" "}
                <span className="badge badge-info ml-1">
                  Blue {match.details.dragons.blue}
                </span>
              </div>
            </div>
          )}
          {tab === "build" && (
            <div className="flex flex-col gap-2 text-base-content/80 p-2">
              <div className="alert alert-info">
                Build, runes, spells, etc. (à venir)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
