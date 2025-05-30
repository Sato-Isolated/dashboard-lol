import {
  createAccountService,
  createSummonerService,
  createChampionMasteryService,
} from '../api/api/riot/riotServiceFactory';
// src/lib/data/fetchAndStoreMasteries.ts

import {
  getOrCreateSummoner,
  insertOrUpdateChampionMastery,
} from '../../features/summoner/services/summonerRepository';

export async function fetchAndStoreMasteries(
  name: string,
  tagLine: string,
  region: string,
) {
  try {
    const accountApi = createAccountService(region);
    const account = await accountApi.getAccountByRiotId(name, tagLine);
    if (!account) {
      throw new Error('Account not found');
    }

    const summonerApi = createSummonerService(region);
    const summoner = await summonerApi.getSummonerByPuuid(account.puuid);
    if (!summoner) {
      throw new Error('Summoner not found');
    }

    const championMasteryService = createChampionMasteryService(region);
    const championMastery = await championMasteryService.getChampionMastery(
      account.puuid,
    );
    if (!championMastery) {
      throw new Error('Champion mastery not found');
    }

    const summonerDoc = await getOrCreateSummoner(
      region,
      name,
      tagLine,
      account.puuid,
    );
    if (!summonerDoc) {
      throw new Error('Summoner doc not found');
    }

    for (const mastery of championMastery) {
      try {
        await insertOrUpdateChampionMastery(
          region,
          name,
          tagLine,
          mastery.championId,
          mastery.championLevel,
          mastery.championPoints,
        );
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    // console.error("Error in fetchAndStoreMasteries:", error);
    throw error;
  }
}
