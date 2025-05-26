"use client";
import React from "react";
import { SummonerCard } from "../SummonerCard";
import { SummonerStats } from "../SummonerStats";
import type { RiotAccountDto } from "@/shared/types/api/account.types";
import type {
  SummonerDto,
  LeagueEntry,
} from "@/shared/types/api/summoners.types";

// Example data for demonstration
const exampleAccount: RiotAccountDto = {
  puuid: "example-puuid",
  gameName: "ExamplePlayer",
  tagLine: "EUW1",
};

const exampleSummoner: SummonerDto = {
  accountId: 123456789,
  profileIconId: 4560,
  revisionDate: Date.now(),
  id: "example-summoner-id",
  puuid: "example-puuid",
  summonerLevel: 147,
};

const exampleLeagues: LeagueEntry[] = [
  {
    leagueId: "example-league-1",
    queueType: "RANKED_SOLO_5x5",
    tier: "GOLD",
    rank: "II",
    summonerId: "example-summoner-id",
    summonerName: "ExamplePlayer",
    leaguePoints: 1247,
    wins: 89,
    losses: 67,
    hotStreak: true,
    veteran: false,
    freshBlood: false,
    inactive: false,
  },
  {
    leagueId: "example-league-2",
    queueType: "RANKED_FLEX_SR",
    tier: "SILVER",
    rank: "I",
    summonerId: "example-summoner-id",
    summonerName: "ExamplePlayer",
    leaguePoints: 892,
    wins: 34,
    losses: 28,
    hotStreak: false,
    veteran: true,
    freshBlood: false,
    inactive: false,
  },
];

/**
 * Example usage of the newly implemented SummonerCard and SummonerStats components
 * This demonstrates the different variants and features available
 */
export const ComponentExamples: React.FC = () => {
  const handleViewProfile = () => {
    console.log("View profile clicked");
  };

  const handleToggleFavorite = () => {
    console.log("Toggle favorite clicked");
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-base-content">
        Summoner Components Examples
      </h1>

      {/* SummonerCard Examples */}
      <section>
        <h2 className="text-2xl font-semibold text-base-content mb-4">
          SummonerCard Variants
        </h2>

        <div className="space-y-6">
          {/* Compact Variant */}
          <div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              Compact
            </h3>
            <div className="max-w-sm">
              <SummonerCard
                account={exampleAccount}
                summoner={exampleSummoner}
                region="euw1"
                variant="compact"
                onViewProfile={handleViewProfile}
              />
            </div>
          </div>

          {/* Default Variant */}
          <div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              Default
            </h3>
            <div className="max-w-md">
              <SummonerCard
                account={exampleAccount}
                summoner={exampleSummoner}
                region="euw1"
                variant="default"
                onViewProfile={handleViewProfile}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={false}
              />
            </div>
          </div>

          {/* Detailed Variant */}
          <div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              Detailed
            </h3>
            <div className="max-w-md">
              <SummonerCard
                account={exampleAccount}
                summoner={exampleSummoner}
                region="euw1"
                variant="detailed"
                onViewProfile={handleViewProfile}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={true}
              />
            </div>
          </div>

          {/* Loading State */}
          <div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              Loading State
            </h3>
            <div className="max-w-md">
              <SummonerCard
                account={exampleAccount}
                summoner={exampleSummoner}
                region="euw1"
                loading={true}
              />
            </div>
          </div>

          {/* Error State */}
          <div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              Error State
            </h3>
            <div className="max-w-md">
              <SummonerCard
                account={exampleAccount}
                summoner={exampleSummoner}
                region="euw1"
                error="Failed to load summoner data"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SummonerStats Examples */}
      <section>
        <h2 className="text-2xl font-semibold text-base-content mb-4">
          SummonerStats Variants
        </h2>

        <div className="space-y-6">
          {/* Compact Variant */}
          <div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              Compact
            </h3>
            <SummonerStats
              leagues={exampleLeagues}
              aramScore={1850}
              variant="compact"
            />
          </div>

          {/* Default Variant */}
          <div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              Default
            </h3>
            <SummonerStats
              leagues={exampleLeagues}
              aramScore={2456}
              variant="default"
            />
          </div>

          {/* Detailed Variant */}
          <div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              Detailed
            </h3>
            <SummonerStats
              leagues={exampleLeagues}
              aramScore={3150}
              variant="detailed"
            />
          </div>

          {/* Loading State */}
          <div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              Loading State
            </h3>
            <SummonerStats leagues={[]} aramScore={0} loading={true} />
          </div>

          {/* No Data State */}
          <div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              No Ranked Data
            </h3>
            <SummonerStats leagues={[]} aramScore={500} variant="default" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComponentExamples;
