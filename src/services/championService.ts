import { ChampionInfoDto } from "@/types/champion";
import { RiotApiClient } from "./RiotApiClient";

export class ChampionService extends RiotApiClient {
  constructor(apiKey: string, region: string) {
    super(apiKey, region);
  }

  public async getChampionInfo() {
    return this.fetch<ChampionInfoDto>(`/lol/platform/v3/champion-rotations`);
  }
}