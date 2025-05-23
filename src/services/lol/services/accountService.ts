import { RiotApiClient } from "../api/RiotApiClient";
import { RiotAccountDto } from "../../../types/api/account";

export class AccountService extends RiotApiClient {
  constructor(region: string) {
    super(region);
  }

  public async getAccountByRiotId(gameName: string, tagLine: string) {
    return this.fetch<RiotAccountDto>(
      `/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
    );
  }

  public async getAccountByPuuid(puuid: string) {
    return this.fetch<RiotAccountDto>(
      `/riot/account/v1/accounts/by-puuid/${puuid}`
    );
  }
}
