import { ChampionInfoDto } from '@/shared/types/api/champion.types';
import { RiotApiClient } from '@/shared/services/api/riot/RiotApiClient';

export class ChampionService extends RiotApiClient {
  constructor(region: string) {
    super(region);
  }

  public async getChampionInfo() {
    return this.fetch<ChampionInfoDto>('/lol/platform/v3/champion-rotations');
  }
}
