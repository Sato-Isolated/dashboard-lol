"use client";
import React, { useEffect, useState } from "react";
import type { UIRecentlyPlayed } from "@/types/ui-leftcolumn";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import { useAccountSummoner } from "@/hooks/useAccountSummoner";
import RankBadge from "./RankBadge";

const LeftColumn: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const {
    leagues,
    aramScore = 0,
    loading: loadingSummoner,
  } = useAccountSummoner(effectiveRegion, effectiveName, effectiveTagline);

  const [recentlyPlayed, setRecentlyPlayed] = useState<UIRecentlyPlayed[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    if (!effectiveName || !effectiveRegion || !effectiveTagline) return;
    setFetchError(null);
    fetch(
      `/api/summoner/recently-played?name=${encodeURIComponent(
        effectiveName
      )}&region=${encodeURIComponent(
        effectiveRegion
      )}&tagline=${encodeURIComponent(effectiveTagline)}&limit=5`,
      { signal: controller.signal }
    )
      .then((res) => {
        if (!res.ok)
          throw new Error("Error while loading recently played players");
        return res.json();
      })
      .then((data) => setRecentlyPlayed(data.data || []))
      .catch((e) => {
        if (e.name === "AbortError") return;
        setFetchError(e.message);
      });
    return () => controller.abort();
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  const isLoading = loadingSummoner || recentlyPlayed.length === 0;
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="card bg-base-100 rounded-xl shadow-xl p-4 w-full flex flex-col items-center border border-primary/20">
          <div className="skeleton h-6 w-32 mb-2" />
          <div className="skeleton h-10 w-24 rounded-full mb-2" />
          <div className="skeleton h-4 w-24 mb-1" />
        </div>
        <div className="card bg-base-100 rounded-xl shadow-xl p-4 w-full flex flex-col items-center border border-primary/20">
          <div className="skeleton h-6 w-32 mb-2" />
          <div className="flex flex-col gap-2 w-full">
            <div className="skeleton h-4 w-full mb-1" />
            <div className="skeleton h-4 w-full mb-1" />
            <div className="skeleton h-4 w-full mb-1" />
          </div>
        </div>
      </div>
    );
  }

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
          {/* ARAM Rank Display */}
          <RankBadge aramScore={aramScore} leagues={leagues} />
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
