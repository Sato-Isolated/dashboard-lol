import React, { useMemo } from "react";
import Image from "next/image";
import {
  getChampionIcon,
  getSummonerSpellImage,
  getRuneIcon,
} from "@/shared/lib/utils/helpers";
import { UIPlayer } from "@/features/matches/types/ui-match.types";

interface MatchCardChampionBlockProps {
  champion: string;
  mainPlayer?: UIPlayer;
}

const MatchCardChampionBlockComponent: React.FC<
  MatchCardChampionBlockProps
> = ({ champion, mainPlayer }) => {
  // Memoize heavy calculations and transformations
  const championIcon = useMemo(() => getChampionIcon(champion), [champion]);

  const spellData = useMemo(() => {
    if (!mainPlayer) return null;
    return {
      spell1: getSummonerSpellImage(mainPlayer.spell1),
      spell2: getSummonerSpellImage(mainPlayer.spell2),
    };
  }, [mainPlayer]);

  const runeData = useMemo(() => {
    if (!mainPlayer?.rune1 || !mainPlayer?.rune2) return null;
    return {
      rune1: getRuneIcon(mainPlayer.rune1),
      rune2: getRuneIcon(mainPlayer.rune2),
    };
  }, [mainPlayer?.rune1, mainPlayer?.rune2]);

  const itemsToRender = useMemo(() => {
    if (!mainPlayer?.items || mainPlayer.items.length === 0) {
      return [...Array(6)].map((_, i) => ({ id: i, itemId: 0 }));
    }
    return mainPlayer.items.map((itemId: number, i: number) => ({
      id: i,
      itemId,
    }));
  }, [mainPlayer?.items]);

  return (
    <div className="flex flex-row items-center gap-4 px-4 min-w-[180px]">
      <div className="avatar relative">
        <div className="mask mask-squircle w-20 h-20 border-4 border-primary shadow-xl shadow-primary/30 bg-base-100">
          <Image
            src={championIcon}
            alt={champion}
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <span className="absolute -bottom-2 -right-2 badge badge-primary badge-md shadow font-bold text-xs">
          18
        </span>
      </div>
      <div className="flex flex-col gap-1 ml-2">
        <div className="flex gap-1">
          {spellData ? (
            <>
              <Image
                src={`/assets/spell/${spellData.spell1}`}
                alt="Spell 1"
                width={32}
                height={32}
                className="w-8 h-8 rounded shadow border border-primary/30 bg-base-200"
              />
              <Image
                src={`/assets/spell/${spellData.spell2}`}
                alt="Spell 2"
                width={32}
                height={32}
                className="w-8 h-8 rounded shadow border border-primary/30 bg-base-200"
              />
            </>
          ) : (
            <>
              <span className="w-8 h-8 bg-base-300 rounded shadow-inner" />
              <span className="w-8 h-8 bg-base-300 rounded shadow-inner" />
            </>
          )}
        </div>
        <div className="flex gap-1 mt-1">
          {runeData ? (
            <>
              <Image
                src={`/assets/${runeData.rune1}`}
                alt="Rune 1"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full shadow border border-primary/20 bg-base-200"
              />
              <Image
                src={`/assets/${runeData.rune2}`}
                alt="Rune 2"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full shadow border border-primary/20 bg-base-200"
              />
            </>
          ) : (
            <>
              <span className="w-8 h-8 bg-base-300 rounded-full shadow-inner" />
              <span className="w-8 h-8 bg-base-300 rounded-full shadow-inner" />
            </>
          )}
        </div>
        <div className="flex gap-1 mt-1">
          {itemsToRender.map((item) =>
            item.itemId > 0 ? (
              <Image
                key={`item-${item.itemId}-${item.id}`}
                src={`/assets/item/${item.itemId}.png`}
                alt={`Item ${item.itemId}`}
                width={32}
                height={32}
                className="w-8 h-8 rounded shadow border border-base-300 bg-base-100"
              />
            ) : (
              <span
                key={`empty-${item.id}`}
                className="w-8 h-8 bg-base-300 rounded shadow-inner"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchCardChampionBlock = React.memo(MatchCardChampionBlockComponent);
MatchCardChampionBlock.displayName = "MatchCardChampionBlock";

export default MatchCardChampionBlock;
