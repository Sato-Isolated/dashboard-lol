// lib/summoner.ts
import {
  createAccountService,
  createSummonerService,
} from "@/services/lol/riotServiceFactory";
import { getSummoner } from "@/repositories/summonerRepo";
import type { LeagueEntry } from "@/types/api/summoners";

export async function fetchSummonerFull(
  platformRegion: string,
  name: string,
  tagline: string
) {
  const accountApi = createAccountService(platformRegion);
  const account = await accountApi.getAccountByRiotId(name, tagline);

  if (!account) return null;

  const summonerApi = createSummonerService(platformRegion);
  const summonerDto = await summonerApi.getSummonerByPuuid(account.puuid);

  // Récupération des leagues/rangs
  let leagues: LeagueEntry[] = [];
  if (summonerDto && summonerDto.id) {
    try {
      leagues = await summonerApi.getLeaguesBySummonerId(summonerDto.id);
    } catch {
      leagues = [];
    }
  }

  // Ajout récupération du score ARAM depuis la base
  const dbSummoner = await getSummoner(platformRegion, account.gameName, tagline);
  const aramScore = dbSummoner?.aramScore ?? 0;

  const version = await fetch(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  )
    .then((res) => res.json())
    .then((versions) => versions[0]);

  const summoner = {
    ...summonerDto,
    accountId: String(summonerDto.accountId),
    name: account.gameName,
    profileIconUrl: `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summonerDto.profileIconId}.png`,
  };

  return {
    account,
    summoner,
    leagues,
    aramScore,
  };
}
