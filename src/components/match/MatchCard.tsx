import { UIMatch } from "@/types/ui-match";
import {
  getChampionIcon,
  getSummonerSpellImage,
  getRuneIcon,
} from "@/utils/helper";
import Image from "next/image";
import React, { useState } from "react";
import TeamTable from "./TeamTable";

// TODO: Props for spells, runes, items, special badges, ranks, etc.

export const MatchCard: React.FC<{ match: UIMatch }> = ({ match }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const redTeam = match.players.filter((p) => p.team === "Red");
  const blueTeam = match.players.filter((p) => p.team === "Blue");

  // TODO: Replace with real data
  const specialBadges = [
    { label: "Quadra Kill", color: "from-pink-500 to-red-500", icon: "🔥" },
    { label: "MVP", color: "from-yellow-400 to-orange-400", icon: "⭐" },
    {
      label: "Unstoppable",
      color: "from-green-400 to-emerald-600",
      icon: "💪",
    },
  ];
  const playerList = match.players.map((p) => ({
    name: p.name,
    champion: p.champion,
  }));

  // Robust KDA split (supports "/" or ":")
  const kdaParts = match.kda.includes("/")
    ? match.kda.split("/")
    : match.kda.split(":");

  // Calculate real KDA (K+A)/D
  const kills = Number(kdaParts[0]);
  const deaths = Number(kdaParts[1]);
  const assists = Number(kdaParts[2]);
  const kdaValue =
    deaths === 0 ? kills + assists : ((kills + assists) / deaths).toFixed(2);

  // Calculate real P/Kill%
  let pKill = "--";
  if (match.teamKills && match.teamKills > 0) {
    pKill = Math.round(((kills + assists) / match.teamKills) * 100).toString();
  }

  // Find the main player (the one who played the displayed champion)
  const mainPlayer = match.players.find((p) => p.champion === match.champion);

  return (
    <div
      className={`bg-gradient-to-br from-base-200 to-base-100 border-2 border-primary/30 shadow-xl rounded-3xl mb-6 transition-all duration-300 pb-4 ${
        open
          ? "ring-4 ring-primary/20 scale-[1.01]"
          : "hover:scale-[1.01] hover:ring-2 hover:ring-primary/10"
      }`}
    >
      {/* HEADER réorganisé sur une seule ligne principale */}
      <div
        className="relative flex flex-row items-stretch gap-0 w-full px-2 pt-2 pb-1 group cursor-pointer hover:bg-primary/5 transition"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Bloc gauche : infos principales */}
        <div className="flex flex-col justify-center min-w-[120px] max-w-[160px] bg-base-200/80 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none border-b sm:border-b-0 sm:border-r border-primary/10 px-2">
          <span className="font-bold text-primary text-xs uppercase tracking-wider">
            {match.mode}
          </span>
          <span className="text-xs text-base-content/60 mt-1">
            {match.date}
          </span>
          <span
            className={`mt-2 text-sm font-bold ${
              match.result === "Win" ? "text-success" : "text-error"
            }`}
          >
            {match.result === "Win" ? "Victory" : "Defeat"}
          </span>
          <span className="text-xs text-base-content/70 mt-1">
            {match.duration}
          </span>
        </div>
        {/* Bloc centre : champion + spells/runes/items */}
        <div className="flex flex-row items-center gap-3 px-4">
          <div className="avatar relative">
            <div className="mask mask-squircle w-16 h-16 border-4 border-primary shadow-lg shadow-primary/30 animate-pulse">
              <Image
                src={getChampionIcon(match.champion)}
                alt={match.champion}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            {/* Level badge (optionnel) */}
            <span className="absolute -bottom-2 -right-2 badge badge-primary badge-xs shadow">
              18
            </span>
          </div>
          <div className="flex flex-col gap-1 ml-2">
            <div className="flex gap-1">
              {/* spells.map ... */}
              {mainPlayer ? (
                <>
                  <Image
                    src={`/assets/spell/${getSummonerSpellImage(
                      mainPlayer.spell1
                    )}`}
                    alt={`Spell 1`}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded shadow"
                  />
                  <Image
                    src={`/assets/spell/${getSummonerSpellImage(
                      mainPlayer.spell2
                    )}`}
                    alt={`Spell 2`}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded shadow"
                  />
                </>
              ) : (
                <>
                  <span className="w-7 h-7 bg-base-300 rounded shadow-inner" />
                  <span className="w-7 h-7 bg-base-300 rounded shadow-inner" />
                </>
              )}
            </div>
            <div className="flex gap-1 mt-1">
              {/* runes.map ... */}
              {mainPlayer && mainPlayer.rune1 && mainPlayer.rune2 ? (
                <>
                  <Image
                    src={`/assets/${getRuneIcon(mainPlayer.rune1)}`}
                    alt={`Rune 1`}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full shadow"
                  />
                  <Image
                    src={`/assets/${getRuneIcon(mainPlayer.rune2)}`}
                    alt={`Rune 2`}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full shadow"
                  />
                </>
              ) : (
                <>
                  <span className="w-7 h-7 bg-base-300 rounded-full shadow-inner" />
                  <span className="w-7 h-7 bg-base-300 rounded-full shadow-inner" />
                </>
              )}
            </div>
            <div className="flex gap-1 mt-1">
              {mainPlayer && mainPlayer.items && mainPlayer.items.length > 0
                ? mainPlayer.items.map((itemId, i) =>
                    itemId > 0 ? (
                      <Image
                        key={itemId + "-" + i}
                        src={`/assets/item/${itemId}.png`}
                        alt={`Item ${itemId}`}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded shadow"
                      />
                    ) : (
                      <span
                        key={i}
                        className="w-7 h-7 bg-base-300 rounded shadow-inner"
                      />
                    )
                  )
                : [...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className="w-7 h-7 bg-base-300 rounded shadow-inner"
                    />
                  ))}
            </div>
          </div>
        </div>
        {/* Bloc droit : KDA, badges, etc. */}
        <div className="flex flex-col items-center justify-center flex-1 px-2">
          {/* Score principal */}
          <div className="flex items-end gap-2 text-xl font-extrabold tracking-tight">
            <span className="text-base-content drop-shadow">{kdaParts[0]}</span>
            <span className="text-error">/</span>
            <span className="text-base-content drop-shadow">{kdaParts[1]}</span>
            <span className="text-error">/</span>
            <span className="text-base-content drop-shadow">{kdaParts[2]}</span>
          </div>
          {/* KDA détaillé */}
          <span className="text-xs font-bold text-primary/80 mt-1">
            KDA: {kdaValue}
          </span>
          {/* P/Kill réel */}
          <span className="text-xs text-error font-bold mt-1">
            P/Kill {pKill}%
          </span>
          {/* Badges spéciaux */}
          <div className="flex gap-2 mt-2 flex-wrap justify-center">
            {specialBadges.map((b) => (
              <span
                key={b.label}
                className={`badge badge-lg text-white font-bold shadow-md bg-gradient-to-r ${b.color} border-0 flex items-center gap-1`}
              >
                <span>{b.icon}</span> {b.label}
              </span>
            ))}
          </div>
        </div>
        {/* Flèche collapse stylisée, positionnée en bas à droite de la card */}
        <button
          className="absolute right-3 bottom-3 bg-base-100/80 rounded-full shadow p-1 border border-primary/20 hover:bg-primary/10 transition z-10"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          aria-label="Toggle details"
          tabIndex={0}
        >
          <span
            className="text-xl text-primary transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            {open ? "▲" : "▼"}
          </span>
        </button>
      </div>
      {/* CONTENU COLLAPSABLE */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open
            ? "max-h-[1200px] opacity-100 py-4 px-2"
            : "max-h-0 opacity-0 p-0"
        }`}
        aria-hidden={!open}
      >
        <div className="w-full">
          {/* Tabs modernisés DaisyUI v5 */}
          <div role="tablist" className="tabs tabs-lift mb-4 flex-wrap">
            <button
              role="tab"
              className={`tab tab-lg font-semibold ${
                tab === "overview" ? "tab-active" : ""
              }`}
              onClick={() => setTab("overview")}
              aria-selected={tab === "overview"}
              tabIndex={0}
              type="button"
            >
              Overview
            </button>
            <button
              role="tab"
              className={`tab tab-lg font-semibold ${
                tab === "team" ? "tab-active" : ""
              }`}
              onClick={() => setTab("team")}
              aria-selected={tab === "team"}
              tabIndex={0}
              type="button"
            >
              Team analysis
            </button>
            <button
              role="tab"
              className={`tab tab-lg font-semibold ${
                tab === "build" ? "tab-active" : ""
              }`}
              onClick={() => setTab("build")}
              aria-selected={tab === "build"}
              tabIndex={0}
              type="button"
            >
              Build
            </button>
          </div>
          {/* Contenu des tabs */}
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              <TeamTable
                players={redTeam}
                team="Victory (Red)"
                teamColor="red"
                teamStats={{
                  kills: match.details.kills.red,
                  gold: match.details.gold.red,
                }}
              />
              <TeamTable
                players={blueTeam}
                team="Defeat (Blue)"
                teamColor="blue"
                teamStats={{
                  kills: match.details.kills.blue,
                  gold: match.details.gold.blue,
                }}
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

export const MatchCardSkeleton: React.FC = () => (
  <div className="bg-gradient-to-br from-base-200 to-base-100 border-2 border-primary/30 shadow-xl rounded-3xl mb-6 transition-all duration-300 pb-4 animate-pulse">
    <div className="relative flex flex-row items-stretch gap-0 w-full px-2 pt-2 pb-1 group">
      {/* Bloc gauche */}
      <div className="flex flex-col justify-center min-w-[120px] max-w-[160px] bg-base-200/80 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none border-b sm:border-b-0 sm:border-r border-primary/10 px-2">
        <div className="skeleton h-4 w-16 mb-2" />
        <div className="skeleton h-3 w-12 mb-2" />
        <div className="skeleton h-4 w-14 mb-2" />
        <div className="skeleton h-3 w-10" />
      </div>
      {/* Bloc centre */}
      <div className="flex flex-row items-center gap-3 px-4">
        <div className="avatar relative">
          <div className="mask mask-squircle w-16 h-16 border-4 border-primary shadow-lg shadow-primary/30">
            <div className="skeleton w-16 h-16 rounded" />
          </div>
          <span className="absolute -bottom-2 -right-2 skeleton badge badge-primary badge-xs shadow w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1 ml-2">
          <div className="flex gap-1">
            <div className="skeleton w-7 h-7 rounded" />
            <div className="skeleton w-7 h-7 rounded" />
          </div>
          <div className="flex gap-1 mt-1">
            <div className="skeleton w-7 h-7 rounded-full" />
            <div className="skeleton w-7 h-7 rounded-full" />
          </div>
          <div className="flex gap-1 mt-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton w-7 h-7 rounded" />
            ))}
          </div>
        </div>
      </div>
      {/* Bloc droit */}
      <div className="flex flex-col items-center justify-center flex-1 px-2">
        <div className="flex items-end gap-2 text-xl font-extrabold tracking-tight">
          <div className="skeleton h-6 w-8" />
          <div className="skeleton h-6 w-2" />
          <div className="skeleton h-6 w-8" />
          <div className="skeleton h-6 w-2" />
          <div className="skeleton h-6 w-8" />
        </div>
        <div className="skeleton h-4 w-16 mt-2" />
        <div className="skeleton h-3 w-12 mt-2" />
        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          <div className="skeleton h-6 w-20 rounded" />
          <div className="skeleton h-6 w-20 rounded" />
        </div>
      </div>
    </div>
  </div>
);
