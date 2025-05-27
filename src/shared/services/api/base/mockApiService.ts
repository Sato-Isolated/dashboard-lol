import { logger } from '@/shared/lib/logger/logger';
export class MockApiService {
  static async mockMatchIds(
    puuid: string,
    count: number = 20
  ): Promise<string[]> {
    logger.warn('Using mock data for match IDs', { puuid, count });

    // Generate mock match IDs
    const matchIds: string[] = [];
    for (let i = 0; i < count; i++) {
      matchIds.push(
        `EUW1_${Date.now() - i * 300000}_${Math.random()
          .toString(36)
          .substring(7)}`
      );
    }

    return matchIds;
  }

  static async mockMatchData(
    matchId: string
  ): Promise<Record<string, unknown>> {
    logger.warn('Using mock data for match details', { matchId });

    return {
      metadata: {
        matchId,
        participants: [
          'ZkIQ0K4iLEpYl6JeRhp7yLop8V0CBoUo-dwnKplyjc2ffOnuq1vXiv6BihQ_4CvljE-c7PRxcqb2aA',
        ],
      },
      info: {
        gameCreation: Date.now() - Math.random() * 86400000,
        gameDuration: 1200 + Math.random() * 600,
        gameId: parseInt(matchId.split('_')[1]),
        gameMode: 'ARAM',
        gameType: 'MATCHED_GAME',
        queueId: 450,
        participants: [
          {
            puuid:
              'ZkIQ0K4iLEpYl6JeRhp7yLop8V0CBoUo-dwnKplyjc2ffOnuq1vXiv6BihQ_4CvljE-c7PRxcqb2aA',
            championId: 103, // Ahri
            championName: 'Ahri',
            riotIdGameName: 'TestPlayer',
            riotIdTagline: 'TEST',
            kills: Math.floor(Math.random() * 20),
            deaths: Math.floor(Math.random() * 10),
            assists: Math.floor(Math.random() * 25),
            win: Math.random() > 0.5,
          },
        ],
      },
    };
  }

  static async mockChampionMasteries(
    summonerId: string
  ): Promise<Array<Record<string, unknown>>> {
    logger.warn('Using mock data for champion masteries', { summonerId });

    const masteries = [];
    for (let i = 0; i < 10; i++) {
      masteries.push({
        championId: 1 + i,
        championLevel: Math.floor(Math.random() * 7) + 1,
        championPoints: Math.floor(Math.random() * 100000),
        lastPlayTime: Date.now() - Math.random() * 86400000,
        championPointsSinceLastLevel: Math.floor(Math.random() * 10000),
        championPointsUntilNextLevel: Math.floor(Math.random() * 5000),
      });
    }

    return masteries;
  }

  static async simulateApiDelay(): Promise<void> {
    // Simulate realistic API delay
    await new Promise(resolve =>
      setTimeout(resolve, 100 + Math.random() * 200)
    );
  }
}
