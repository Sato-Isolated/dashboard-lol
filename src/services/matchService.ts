import { MatchDto } from "@/types/match";
import { RiotApiClient } from "./RiotApiClient";

export class MatchService extends RiotApiClient {
  constructor(apiKey: string, region: string) {
    super(apiKey, region);
  }

  public async getMatchById(matchId: string) {
    return this.fetch<MatchDto>(`/lol/match/v5/matches/${matchId}`);
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
  ) {
    const params = new URLSearchParams();
    if (options?.startTime !== undefined) params.append("startTime", options.startTime.toString());
    if (options?.endTime !== undefined) params.append("endTime", options.endTime.toString());
    if (options?.queue !== undefined) params.append("queue", options.queue.toString());
    if (options?.type !== undefined) params.append("type", options.type);
    if (options?.start !== undefined) params.append("start", options.start.toString());
    if (options?.count !== undefined) params.append("count", options.count.toString());

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.fetch<string[]>(`/lol/match/v5/matches/by-puuid/${puuid}/ids${query}`);
  }
}