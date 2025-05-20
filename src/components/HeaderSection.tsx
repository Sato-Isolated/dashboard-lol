"use client";
import React from "react";
import Image from "next/image";
import { getSummonerIcon } from "@/utils/helper";
interface HeaderSectionProps {
  summoner: any;
  account: any;
  region: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  summoner,
  account,
  region,
}) => (
  <div className="flex flex-col md:flex-row items-center gap-4 w-full bg-base-200 rounded-xl p-6 shadow">
    <div className="flex items-center gap-4 w-full md:w-auto">
      <Image
        src={getSummonerIcon(summoner.profileIconId)}
        alt={summoner.name}
        width={80}
        height={80}
        className="rounded-full border-4 border-primary"
        onError={(e) => {
          e.currentTarget.src = "/assets/profileicon/0.png";
        }}
      />
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-base-content">
          {account.gameName + " " + account.puuid}
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
      {/* Future: update button, link, etc. */}
    </div>
  </div>
);

export default HeaderSection;
