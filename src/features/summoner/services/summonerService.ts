import { SummonerDto, LeagueEntry } from '@/types/api/summonerTypes';
import { RiotApiClient } from '@/lib/api/api/riot/RiotApiClient';
import { StandardErrorHandler } from '@/lib/patterns';
import { puuidSchema, summonerIdSchema } from '@/lib/validation/schemas';

export class SummonerService extends RiotApiClient {
  private readonly featureName = 'summoner';
  private readonly serviceName = 'riot-summoner-api';

  private get errorHandler() {
    return StandardErrorHandler.createFeatureHandler(this.featureName);
  }

  constructor(region: string) {
    super(region);
  }
  public async getSummonerByPuuid(puuid: string): Promise<SummonerDto> {
    // Validate input
    const puuidResult = puuidSchema.safeParse(puuid);
    if (!puuidResult.success) {
      throw new Error(
        puuidResult.error.errors[0]?.message || 'Invalid PUUID format',
      );
    }

    const endpoint = `/lol/summoner/v4/summoners/by-puuid/${puuid}`;

    return this.errorHandler.api(() => this.fetch<SummonerDto>(endpoint), {
      service: this.serviceName,
      endpoint,
    });
  }
  public async getLeaguesBySummonerId(
    summonerId: string,
  ): Promise<LeagueEntry[]> {
    // Validate input
    const summonerIdResult = summonerIdSchema.safeParse(summonerId);
    if (!summonerIdResult.success) {
      throw new Error(
        summonerIdResult.error.errors[0]?.message || 'Invalid summoner ID',
      );
    }

    const endpoint = `/lol/league/v4/entries/by-summoner/${summonerId}`;

    return this.errorHandler.api(() => this.fetch<LeagueEntry[]>(endpoint), {
      service: this.serviceName,
      endpoint,
    });
  }
}
