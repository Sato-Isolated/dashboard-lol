"use client";
import React, { useEffect, useState } from "react";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import championData from "@/../public/assets/data/en_US/champion.json";
import { getChampionIcon } from "@/utils/helper";

interface Mastery {
  championId: number;
  championPoints: number;
  championLevel: number;
}

const MasteryTab: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } = useEffectiveUser();
  const [masteries, setMasteries] = useState<Mastery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!effectiveName || !effectiveRegion || !effectiveTagline) return;
    setLoading(true);
    setError(null);
    fetch(`/api/summoner/masteries?name=${encodeURIComponent(effectiveName)}&region=${encodeURIComponent(effectiveRegion)}&tagline=${encodeURIComponent(effectiveTagline)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des masteries");
        return res.json();
      })
      .then((data) => {
        setMasteries(data.data || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [effectiveName, effectiveRegion, effectiveTagline]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-error">Erreur : {error}</div>;
  if (masteries.length === 0) return <div>Aucune maîtrise trouvée.</div>;

  // Calcul des totaux
  const totalPoints = masteries.reduce((acc, m) => acc + m.championPoints, 0);
  const totalChampions = masteries.length;
  const avgLevel = totalChampions > 0 ? (masteries.reduce((acc, m) => acc + m.championLevel, 0) / totalChampions) : 0;

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Champion</th>
            <th>Niveau</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {masteries.map((m) => {
            const champ = Object.values(championData.data).find((c) => parseInt(c.key) === m.championId);
            return (
              <tr key={m.championId}>
                <td className="flex items-center gap-2">
                  <img src={getChampionIcon(champ ? champ.id : String(m.championId))} alt={champ ? champ.name : String(m.championId)} className="w-8 h-8 rounded" />
                  <span>{champ ? champ.name : m.championId}</span>
                </td>
                <td>{m.championLevel}</td>
                <td>{m.championPoints.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td>Total</td>
            <td>{avgLevel.toFixed(2)}</td>
            <td>{totalPoints.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MasteryTab; 