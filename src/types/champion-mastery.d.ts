interface ChampionMasteryDto {
  puuid: string;
  championPointsUntilNextLevel: number;
  chestGranted: boolean;
  championId: number;
  lastPlayTime: number;
  championLevel: number;
  championPoints: number;
  championPointsSinceLastLevel: number;
  markRequiredForNextLevel: number;
  championSeasonMilestone: number;
  nextSeasonMilestone: NextSeasonMilestonesDto;
  tokestEarned: number;
  milestoneGrades: string[];
}

interface NextSeasonMilestonesDto {
  requireGradeCounts: object;
  rewardMarks: number;
  bonus: boolean;
  rewardConfig: RewardConfigDto;
}

interface RewardConfigDto {
  rewardValue: string;
  rewardType: string;
  maximumReward: number;
}
