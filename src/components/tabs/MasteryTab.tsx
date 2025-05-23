"use client";
import React, { useEffect, useState } from "react";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import championData from "@/../public/assets/data/en_US/champion.json";
import { getChampionIcon } from "@/utils/helper";
import Image from "next/image";

interface Mastery {
  championId: number;
  championPoints: number;
  championLevel: number;
}

const MasteryTab: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const [masteries, setMasteries] = useState<Mastery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    if (!effectiveName || !effectiveRegion || !effectiveTagline) return;
    setLoading(true);
    setError(null);
    fetch(
      `/api/summoner/masteries?name=${encodeURIComponent(
        effectiveName
      )}&region=${encodeURIComponent(
        effectiveRegion
      )}&tagline=${encodeURIComponent(effectiveTagline)}`,
      { signal: controller.signal }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error while loading masteries");
        return res.json();
      })
      .then((data) => {
        setMasteries(data.data || []);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError(e.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  if (loading)
    return <div className="loading loading-spinner loading-lg mx-auto my-8" />;
  if (error) return <div className="alert alert-error">Error: {error}</div>;
  if (masteries.length === 0)
    return <div className="alert alert-info">No mastery found.</div>;

  // Calculate totals
  const totalPoints = masteries.reduce((acc, m) => acc + m.championPoints, 0);
  const totalChampions = masteries.length;
  const avgLevel =
    totalChampions > 0
      ? masteries.reduce((acc, m) => acc + m.championLevel, 0) / totalChampions
      : 0;

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra rounded-xl bg-base-100 shadow">
        <thead>
          <tr>
            <th>Champion</th>
            <th>Level</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {masteries.map((m) => {
            const champ = Object.values(championData.data).find(
              (c) => parseInt(c.key) === m.championId
            );
            return (
              <tr key={m.championId} className="hover:bg-base-200">
                <td className="flex items-center gap-2">
                  <Image
                    src={getChampionIcon(
                      champ ? champ.id : String(m.championId)
                    )}
                    alt={champ ? champ.name : String(m.championId)}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded"
                  />
                  <span>{champ ? champ.name : m.championId}</span>
                </td>
                <td>
                  <span className="badge badge-info badge-outline">
                    {m.championLevel}
                  </span>
                </td>
                <td>
                  <span className="badge badge-success badge-outline">
                    {m.championPoints.toLocaleString()}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td>Total</td>
            <td>
              <span className="badge badge-info badge-outline">
                {avgLevel.toFixed(2)}
              </span>
            </td>
            <td>
              <span className="badge badge-success badge-outline">
                {totalPoints.toLocaleString()}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MasteryTab;
