"use client";
import React, { useEffect, useState } from "react";
import { getChampionNameFromId } from "@/utils/helper";
import championData from "@/../public/assets/data/en_US/champion.json";
import type { UIRecentlyPlayed, UIMastery } from "@/types/ui-leftcolumn";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";

const fakeRanks = [
  {
    queue: "Solo/Duo",
    tier: "Plastic",
    division: "III",
    lp: 75,
    wins: 120,
    losses: 98,
  },
  { queue: "Flex", tier: "Wood", division: "I", lp: 23, wins: 60, losses: 55 },
];

const LeftColumn: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } = useEffectiveUser();

  const [recentlyPlayed, setRecentlyPlayed] = useState<UIRecentlyPlayed[]>([]);
  const [mastery, setMastery] = useState<UIMastery[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!effectiveName || !effectiveRegion || !effectiveTagline) return;
    setFetchError(null);
    // Fetch recently played with
    fetch(
      `/api/leftcolumn/recently-played?name=${encodeURIComponent(
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
      .then(setRecentlyPlayed)
      .catch((e) => setFetchError(e.message));
    // Fetch mastery
    fetch(
      `/api/leftcolumn/mastery?name=${encodeURIComponent(
        effectiveName
      )}&region=${encodeURIComponent(
        effectiveRegion
      )}&tagline=${encodeURIComponent(effectiveTagline)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des masteries");
        return res.json();
      })
      .then(setMastery)
      .catch((e) => setFetchError(e.message));
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  return (
    <div className="flex flex-col gap-4">
      {fetchError && (
        <div className="text-error text-xs text-center mb-2">{fetchError}</div>
      )}
      <div className="bg-base-100 rounded-xl shadow p-4 w-full flex flex-col items-center">
        <span className="font-semibold text-base-content/80 mb-2">
          Rank & Badges
        </span>
        <div className="flex flex-col gap-1 w-full">
          {/* TODO: Replace with dynamic ranks if available */}
          {fakeRanks.map((rank, i) => (
            <div
              key={i}
              className="flex justify-between w-full text-base-content/80"
            >
              <span>{rank.queue}</span>
              <span>
                {rank.tier} {rank.division}{" "}
                <span className="text-xs">({rank.lp} LP)</span>
              </span>
              <span className="text-xs text-base-content/60">
                {rank.wins}W/{rank.losses}L
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-base-100 rounded-xl shadow p-4 w-full flex flex-col items-center">
        <span className="font-semibold text-base-content/80 mb-2">
          Recently Played With
        </span>
        <div className="flex flex-col gap-1 w-full">
          {recentlyPlayed.length === 0 ? (
            <span className="text-base-content/50 text-xs">No data</span>
          ) : (
            recentlyPlayed.map((p, i) => (
              <div
                key={i}
                className="flex justify-between w-full text-base-content/80"
              >
                <span>{p.name}</span>
                <span>{p.games} games</span>
                <span className="text-xs">
                  {p.winrate}% WR ({p.wins}W/{p.games - p.wins}L)
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="bg-base-100 rounded-xl shadow p-4 w-full flex flex-col items-center">
        <span className="font-semibold text-base-content/80 mb-2">Mastery</span>
        <div className="flex flex-col gap-1 w-full">
          {mastery.length === 0 ? (
            <span className="text-base-content/50 text-xs">No data</span>
          ) : (
            mastery.map((m, i) => (
              <div
                key={i}
                className="flex justify-between w-full text-base-content/80"
              >
                <span>
                  {getChampionNameFromId(
                    m.championId,
                    championData.data as Record<string, any>
                  )}
                </span>
                <span>{m.championPoints.toLocaleString()} pts</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;
