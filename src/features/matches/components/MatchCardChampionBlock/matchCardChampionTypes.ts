export interface ChampionBlockProps {
  champion: string;
  mainPlayer?: import('@/features/matches/types/uiMatchTypes').UIPlayer;
}

export interface ChampionAvatarProps {
  champion: string;
  championIcon: string;
  level?: number;
}

export interface SummonerSpellsProps {
  spell1?: string;
  spell2?: string;
}

export interface RunesDisplayProps {
  rune1?: string;
  rune2?: string;
}

export interface ItemsGridProps {
  items: Array<{ id: number; itemId: number }>;
}

export interface ChampionDataHook {
  championIcon: string;
  spellData: { spell1: string; spell2: string } | null;
  runeData: { rune1: string; rune2: string } | null;
  itemsToRender: Array<{ id: number; itemId: number }>;
}
