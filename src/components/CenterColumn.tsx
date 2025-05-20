"use client";
import React, { useState, useEffect } from "react";
import type { Match } from "@/types/match";
import type { UIMatch, UIPlayer } from "@/types/ui-match";
import { getChampionIcon } from "@/utils/helper";
import Image from "next/image";

const fakeStats = {
  kda: "3.2",
  winrate: "58%",
  championPool: ["Ahri", "Lee Sin", "Jinx"],
};

const TeamTable = ({
  players,
  team,
  teamColor,
}: {
  players: UIPlayer[];
  team: string;
  teamColor: string;
}) => (
  <div
    className={`rounded-xl mb-2 border ${
      teamColor === "red"
        ? "border-red-400 bg-red-50/60"
        : "border-blue-400 bg-blue-50/60"
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
          {players.map((p, idx) => (
            <tr key={idx} className="border-b border-base-200 last:border-b-0">
              <td className="p-1 font-semibold text-base-content flex items-center gap-1">
                <div className="avatar">
                  <div className="mask mask-squircle h-12 w-12">
                    <Image
                      src={getChampionIcon(p.champion)}
                      alt={p.champion}
                      width={48}
                      height={48}
                    />
                  </div>
                </div>
                <span>{p.name}</span>
                {p.mvp && <span className="badge badge-warning ml-1">MVP</span>}
              </td>
              <td>{p.kda}</td>
              <td>{p.cs}</td>
              <td>{p.damage}</td>
              <td>{p.gold}</td>
              <td>
                <div className="flex items-center gap-1">
                  {p.items.map((item: number, i: number) => (
                    <div key={i} className="avatar">
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

const MatchCard: React.FC<{ match: UIMatch }> = ({ match }) => {
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
          <span className="font-bold text-base-content text-lg">
            {match.champion}
          </span>
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

// Transform Riot API match to UI match structure
function mapRiotMatchToUIMatch(
  riotMatch: Match,
  summonerName: string
): UIMatch {
  // Find participant for this summoner
  const participant = riotMatch.info.participants.find(
    (p) => p.riotIdGameName === summonerName
  );
  // Get teams
  const redTeam = riotMatch.info.participants.filter((p) => p.teamId === 200);
  const blueTeam = riotMatch.info.participants.filter((p) => p.teamId === 100);
  // Get win/lose
  const win = participant?.win;
  // Compose KDA
  const kda = participant
    ? `${participant.kills}/${participant.deaths}/${participant.assists}`
    : "-/-/-";
  // Compose players for UI
  const players: UIPlayer[] = [...redTeam, ...blueTeam].map((p) => ({
    name: p.riotIdGameName || p.summonerName || "?",
    champion: p.championName,
    kda: `${p.kills}/${p.deaths}/${p.assists}`,
    cs: p.totalMinionsKilled + p.neutralMinionsKilled,
    damage: p.totalDamageDealtToChampions,
    gold: p.goldEarned,
    items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
    team: p.teamId === 200 ? "Red" : "Blue",
    win: p.win,
    mvp: false, // Optionally add logic for MVP
  }));
  // Compose result
  const result = win ? "Win" : "Loss";
  // Compose date (from riotMatch.info.gameEndTimestamp or metadata)
  const date = riotMatch.info.gameEndTimestamp
    ? new Date(riotMatch.info.gameEndTimestamp).toLocaleDateString()
    : "";
  // Compose mode
  const mode = riotMatch.info.gameMode || "";
  // Compose duration
  const duration = riotMatch.info.gameDuration
    ? `${Math.floor(riotMatch.info.gameDuration / 60)}m ${
        riotMatch.info.gameDuration % 60
      }s`
    : "";
  // Compose team stats
  const teamKills = redTeam.reduce((acc, p) => acc + p.kills, 0);
  const enemyKills = blueTeam.reduce((acc, p) => acc + p.kills, 0);
  const teamGold = redTeam.reduce((acc, p) => acc + p.goldEarned, 0);
  const enemyGold = blueTeam.reduce((acc, p) => acc + p.goldEarned, 0);
  // Parse towers/dragons from teams if available
  let towers = { red: 0, blue: 0 };
  let dragons = { red: 0, blue: 0 };
  if (riotMatch.info.teams && riotMatch.info.teams.length === 2) {
    const red = riotMatch.info.teams.find((t) => t.teamId === 200);
    const blue = riotMatch.info.teams.find((t) => t.teamId === 100);
    towers = {
      red: red?.objectives?.tower?.kills ?? 0,
      blue: blue?.objectives?.tower?.kills ?? 0,
    };
    dragons = {
      red: red?.objectives?.dragon?.kills ?? 0,
      blue: blue?.objectives?.dragon?.kills ?? 0,
    };
  }
  return {
    champion: participant?.championName || "?",
    result,
    kda,
    date,
    mode,
    duration,
    team: win ? "Red" : "Blue",
    teamKills,
    teamGold,
    enemyKills,
    enemyGold,
    players,
    details: {
      duration,
      gold: { red: teamGold, blue: enemyGold },
      kills: { red: teamKills, blue: enemyKills },
      towers,
      dragons,
    },
  };
}

const summonerName = "RafaleDeBlanche"; // TODO: Dynamically get from context or props

const CenterColumn: React.FC = () => {
  const [matches, setMatches] = useState<UIMatch[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  useEffect(() => {
    fetch("/match.json")
      .then((res) => res.json())
      .then((data) => {
        // Debug: log the data type and structure
        console.log("Fetched match.json:", data);
        // Riot API single match: { metadata, info }
        if (data && data.info && Array.isArray(data.info.participants)) {
          setMatches([mapRiotMatchToUIMatch(data as Match, summonerName)]);
        } else if (Array.isArray(data)) {
          setMatches(
            (data as Match[]).map((m) => mapRiotMatchToUIMatch(m, summonerName))
          );
        } else if (data && Array.isArray(data.matches)) {
          setMatches(
            (data.matches as Match[]).map((m) =>
              mapRiotMatchToUIMatch(m, summonerName)
            )
          );
        } else {
          setParseError(
            "Match data is not an array. Type: " +
              typeof data +
              ", keys: " +
              Object.keys(data)
          );
        }
      })
      .catch((e) =>
        setParseError(e?.message || "Unknown error fetching match data.")
      );
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-base-100 rounded-xl shadow p-4 min-h-[120px] flex flex-col items-center justify-center w-full">
        <span className="font-semibold text-base-content mb-2">
          Main Stats & Graphs
        </span>
        <div className="flex flex-col items-center gap-1">
          <div className="text-base-content/80">
            KDA: <b>{fakeStats.kda}</b>
          </div>
          <div className="text-base-content/80">
            Winrate: <b>{fakeStats.winrate}</b>
          </div>
          <div className="text-base-content/80">
            Champion Pool: {fakeStats.championPool.join(", ")}
          </div>
        </div>
      </div>
      <div className="bg-base-100 rounded-xl shadow p-4 min-h-[200px] flex flex-col items-center w-full">
        <span className="font-semibold text-base-content mb-2">
          Match History
        </span>
        <div className="w-full flex flex-col gap-2">
          {parseError && (
            <div className="text-xs text-error">Debug: {parseError}</div>
          )}
          {matches.map((match, idx) => (
            <MatchCard key={idx} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CenterColumn;
