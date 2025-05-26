"use client";
import React, { useMemo, useCallback } from "react";
import { useEffectiveUser } from "@/shared/hooks/useEffectiveUser";
import { useOptimizedMasteries } from "@/shared/hooks/useOptimizedFetch";
import { withPerformanceTracking } from "@/shared/components/performance/SimplePerformanceWrapper";
import { apiCache } from "@/shared/lib/cache/CacheManager";
import championData from "@/../public/assets/data/en_US/champion.json";
import { getChampionIcon } from "@/shared/lib/utils/helpers";
import Image from "next/image";
import type { UseOptimizedFetchResult } from "@/shared/hooks/useOptimizedFetch";

interface Mastery {
  championId: number;
  championPoints: number;
  championLevel: number;
}

interface ChampionData {
  id: string;
  key: string;
  name: string;
}

interface MasteriesResponse {
  success: boolean;
  data: Mastery[];
}

// Memoized row component for better performance
const MasteryRow: React.FC<{
  mastery: Mastery & { champ?: ChampionData };
}> = React.memo(({ mastery }) => (
  <tr key={mastery.championId} className="hover:bg-base-200">
    <td className="flex items-center gap-2">
      <Image
        src={getChampionIcon(
          mastery.champ ? mastery.champ.id : String(mastery.championId)
        )}
        alt={mastery.champ ? mastery.champ.name : String(mastery.championId)}
        width={32}
        height={32}
        className="w-8 h-8 rounded"
      />
      <span>{mastery.champ ? mastery.champ.name : mastery.championId}</span>
    </td>
    <td>
      <span className="badge badge-info badge-outline">
        {mastery.championLevel}
      </span>
    </td>
    <td>
      <span className="text-base-content/80">
        {mastery.championPoints.toLocaleString()}
      </span>
    </td>
  </tr>
));

MasteryRow.displayName = "MasteryRow";

const MasteryTab: React.FC = React.memo(() => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  // Use optimized fetch for masteries
  const {
    data: masteriesResponse,
    loading,
    error,
  } = useOptimizedMasteries(
    effectiveRegion,
    effectiveName,
    effectiveTagline
  ) as UseOptimizedFetchResult<{ success: boolean; data: Mastery[] }>;
  const masteries = useMemo(() => {
    if (!masteriesResponse || typeof masteriesResponse !== "object") return [];
    return (masteriesResponse as MasteriesResponse)?.data || [];
  }, [masteriesResponse]); // Memoized calculations
  const masteryStats = useMemo(() => {
    const totalPoints = masteries.reduce(
      (acc: number, m: Mastery) => acc + m.championPoints,
      0
    );
    const totalChampions = masteries.length;
    const avgLevel =
      totalChampions > 0
        ? masteries.reduce(
            (acc: number, m: Mastery) => acc + m.championLevel,
            0
          ) / totalChampions
        : 0;

    return { totalPoints, totalChampions, avgLevel };
  }, [masteries]);
  // Memoized champion data lookup for performance
  const championDataLookup = useMemo(() => {
    return Object.values(championData.data) as ChampionData[];
  }, []);
  // Memoized champion data lookup
  const masteriesWithChampions = useMemo(() => {
    return masteries.map((m: Mastery) => {
      const champ = championDataLookup.find(
        (c: ChampionData) => parseInt(c.key) === m.championId
      );
      return { ...m, champ };
    });
  }, [masteries, championDataLookup]);

  if (loading)
    return <div className="loading loading-spinner loading-lg mx-auto my-8" />;
  if (error) return <div className="alert alert-error">Error: {error}</div>;
  if (masteries.length === 0)
    return <div className="alert alert-info">No mastery found.</div>;

  return (
    <div className="overflow-x-auto">
      <div className="stats stats-horizontal shadow mb-4">
        <div className="stat">
          <div className="stat-title">Total Champions</div>
          <div className="stat-value text-lg">
            {masteryStats.totalChampions}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Points</div>
          <div className="stat-value text-lg">
            {masteryStats.totalPoints.toLocaleString()}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Average Level</div>
          <div className="stat-value text-lg">
            {masteryStats.avgLevel.toFixed(1)}
          </div>
        </div>
      </div>

      <table className="table table-zebra rounded-xl bg-base-100 shadow">
        <thead>
          <tr>
            <th>Champion</th>
            <th>Level</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {masteriesWithChampions.map(
            (m: Mastery & { champ?: ChampionData }) => (
              <MasteryRow key={m.championId} mastery={m} />
            )
          )}
        </tbody>
      </table>
    </div>
  );
});

MasteryTab.displayName = "MasteryTab";

export default withPerformanceTracking(MasteryTab, "MasteryTab");
