import { ChampionMasteryDto } from "@/types/champion-mastery";
import { RiotApiClient } from "./RiotApiClient";

export class ChampionMasteryService extends RiotApiClient {
  constructor(apiKey: string, region: string) {
    super(apiKey, region);
  }

  public async getChampionMastery(puuid: string) {
    return this.fetch<ChampionMasteryDto[]>(`/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`);
  }
}
