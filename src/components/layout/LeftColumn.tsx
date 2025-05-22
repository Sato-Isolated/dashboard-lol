"use client";
import React, { useEffect, useState } from "react";
import { getChampionNameFromId } from "@/utils/helper";
import championData from "@/../public/assets/data/en_US/champion.json";
import type { UIRecentlyPlayed, UIMastery } from "@/types/ui-leftcolumn";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import { useAccountSummoner } from "@/hooks/useAccountSummoner";

const LeftColumn: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const { leagues } = useAccountSummoner(
    effectiveRegion,
    effectiveName,
    effectiveTagline
  );

  const [recentlyPlayed, setRecentlyPlayed] = useState<UIRecentlyPlayed[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!effectiveName || !effectiveRegion || !effectiveTagline) return;
    setFetchError(null);
    // Fetch recently played with
    fetch(
      `/api/summoner/recently-played?name=${encodeURIComponent(
        effectiveName
      )}&region=${encodeURIComponent(
        effectiveRegion
      )}&tagline=${encodeURIComponent(effectiveTagline)}&limit=5`
    )
      .then((res) => {
        if (!res.ok)
          throw new Error(
            "Erreur lors du chargement des joueurs récemment joués"
          );
        return res.json();
      })
      .then((data) => setRecentlyPlayed(data.data || []))
      .catch((e) => setFetchError(e.message));
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  return (
    <div className="flex flex-col gap-4">
      {fetchError && (
        <div className="alert alert-error text-xs text-center mb-2 py-1 px-2">
          {fetchError}
        </div>
      )}
      <div className="card bg-base-100 rounded-xl shadow-xl p-4 w-full flex flex-col items-center border border-primary/20">
        <span className="font-bold text-primary text-lg mb-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          Rank & Badges
        </span>
        <div className="flex flex-col gap-2 w-full">
          {leagues.length === 0 ? (
            <span className="badge badge-outline text-base-content/50 text-xs py-2 px-4">
              Unranked
            </span>
          ) : (
            leagues.map((rank, i) => (
              <div
                key={i}
                className="flex justify-between items-center w-full bg-base-200 rounded-lg px-3 py-2 mb-1 border border-base-300 hover:shadow-md transition"
              >
                <span className="font-semibold text-base-content/90">
                  {rank.queueType.replace("RANKED_", "")}
                </span>
                <span className="text-primary font-bold">
                  {rank.tier} {rank.rank}{" "}
                  <span className="text-xs text-base-content/60">
                    ({rank.leaguePoints} LP)
                  </span>
                </span>
                <span className="text-xs text-success font-semibold">
                  {rank.wins}W
                </span>
                <span className="text-xs text-error font-semibold">
                  {rank.losses}L
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="card bg-base-100 rounded-xl shadow-xl p-4 w-full flex flex-col items-center border border-primary/20">
        <span className="font-bold text-primary text-lg mb-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
          Recently Played With
        </span>
        <div className="w-full">
          {recentlyPlayed.length === 0 ? (
            <span className="text-base-content/50 text-xs">No data</span>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-md table-zebra w-full">
                <thead>
                  <tr className="text-sm text-base-content/60">
                    <th className="w-1/2">Summoner</th>
                    <th className="w-1/6 text-center">Games</th>
                    <th className="w-1/6 text-center">WR</th>
                    <th className="w-1/6 text-center">W/L</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyPlayed.map((p, i) => (
                    <tr
                      key={i}
                      className="bg-base-200 hover:bg-base-300 transition"
                    >
                      <td className="w-1/2 truncate font-semibold text-base-content/90 py-3">
                        <a
                          href={`/${effectiveRegion}/summoner/${encodeURIComponent(
                            p.name
                          )}/${encodeURIComponent(
                            p.tagline ? p.tagline : effectiveTagline
                          )}`}
                          className="link link-primary hover:underline"
                        >
                          {p.name}
                        </a>
                      </td>
                      <td className="w-1/6 text-center py-3">
                        <span className="inline-flex items-center justify-center rounded-full bg-info text-info-content font-bold text-base h-7 w-7">
                          {p.games}
                        </span>
                      </td>
                      <td className="w-1/6 text-center text-success font-semibold py-3">
                        {p.winrate}%
                      </td>
                      <td className="w-1/6 text-center text-base-content/60 py-3">
                        ({p.wins}W/{p.games - p.wins}L)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;
