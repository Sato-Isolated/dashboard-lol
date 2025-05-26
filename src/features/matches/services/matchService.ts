import { Match } from "@/shared/types/api/match.types";
import { RiotApiClient } from "@/shared/services/api/riot/RiotApiClient";
import { StandardErrorHandler, ValidationHelper } from "@/shared/lib/patterns";

export class MatchService extends RiotApiClient {
  private readonly featureName = "matches";
  private readonly serviceName = "riot-match-api";

  private get errorHandler() {
    return StandardErrorHandler.createFeatureHandler(this.featureName);
  }

  constructor(region: string) {
    super(region);
  }

  public async getMatchById(matchId: string): Promise<Match> {
    // Validate input
    const validation = ValidationHelper.validateString(matchId, "matchId", 1);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid match ID");
    }

    const endpoint = `/lol/match/v5/matches/${matchId}`;

    return this.errorHandler.api(() => this.fetch<Match>(endpoint), {
      service: this.serviceName,
      endpoint,
    });
  }
  public async getMatchlistByPuuid(
    puuid: string,
    options?: {
      startTime?: number;
      endTime?: number;
      queue?: number;
      type?: string;
      start?: number;
      count?: number;
    }
  ): Promise<string[]> {
    // Validate input
    const validation = ValidationHelper.validateString(puuid, "puuid", 78, 78);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid PUUID format");
    }

    const params = new URLSearchParams();
    if (options?.startTime !== undefined)
      params.append("startTime", options.startTime.toString());
    if (options?.endTime !== undefined)
      params.append("endTime", options.endTime.toString());
    if (options?.queue !== undefined)
      params.append("queue", options.queue.toString());
    if (options?.type !== undefined) params.append("type", options.type);
    if (options?.start !== undefined)
      params.append("start", options.start.toString());
    if (options?.count !== undefined)
      params.append("count", options.count.toString());

    const query = params.toString() ? `?${params.toString()}` : "";
    const endpoint = `/lol/match/v5/matches/by-puuid/${puuid}/ids${query}`;

    return this.errorHandler.api(() => this.fetch<string[]>(endpoint), {
      service: this.serviceName,
      endpoint,
    });
  }
}
