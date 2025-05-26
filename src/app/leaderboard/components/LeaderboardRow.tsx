"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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
}

const LeaderboardRowComponent: React.FC<LeaderboardRowProps> = ({
  entry,
  rank,
  platform,
  isPriority = false,
}) => (
  <tr className="h-20">
    <td className="text-xl font-bold">{rank}</td>
    <td className="flex items-center gap-4">
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
      <Link
        href={`/${platform}/summoner/${encodeURIComponent(
          entry.name
        )}/${encodeURIComponent(entry.tagline)}`}
        className="text-lg font-semibold hover:underline"
      >
        {entry.name.replace(/ /g, "\u00A0")}
      </Link>
    </td>
    <td className="text-lg">{entry.aramScore}</td>
  </tr>
);

const LeaderboardRow = React.memo(LeaderboardRowComponent);
LeaderboardRow.displayName = "LeaderboardRow";

export default LeaderboardRow;
