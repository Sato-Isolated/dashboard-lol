import { Match } from "@/types/api/match";
import { RiotApiClient } from "../api/RiotApiClient";

export class MatchService extends RiotApiClient {
   constructor(region: string) {
    super(region);
  }

  public async getMatchById(matchId: string) {
    return this.fetch<Match>(`/lol/match/v5/matches/${matchId}`);
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