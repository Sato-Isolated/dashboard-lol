export interface ChampionMasteryDto {
  puuid: string;
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  markRequiredForNextLevel: number;
  tokensEarned: number;
  championSeasonMilestone: number;
  milestoneGrades?: string[];
  nextSeasonMilestone: NextSeasonMilestone;
}

export interface NextSeasonMilestone {
  requireGradeCounts: RequireGradeCounts;
  rewardMarks: number;
  bonus: boolean;
  totalGamesRequires: number;
}

export interface RequireGradeCounts {
  'A-'?: number;
  'S-'?: number;
}
