import { AccountService } from './accountService';
import { ChampionService } from '@/features/champions/services/championService';
import { SummonerService } from '@/features/summoner/services/summonerService';
import { ChampionMasteryService } from '@/features/champions/services/championMasteryService';
import { MatchService } from '@/features/matches/services/matchService';
import { RegionalRegionMap } from '@/lib/api/api/riot/types';

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
