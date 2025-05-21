"use client";
import React from "react";
import Image from "next/image";
import { getSummonerIcon } from "@/utils/helper";
import {
  handleUserUpdate,
  handleUserChampionMastery,
  handleUserRecentlyPlayedUpdate,
} from "@/lib/backgroundApiFetcher";
import type { RiotAccountDto } from "@/types/api/account";
import type { SummonerDto } from "@/types/api/summoners";

interface HeaderSectionProps {
  summoner: SummonerDto;
  account: RiotAccountDto;
  region: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  summoner,
  account,
  region,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      await handleUserUpdate(region, account.gameName, account.tagLine);
      await handleUserChampionMastery(
        region,
        account.gameName,
        account.tagLine
      );
      await handleUserRecentlyPlayedUpdate(
        region,
        account.gameName,
        account.tagLine
      );
      // Forcer le rafraîchissement des colonnes (LeftColumn, CenterColumn)
      window.location.reload();
    } catch (e: any) {
      setError(e?.message || "Erreur lors de la mise à jour.");
    }
    setLoading(false);
  };
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
            {account.gameName}
            <span className="text-base-content/60">#{account.tagLine}</span>
          </span>
          <span className="text-base-content/70 text-sm mt-1">
            {region.toUpperCase()}
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
