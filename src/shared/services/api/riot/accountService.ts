import { RiotApiClient } from './RiotApiClient';
import { RiotAccountDto } from '@/shared/types/api/account.types';

export class AccountService extends RiotApiClient {
  constructor(region: string) {
    super(region);
  }

  public async getAccountByRiotId(gameName: string, tagLine: string) {
    return this.fetch<RiotAccountDto>(
      `/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    );
  }

  public async getAccountByPuuid(puuid: string) {
    return this.fetch<RiotAccountDto>(
      `/riot/account/v1/accounts/by-puuid/${puuid}`,
    );
  }
}
