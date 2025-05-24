import { SummonerDto } from "@/types/api/summoners";
import { RiotApiClient } from "../api/RiotApiClient";

export class SummonerService extends RiotApiClient {
  constructor(region: string) {
    super(region);
  }

  public async getSummonerByPuuid(puuid: string) {
    return this.fetch<SummonerDto>(
      `/lol/summoner/v4/summoners/by-puuid/${puuid}`
    );
  }

  public async getLeaguesBySummonerId(summonerId: string) {
    return this.fetch<import("@/types/api/summoners").LeagueEntry[]>(
      `/lol/league/v4/entries/by-summoner/${summonerId}`
    );
  }
}
