import React from 'react';
import { motion } from 'motion/react';
import { useChampionData } from './hooks/useChampionData';
import {
  ChampionAvatar,
  SummonerSpells,
  RunesDisplay,
  ItemsGrid,
} from './components';
import { championBlockVariants } from './constants';
import type { ChampionBlockProps } from './matchCardChampionTypes';

const MatchCardChampionBlockComponent: React.FC<ChampionBlockProps> = ({
  champion,
  mainPlayer,
}) => {
  const { championIcon, spellData, runeData, itemsToRender } = useChampionData(
    champion,
    mainPlayer,
  );

  return (
    <motion.div
      variants={championBlockVariants}
      initial='initial'
      animate='animate'
      className='flex flex-row items-center gap-6 px-6 flex-1 min-w-[300px] group'
    >
      {/* Champion Avatar with enhanced styling */}
      <ChampionAvatar champion={champion} championIcon={championIcon} />

      {/* Spells, Runes & Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className='flex flex-col gap-3'
      >
        {/* Summoner Spells */}
        <SummonerSpells spell1={spellData?.spell1} spell2={spellData?.spell2} />

        {/* Runes */}
        <RunesDisplay rune1={runeData?.rune1} rune2={runeData?.rune2} />

        {/* Items Grid */}
        <ItemsGrid items={itemsToRender} />
      </motion.div>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchCardChampionBlock = React.memo(MatchCardChampionBlockComponent);
MatchCardChampionBlock.displayName = 'MatchCardChampionBlock';

export default MatchCardChampionBlock;
