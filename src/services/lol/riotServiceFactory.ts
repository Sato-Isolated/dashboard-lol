import { RegionalRegionMap } from "@/types/api/regions";
import { AccountService } from "./services/accountService";
import { ChampionService } from "./services/championService";
import { SummonerService } from "./services/summonerService";
import { ChampionMasteryService } from "./services/champion-masteryService";
import { MatchService } from "./services/matchService";

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
