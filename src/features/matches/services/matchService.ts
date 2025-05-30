import { Match } from '@/types/api/matchTypes';
import { RiotApiClient } from '@/lib/api/api/riot/RiotApiClient';
import { StandardErrorHandler } from '@/lib/patterns';
import { matchIdSchema, puuidSchema } from '@/lib/validation/schemas';

export class MatchService extends RiotApiClient {
  private readonly featureName = 'matches';
  private readonly serviceName = 'riot-match-api';

  private get errorHandler() {
    return StandardErrorHandler.createFeatureHandler(this.featureName);
  }

  constructor(region: string) {
    super(region);
  }
  public async getMatchById(matchId: string): Promise<Match> {
    // Validate input
    const matchIdResult = matchIdSchema.safeParse(matchId);
    if (!matchIdResult.success) {
      throw new Error(
        matchIdResult.error.errors[0]?.message || 'Invalid match ID',
      );
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
    },
  ): Promise<string[]> {
    // Validate input
    const puuidResult = puuidSchema.safeParse(puuid);
    if (!puuidResult.success) {
      throw new Error(
        puuidResult.error.errors[0]?.message || 'Invalid PUUID format',
      );
    }

    const params = new URLSearchParams();
    if (options?.startTime !== undefined) {
      params.append('startTime', options.startTime.toString());
    }
    if (options?.endTime !== undefined) {
      params.append('endTime', options.endTime.toString());
    }
    if (options?.queue !== undefined) {
      params.append('queue', options.queue.toString());
    }
    if (options?.type !== undefined) {
      params.append('type', options.type);
    }
    if (options?.start !== undefined) {
      params.append('start', options.start.toString());
    }
    if (options?.count !== undefined) {
      params.append('count', options.count.toString());
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const endpoint = `/lol/match/v5/matches/by-puuid/${puuid}/ids${query}`;

    return this.errorHandler.api(() => this.fetch<string[]>(endpoint), {
      service: this.serviceName,
      endpoint,
    });
  }
}
