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

  if (!account) {
    return null;
  }

  const summonerApi = createSummonerService(platformRegion);
  const summonerDto = await summonerApi.getSummonerByPuuid(account.puuid);
  if (!summonerDto) {
    return null;
  }

  // Retrieve leagues/ranks
  let leagues: LeagueEntry[] = [];
  if (summonerDto && summonerDto.id) {
    try {
      leagues = await summonerApi.getLeaguesBySummonerId(summonerDto.id);
    } catch {
      leagues = [];
    }
  }

  // Add ARAM score retrieval from the database
  const dbSummoner = await getSummoner(
    platformRegion,
    account.gameName,
    tagline
  );
  const aramScore = dbSummoner?.aramScore ?? 0;

  // Ajout : update le profileIconId en base si différent ou manquant
  if (
    dbSummoner &&
    (typeof (dbSummoner as Record<string, unknown>)["profileIconId"] === "undefined" ||
      (dbSummoner as Record<string, unknown>)["profileIconId"] !== summonerDto.profileIconId)
  ) {
    const mongo = (
      await import("@/lib/MongoService")
    ).MongoService.getInstance();
    const collection = await mongo.getCollection("summoners");
    await collection.updateOne(
      { region: platformRegion, name: account.gameName, tagline },
      { $set: { profileIconId: summonerDto.profileIconId } }
    );
  }

  // Securely retrieve the game version
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
  } catch {
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
