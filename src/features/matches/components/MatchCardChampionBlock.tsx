import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
    if (!mainPlayer || !mainPlayer.rune1 || !mainPlayer.rune2) return null;
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="flex flex-row items-center gap-6 px-6 flex-1 min-w-[300px] group"
    >
      {/* Champion Avatar with enhanced styling */}
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.05, rotate: 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        {" "}
        <div
          className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-2xl
                        bg-gradient-to-br from-primary/20 to-accent/20
                        border-4 border-primary/40
                        transition-all duration-300"
        >
          <Image
            src={championIcon}
            alt={champion}
            width={80}
            height={80}
            className="object-cover w-full h-full transition-transform duration-300"
          />
        </div>
        {/* Champion Level Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
          className="absolute -bottom-2 -right-2 w-8 h-6 bg-gradient-to-r from-primary to-accent 
                     rounded-full flex items-center justify-center shadow-lg text-primary-content 
                     text-xs font-bold border-2 border-base-100"
        >
          18
        </motion.div>
      </motion.div>

      {/* Spells, Runes & Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col gap-3"
      >
        {/* Summoner Spells */}
        <motion.div
          className="flex gap-2"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {spellData && spellData.spell1 && spellData.spell2 ? (
            <>
              <motion.div
                variants={{
                  hidden: { scale: 0, rotate: -180 },
                  show: { scale: 1, rotate: 0 },
                }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="relative"
              >
                <Image
                  src={spellData.spell1}
                  alt="Spell 1"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-lg shadow-lg border-2 border-primary/30 
                           bg-base-200 transition-all duration-300"
                />
              </motion.div>
              <motion.div
                variants={{
                  hidden: { scale: 0, rotate: 180 },
                  show: { scale: 1, rotate: 0 },
                }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="relative"
              >
                <Image
                  src={spellData.spell2}
                  alt="Spell 2"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-lg shadow-lg border-2 border-primary/30 
                           bg-base-200 transition-all duration-300"
                />
              </motion.div>
            </>
          ) : (
            <>
              <div className="w-9 h-9 bg-base-300/50 rounded-lg shadow-inner animate-pulse" />
              <div className="w-9 h-9 bg-base-300/50 rounded-lg shadow-inner animate-pulse" />
            </>
          )}
        </motion.div>

        {/* Runes */}
        <motion.div
          className="flex gap-2"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delay: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {runeData && runeData.rune1 && runeData.rune2 ? (
            <>
              {" "}
              <motion.div
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  show: { scale: 1, opacity: 1 },
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
              >
                <Image
                  src={runeData.rune1}
                  alt="Primary Rune"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full shadow-lg border-2 border-accent/30 
                           bg-base-200 transition-all duration-300"
                />
              </motion.div>
              <motion.div
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  show: { scale: 1, opacity: 1 },
                }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="relative"
              >
                <Image
                  src={runeData.rune2}
                  alt="Secondary Rune"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full shadow-lg border-2 border-accent/30 
                           bg-base-200 transition-all duration-300"
                />
              </motion.div>
            </>
          ) : (
            <>
              <div className="w-9 h-9 bg-base-300/50 rounded-full shadow-inner animate-pulse" />
              <div className="w-9 h-9 bg-base-300/50 rounded-full shadow-inner animate-pulse" />
            </>
          )}
        </motion.div>

        {/* Items Grid */}
        <motion.div
          className="grid grid-cols-6 gap-1"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
                delay: 0.4,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {itemsToRender.map((item) =>
            item.itemId > 0 ? (
              <motion.div
                key={`item-${item.itemId}-${item.id}`}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  show: { scale: 1, opacity: 1 },
                }}
                whileHover={{ scale: 1.1, y: -2, rotate: 2 }}
                className="relative"
              >
                <Image
                  src={`/assets/item/${item.itemId}.png`}
                  alt={`Item ${item.itemId}`}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg shadow-md border border-base-300 
                           bg-base-100 transition-all duration-300"
                />
              </motion.div>
            ) : (
              <motion.div
                key={`empty-${item.id}`}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  show: { scale: 1, opacity: 0.6 },
                }}
                className="w-8 h-8 bg-gradient-to-br from-base-300/40 to-base-300/20 
                         rounded-lg shadow-inner border border-base-content/10"
              />
            )
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchCardChampionBlock = React.memo(MatchCardChampionBlockComponent);
MatchCardChampionBlock.displayName = "MatchCardChampionBlock";

export default MatchCardChampionBlock;
