import { SummonerDto } from "@/types/summoners";
import { RiotApiClient } from "./RiotApiClient";

export class SummonerService extends RiotApiClient {
   constructor(region: string) {
    super(region);
  }

  public async getSummonerByPuuid(puuid: string) {
    return this.fetch<SummonerDto>(`/lol/summoner/v4/summoners/by-puuid/${puuid}`);
  }
}