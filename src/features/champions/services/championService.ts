import { ChampionInfoDto } from '@/types/api/championTypes';
import { RiotApiClient } from '@/lib/api/api/riot/RiotApiClient';

export class ChampionService extends RiotApiClient {
  constructor(region: string) {
    super(region);
  }

  public async getChampionInfo() {
    return this.fetch<ChampionInfoDto>('/lol/platform/v3/champion-rotations');
  }
}
