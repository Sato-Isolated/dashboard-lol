import { ChampionData } from "@/types/data/champion";


export const getSummonerIcon = (iconId: number) => 
  '/assets/profileicon/' + iconId + '.png';

export const getChampionIcon = (champion: string) =>
  `/assets/champion/${champion}.png`;

export const getChampionNameFromId = (
  key: number,
  champions: Record<string, ChampionData>
) => {
  const champion = Object.values(champions).find(c => parseInt(c.key) === key);
  return champion ? champion.name : "Unknown Champion";
};

export const getChampionIdFromName = (name: string, champions: Record<string, ChampionData>) => {
  const champion = Object.values(champions).find(champ => champ.name === name);
  return champion ? parseInt(champion.key) : null;
}

export const getChampionTags = (champion: ChampionData) => {
  return champion.tags.map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)).join(", ");
};

