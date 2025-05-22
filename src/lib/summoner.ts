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

  // DEBUG: log les paramètres envoyés à l'API Riot
  console.log("[fetchSummonerFull] getAccountByRiotId:", { name, tagline });
  const account = await accountApi.getAccountByRiotId(name, tagline);

  if (!account) {
    console.error("[fetchSummonerFull] Account not found for:", { name, tagline });
    return null;
  }

  const summonerApi = createSummonerService(platformRegion);
  const summonerDto = await summonerApi.getSummonerByPuuid(account.puuid);
  if (!summonerDto) {
    console.error("[fetchSummonerFull] Summoner not found for puuid:", account.puuid);
    return null;
  }

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
  const dbSummoner = await getSummoner(
    platformRegion,
    account.gameName,
    tagline
  );
  const aramScore = dbSummoner?.aramScore ?? 0;

  // Récupération sécurisée de la version du jeu
  let version = "latest";
  try {
    const res = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json"
    );
    if (res.ok) {
      const versions = await res.json();
      if (Array.isArray(versions) && versions.length > 0) {
        version = versions[0];
      }
    }
  } catch (e) {
    version = "latest";
  }

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
