"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Crown, Medal, Award, Trophy } from "lucide-react";
import { getSummonerIcon } from "@/shared/lib/utils/helpers";

interface LeaderboardRowProps {
  entry: {
    name: string;
    aramScore: number;
    profileIconId: number;
    tagline: string;
  };
  rank: number;
  platform: string;
  isPriority?: boolean;
  asTableRow?: boolean;
}

// Fonction pour déterminer le tier basé sur le rang et le score
const getTier = (
  rank: number,
  score: number
): { name: string; icon: React.ReactNode; color: string } => {
  if (rank === 1)
    return {
      name: "Champion",
      icon: <Crown className="w-4 h-4" />,
      color: "text-yellow-500",
    };
  if (rank <= 3)
    return {
      name: "Master",
      icon: <Medal className="w-4 h-4" />,
      color: "text-slate-400",
    };
  if (rank <= 10)
    return {
      name: "Diamond",
      icon: <Award className="w-4 h-4" />,
      color: "text-blue-400",
    };
  if (rank <= 25)
    return {
      name: "Platinum",
      icon: <Trophy className="w-4 h-4" />,
      color: "text-green-400",
    };
  if (rank <= 50)
    return {
      name: "Gold",
      icon: <Trophy className="w-4 h-4" />,
      color: "text-yellow-600",
    };
  if (rank <= 100)
    return {
      name: "Silver",
      icon: <Trophy className="w-4 h-4" />,
      color: "text-gray-400",
    };
  return {
    name: "Bronze",
    icon: <Trophy className="w-4 h-4" />,
    color: "text-amber-600",
  };
};

const LeaderboardRowComponent: React.FC<LeaderboardRowProps> = ({
  entry,
  rank,
  platform,
  isPriority = false,
  asTableRow = true,
}) => {
  const tier = getTier(rank, entry.aramScore);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "text-2xl font-bold text-yellow-500";
    if (rank <= 3) return "text-xl font-bold text-slate-400";
    if (rank <= 10) return "text-lg font-bold text-blue-400";
    return "text-lg font-semibold";
  };

  const content = (
    <>
      <td className={getRankStyle(rank)}>{rank}</td>
      <td className="flex items-center gap-4 py-4">
        <div className="relative w-16 h-16">
          <Image
            src={getSummonerIcon(entry.profileIconId)}
            alt="icon"
            fill
            className="rounded-full border border-base-300 object-cover"
            sizes="64px"
            priority={isPriority}
          />
        </div>
        <div className="flex flex-col">
          <Link
            href={`/${platform}/summoner/${encodeURIComponent(
              entry.name
            )}/${encodeURIComponent(entry.tagline)}`}
            className="text-lg font-semibold hover:underline hover:text-primary transition-colors"
          >
            {entry.name.replace(/ /g, "\u00A0")}
          </Link>
          <span className="text-sm text-base-content/60">#{entry.tagline}</span>
        </div>
      </td>
      <td className="text-lg font-semibold">
        {entry.aramScore.toLocaleString()}
      </td>
      <td>
        <div className={`flex items-center gap-2 ${tier.color}`}>
          {tier.icon}
          <span className="font-medium">{tier.name}</span>
        </div>
      </td>
    </>
  );

  if (asTableRow) {
    return (
      <tr className="h-20 hover:bg-primary/5 transition-colors">{content}</tr>
    );
  }

  return content;
};

const LeaderboardRow = React.memo(LeaderboardRowComponent);
LeaderboardRow.displayName = "LeaderboardRow";

export default LeaderboardRow;
