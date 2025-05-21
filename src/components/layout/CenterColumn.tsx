"use client";
import React, { useState, useEffect } from "react";
import type { Match } from "@/types/api/match";
import type { UIMatch } from "@/types/ui-match";
import { MatchCard, mapRiotMatchToUIMatch } from "../match/MatchCard";
import { useUser } from "@/context/UserContext";
import { useParams } from "next/navigation";

const fakeStats = {
  kda: "3.2",
  winrate: "58%",
  championPool: ["Ahri", "Lee Sin", "Jinx"],
};

const CenterColumn: React.FC = () => {
  const params = useParams();
  const { user } = useUser();
  // On récupère les infos de l'URL si présentes, sinon du contexte
  const region = (params?.region as string) || user.region;
  const tagline = (params?.tagline as string) || user.tagline;
  const name = (params?.name as string) || user.summonerName;

  const [matches, setMatches] = useState<UIMatch[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(0);
  const count = 10;
  const [hasMore, setHasMore] = useState(true);

  const fetchMatches = async (reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        name,
        region,
        tagline,
        start: reset ? "0" : String(start),
        count: String(count),
        // from: String(from),
        // to: String(to),
      });
      const res = await fetch(`/api/matches?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const uiMatches = data.map((m) => mapRiotMatchToUIMatch(m, name));
        setMatches((prev) => (reset ? uiMatches : [...prev, ...uiMatches]));
        setHasMore(data.length === count);
        setStart((prev) => (reset ? count : prev + count));
      } else {
        setParseError("API error: " + JSON.stringify(data));
        setHasMore(false);
      }
    } catch (e: any) {
      setParseError(e?.message || "Unknown error fetching match data.");
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!name || !region || !tagline) {
      setParseError(
        "Veuillez renseigner un nom de joueur et un tagline pour afficher l'historique."
      );
      setMatches([]);
      setHasMore(false);
      return;
    }
    fetchMatches(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, region, tagline]);

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
          <span className="text-xs text-base-content/60 mb-1">
            Matchs affichés : {matches.length}
          </span>
          {parseError && (
            <div className="text-xs text-error">Debug: {parseError}</div>
          )}
          {matches.map((match, idx) => (
            <MatchCard key={idx} match={match} />
          ))}
          {hasMore && (
            <button
              className="btn btn-sm btn-outline mt-2"
              onClick={() => fetchMatches(false)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CenterColumn;
