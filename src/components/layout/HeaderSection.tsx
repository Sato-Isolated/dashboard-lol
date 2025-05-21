"use client";
import React from "react";
import Image from "next/image";
import { getSummonerIcon } from "@/utils/helper";
import {
  handleUserUpdate,
  handleUserChampionMastery,
  handleUserRecentlyPlayedUpdate,
} from "@/lib/backgroundApiFetcher";
import { useAccountSummoner } from "@/hooks/useAccountSummoner";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";

const HeaderSection: React.FC = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const {
    account,
    summoner,
    loading: loadingSummoner,
    error: errorSummoner
  } = useAccountSummoner(effectiveRegion, effectiveName, effectiveTagline);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      await handleUserUpdate(effectiveRegion, effectiveName, effectiveTagline);
      await handleUserChampionMastery(
        effectiveRegion,
        effectiveName,
        effectiveTagline
      );
      await handleUserRecentlyPlayedUpdate(
        effectiveRegion,
        effectiveName,
        effectiveTagline
      );
      window.location.reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la mise à jour.");
    }
    setLoading(false);
  };
  if (loadingSummoner) return <div>Chargement...</div>;
  if (errorSummoner || !account || !summoner)
    return <div className="text-error">Erreur de chargement du joueur.</div>;
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full bg-base-200 rounded-xl p-6 shadow">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Image
          src={getSummonerIcon(summoner.profileIconId)}
          alt={account.gameName}
          width={80}
          height={80}
          className="rounded-full border-4 border-primary"
          onError={(e) => {
            e.currentTarget.src = "/assets/profileicon/0.png";
          }}
        />
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-base-content">
            {effectiveName}
            <span className="text-base-content/60">#{effectiveTagline}</span>
          </span>
          <span className="text-base-content/70 text-sm mt-1">
            {effectiveRegion.toUpperCase()}
          </span>
          <span className="text-base-content/50 text-xs">
            Level {summoner.summonerLevel}
          </span>
        </div>
      </div>
      <div className="flex-1 flex justify-end items-center gap-2 w-full md:w-auto">
        <button
          className="btn btn-primary btn-sm"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Mise à jour..." : "Update"}
        </button>
      </div>
      {error && (
        <div className="text-error text-xs text-center w-full mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default HeaderSection;
