import { ChampionInfoDto } from "@/types/api/champion";
import { RiotApiClient } from "../api/RiotApiClient";

export class ChampionService extends RiotApiClient {
   constructor(region: string) {
    super(region);
  }

  public async getChampionInfo() {
    return this.fetch<ChampionInfoDto>(`/lol/platform/v3/champion-rotations`);
  }
}