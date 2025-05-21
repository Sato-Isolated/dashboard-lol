import { RegionalRegionMap } from "@/types/api/regions";
import { AccountService } from "./accountService";
import { ChampionService } from "./championService";
import { SummonerService } from "./summonerService";
import { ChampionMasteryService } from "./champion-masteryService";
import { MatchService } from "./matchService";

export function createAccountService(platformRegion: string) {
  const regionalRegion =
    RegionalRegionMap[platformRegion as keyof typeof RegionalRegionMap];
  return new AccountService(regionalRegion);
}

export function createSummonerService(platformRegion: string) {
  return new SummonerService(platformRegion);
}

export function createChampionService(platformRegion: string) {
  return new ChampionService(platformRegion);
}

export function createChampionMasteryService(platformRegion: string) {
  return new ChampionMasteryService(platformRegion);
}

export function createMatchService(platformRegion: string) {
  const regionalRegion =
    RegionalRegionMap[platformRegion as keyof typeof RegionalRegionMap];
  return new MatchService(regionalRegion);
}
