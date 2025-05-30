import { useMemo } from 'react';
import {
  getChampionIcon,
  getSummonerSpellImage,
  getRuneIcon,
} from '@/lib/utils/helpers';
import { UIPlayer } from '@/features/matches/types/uiMatchTypes';
import { transformItemsForRender } from '../utils';
import type { ChampionDataHook } from '../matchCardChampionTypes';

export const useChampionData = (
  champion: string,
  mainPlayer?: UIPlayer,
): ChampionDataHook => {
  const championIcon = useMemo(() => getChampionIcon(champion), [champion]);
  const spellData = useMemo(() => {
    if (!mainPlayer) {
      return null;
    }
    const spell1 = getSummonerSpellImage(mainPlayer.spell1);
    const spell2 = getSummonerSpellImage(mainPlayer.spell2);
    if (!spell1 || !spell2) {
      return null;
    }
    return {
      spell1,
      spell2,
    };
  }, [mainPlayer]);

  const runeData = useMemo(() => {
    if (!mainPlayer || !mainPlayer.rune1 || !mainPlayer.rune2) {
      return null;
    }
    const rune1 = getRuneIcon(mainPlayer.rune1);
    const rune2 = getRuneIcon(mainPlayer.rune2);
    if (!rune1 || !rune2) {
      return null;
    }
    return {
      rune1,
      rune2,
    };
  }, [mainPlayer?.rune1, mainPlayer?.rune2]);

  const itemsToRender = useMemo(() => {
    return transformItemsForRender(mainPlayer?.items);
  }, [mainPlayer?.items]);

  return {
    championIcon,
    spellData,
    runeData,
    itemsToRender,
  };
};
