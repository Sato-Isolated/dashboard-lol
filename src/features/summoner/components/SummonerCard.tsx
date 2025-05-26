"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import { getSummonerIcon } from "@/shared/lib/utils/helpers";
import type { RiotAccountDto } from "@/shared/types/api/account.types";
import type { SummonerDto } from "@/shared/types/api/summoners.types";
import { Button } from "@/shared/components/ui/Button";

interface SummonerCardProps {
  account: RiotAccountDto;
  summoner: SummonerDto;
  region: string;
  loading?: boolean;
  error?: string | null;
  onViewProfile?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  showActions?: boolean;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export const SummonerCard: React.FC<SummonerCardProps> = React.memo(
  ({
    account,
    summoner,
    region,
    loading = false,
    error = null,
    onViewProfile,
    onToggleFavorite,
    isFavorite = false,
    showActions = true,
    variant = "default",
    className = "",
  }) => {
    // Memoized error handler for image loading
    const handleImageError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = "/assets/profileicon/0.png";
      },
      []
    );
    // Loading state
    if (loading) {
      return (
        <div
          className={`bg-base-200 rounded-xl p-4 shadow animate-pulse ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="skeleton h-12 w-12 rounded-full" />
            <div className="flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-20 mb-1" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
          {showActions && (variant === "default" || variant === "detailed") && (
            <div className="flex gap-2 mt-3">
              <div className="skeleton h-8 w-20 rounded" />
              <div className="skeleton h-8 w-8 rounded" />
            </div>
          )}
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div
          className={`bg-base-200 rounded-xl p-4 shadow border border-error/20 ${className}`}
        >
          <div className="flex items-center gap-2 text-error">
            <span className="text-sm">⚠️</span>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      );
    }

    // Compact variant
    if (variant === "compact") {
      return (
        <div
          className={`bg-base-200 rounded-lg p-3 shadow hover:shadow-md transition-shadow cursor-pointer ${className}`}
          onClick={onViewProfile}
        >
          <div className="flex items-center gap-2">
            <Image
              src={getSummonerIcon(summoner.profileIconId)}
              alt={account.gameName}
              width={32}
              height={32}
              className="rounded-full border-2 border-primary/50"
              onError={handleImageError}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-base-content truncate">
                {account.gameName}
                <span className="text-base-content/60">#{account.tagLine}</span>
              </div>
              <div className="text-xs text-base-content/70">
                {region.toUpperCase()} • Level {summoner.summonerLevel}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default and detailed variants
    return (
      <div
        className={`bg-base-200 rounded-xl p-4 shadow hover:shadow-lg transition-shadow ${className}`}
      >
        <div className="flex items-center gap-3">
          <Image
            src={getSummonerIcon(summoner.profileIconId)}
            alt={account.gameName}
            width={variant === "detailed" ? 60 : 48}
            height={variant === "detailed" ? 60 : 48}
            className="rounded-full border-3 border-primary"
            onError={handleImageError}
          />
          <div className="flex-1">
            <div className="text-lg font-bold text-base-content">
              {account.gameName}
              <span className="text-base-content/60">#{account.tagLine}</span>
            </div>
            <div className="text-sm text-base-content/70 mt-1">
              {region.toUpperCase()}
            </div>
            <div className="text-xs text-base-content/50">
              Level {summoner.summonerLevel}
            </div>
            {variant === "detailed" && (
              <div className="text-xs text-base-content/40 mt-1">
                ID: {summoner.id}
              </div>
            )}
          </div>
        </div>
        {showActions && (variant === "default" || variant === "detailed") && (
          <div className="flex gap-2 mt-4">
            {onViewProfile && (
              <Button
                variant="primary"
                size="sm"
                onClick={onViewProfile}
                className="flex-1"
              >
                View Profile
              </Button>
            )}
            {onToggleFavorite && (
              <Button
                variant={isFavorite ? "success" : "outline"}
                size="sm"
                onClick={onToggleFavorite}
                className="px-3"
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                ⭐
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

SummonerCard.displayName = "SummonerCard";

export default SummonerCard;
