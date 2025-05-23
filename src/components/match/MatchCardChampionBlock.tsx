import React from "react";
import Image from "next/image";
import {
  getChampionIcon,
  getSummonerSpellImage,
  getRuneIcon,
} from "@/utils/helper";
import type { UIPlayer } from "@/types/ui-match";

interface MatchCardChampionBlockProps {
  champion: string;
  mainPlayer?: UIPlayer;
}

const MatchCardChampionBlock: React.FC<MatchCardChampionBlockProps> = ({
  champion,
  mainPlayer,
}) => (
  <div className="flex flex-row items-center gap-4 px-4 min-w-[180px]">
    <div className="avatar relative">
      <div className="mask mask-squircle w-20 h-20 border-4 border-primary shadow-xl shadow-primary/30 bg-base-100">
        <Image
          src={getChampionIcon(champion)}
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
        {mainPlayer ? (
          <>
            <Image
              src={`/assets/spell/${getSummonerSpellImage(mainPlayer.spell1)}`}
              alt={`Spell 1`}
              width={32}
              height={32}
              className="w-8 h-8 rounded shadow border border-primary/30 bg-base-200"
            />
            <Image
              src={`/assets/spell/${getSummonerSpellImage(mainPlayer.spell2)}`}
              alt={`Spell 2`}
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
        {mainPlayer && mainPlayer.rune1 && mainPlayer.rune2 ? (
          <>
            <Image
              src={`/assets/${getRuneIcon(mainPlayer.rune1)}`}
              alt={`Rune 1`}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full shadow border border-primary/20 bg-base-200"
            />
            <Image
              src={`/assets/${getRuneIcon(mainPlayer.rune2)}`}
              alt={`Rune 2`}
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
        {mainPlayer && mainPlayer.items && mainPlayer.items.length > 0
          ? mainPlayer.items.map((itemId: number, i: number) =>
              itemId > 0 ? (
                <Image
                  key={itemId + "-" + i}
                  src={`/assets/item/${itemId}.png`}
                  alt={`Item ${itemId}`}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded shadow border border-base-300 bg-base-100"
                />
              ) : (
                <span
                  key={i}
                  className="w-8 h-8 bg-base-300 rounded shadow-inner"
                />
              )
            )
          : [...Array(6)].map((_, i) => (
              <span
                key={i}
                className="w-8 h-8 bg-base-300 rounded shadow-inner"
              />
            ))}
      </div>
    </div>
  </div>
);

export default MatchCardChampionBlock;
