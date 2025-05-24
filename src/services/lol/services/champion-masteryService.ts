import { ChampionMasteryDto } from "@/types/api/champion-mastery";
import { RiotApiClient } from "../api/RiotApiClient";

export class ChampionMasteryService extends RiotApiClient {
   constructor(region: string) {
    super(region);
  }

  public async getChampionMastery(puuid: string) {
    return this.fetch<ChampionMasteryDto[]>(`/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`);
  }
}
