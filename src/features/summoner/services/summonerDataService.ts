// lib/summoner.ts
import {
  createAccountService,
  createSummonerService,
} from '@/lib/api/api/riot/riotServiceFactory';
import { getSummoner } from '@/features/summoner/services/summonerRepository';
import type { LeagueEntry } from '@/types/api/summonerTypes';

export async function fetchSummonerFull(
  platformRegion: string,
  name: string,
  tagline: string,
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
    tagline,
  );
  const aramScore = dbSummoner?.aramScore ?? 0;
  // Addition: update the profileIconId in database if different or missing
  if (
    dbSummoner &&
    (typeof dbSummoner.profileIconId === 'undefined' ||
      dbSummoner.profileIconId !== summonerDto.profileIconId)
  ) {
    const mongo = (
      await import('@/lib/api/database/MongoService')
    ).MongoService.getInstance();
    const collection = await mongo.getCollection('summoners');
    await collection.updateOne(
      { region: platformRegion, name: account.gameName, tagline },
      { $set: { profileIconId: summonerDto.profileIconId } },
    );
  }

  // Securely retrieve the game version
  let version = 'latest';
  try {
    const res = await fetch(
      'https://ddragon.leagueoflegends.com/api/versions.json',
    );
    if (res.ok) {
      const versions = await res.json();
      if (Array.isArray(versions) && versions.length > 0) {
        version = versions[0];
      }
    }
  } catch {
    version = 'latest';
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
