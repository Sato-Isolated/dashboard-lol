"use client";
import React, { useEffect } from "react";
import { MatchCard } from "../match/MatchCard";
import SectionCard from "../common/SectionCard";
import { useMatchHistory } from "@/hooks/useMatchHistory";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import type { UIMatch } from "@/types/ui-match";

function computeStats(matches: UIMatch[]): { kda: string; winrate: string; championPool: string[] } {
  if (!matches || matches.length === 0) {
    return {
      kda: '-',
      winrate: '-',
      championPool: [],
    };
  }
  let kills = 0, deaths = 0, assists = 0, wins = 0;
  const championSet = new Set<string>();
  matches.forEach((m) => {
    const [k, d, a] = m.kda.split('/').map(Number);
    kills += k || 0;
    deaths += d || 0;
    assists += a || 0;
    if (m.result === 'Win') wins++;
    championSet.add(m.champion);
  });
  const kda = deaths === 0 ? (kills + assists).toFixed(2) : ((kills + assists) / deaths).toFixed(2);
  const winrate = ((wins / matches.length) * 100).toFixed(1) + '%';
  return {
    kda,
    winrate,
    championPool: Array.from(championSet),
  };
}

const CenterColumn: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();

  const {
    matches,
    error: parseError,
    loading,
    hasMore,
    fetchMatches,
  } = useMatchHistory();

  const stats = computeStats(matches);

  useEffect(() => {
    if (!effectiveName || !effectiveRegion || !effectiveTagline) {
      // Afficher un message d'erreur si les paramètres sont manquants
      return;
    }
    fetchMatches(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-base-100 rounded-xl shadow p-4 min-h-[120px] flex flex-col items-center justify-center w-full">
        <span className="font-semibold text-base-content mb-2">
          Main Stats & Graphs
        </span>
        <div className="flex flex-col items-center gap-1">
          <div className="text-base-content/80">
            KDA: <b>{stats.kda}</b>
          </div>
          <div className="text-base-content/80">
            Winrate: <b>{stats.winrate}</b>
          </div>
          <div className="text-base-content/80">
            Champion Pool: {stats.championPool.join(", ")}
          </div>
        </div>
      </div>
      <SectionCard
        title="Match History"
        loading={loading}
        error={
          parseError
            ? parseError.includes("Riot") ||
              parseError.includes("base de données")
              ? "Impossible de récupérer les matchs. L'API Riot ou la base de données est peut-être indisponible. Réessayez plus tard."
              : parseError
            : null
        }
      >
        <div className="w-full flex flex-col gap-2">
          <span className="text-xs text-base-content/60 mb-1">
            Matchs affichés : {matches.length}
          </span>
          {(!effectiveName || !effectiveRegion || !effectiveTagline) && (
            <SectionCard
              title="Match History"
              loading={false}
              error={
                "Veuillez renseigner un nom de joueur et un tagline pour afficher l'historique."
              }
            >
              <span className="text-base-content/50 text-xs">No data</span>
            </SectionCard>
          )}
          {matches.length === 0 && !loading && !parseError ? (
            <span className="text-base-content/50 text-xs">No data</span>
          ) : (
            matches.map((match) => (
              <MatchCard
                key={match.champion + match.date + match.mode}
                match={match}
              />
            ))
          )}
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
      </SectionCard>
    </div>
  );
};

export default CenterColumn;
