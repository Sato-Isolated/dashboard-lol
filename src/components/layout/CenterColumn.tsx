"use client";
import React, { useState, useEffect } from "react";
import type { Match } from "@/types/match";
import type { UIMatch } from "@/types/ui-match";
import { MatchCard, mapRiotMatchToUIMatch } from "../match/MatchCard";

const fakeStats = {
  kda: "3.2",
  winrate: "58%",
  championPool: ["Ahri", "Lee Sin", "Jinx"],
};

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
