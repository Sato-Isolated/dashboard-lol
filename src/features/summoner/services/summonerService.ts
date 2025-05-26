import { SummonerDto, LeagueEntry } from "@/shared/types/api/summoners.types";
import { RiotApiClient } from "@/shared/services/api/riot/RiotApiClient";
import { StandardErrorHandler, ValidationHelper } from "@/shared/lib/patterns";

export class SummonerService extends RiotApiClient {
  private readonly featureName = "summoner";
  private readonly serviceName = "riot-summoner-api";

  private get errorHandler() {
    return StandardErrorHandler.createFeatureHandler(this.featureName);
  }

  constructor(region: string) {
    super(region);
  }

  public async getSummonerByPuuid(puuid: string): Promise<SummonerDto> {
    // Validate input
    const validation = ValidationHelper.validateString(puuid, "puuid", 78, 78);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid PUUID format");
    }

    const endpoint = `/lol/summoner/v4/summoners/by-puuid/${puuid}`;

    return this.errorHandler.api(() => this.fetch<SummonerDto>(endpoint), {
      service: this.serviceName,
      endpoint,
    });
  }

  public async getLeaguesBySummonerId(
    summonerId: string
  ): Promise<LeagueEntry[]> {
    // Validate input
    const validation = ValidationHelper.validateString(
      summonerId,
      "summonerId",
      1
    );
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid summoner ID");
    }

    const endpoint = `/lol/league/v4/entries/by-summoner/${summonerId}`;

    return this.errorHandler.api(() => this.fetch<LeagueEntry[]>(endpoint), {
      service: this.serviceName,
      endpoint,
    });
  }
}
