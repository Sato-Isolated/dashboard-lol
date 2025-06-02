import { z } from 'zod';

// Platform region validation (for most API calls)
export const regionSchema = z.enum([
  'na1',
  'euw1',
  'eune1',
  'kr',
  'jp1',
  'br1',
  'la1',
  'la2',
  'oc1',
  'tr1',
  'ru',
  'ph2',
  'sg2',
  'th2',
  'tw2',
  'vn2',
]);

// Regional region validation (for Account API calls)
export const regionalRegionSchema = z.enum([
  'europe',
  'americas',
  'asia',
  'sea',
]);

// Queue validation
export const queueSchema = z.enum([
  'RANKED_SOLO_5x5',
  'RANKED_FLEX_SR',
  'RANKED_FLEX_TT',
  'RANKED_TFT',
  'NORMAL',
  'ARAM',
]);

// Summoner schemas
export const summonerNameSchema = z
  .string()
  .min(3, 'Summoner name must be at least 3 characters')
  .max(16, 'Summoner name cannot exceed 16 characters')
  .regex(/^[a-zA-Z0-9_\s]+$/, 'Summoner name contains invalid characters');

export const taglineSchema = z
  .string()
  .min(2, 'Tagline must be at least 2 characters')
  .max(10, 'Tagline cannot exceed 10 characters')
  .regex(/^[a-zA-Z0-9]+$/, 'Tagline must contain only alphanumeric characters');

export const matchIdSchema = z
  .string()
  .min(1, 'Match ID is required')
  .regex(
    /^[A-Z]+[0-9]*_[0-9]+$/,
    'Invalid Match ID format (expected format: REGION_NUMBER)',
  );

export const puuidSchema = z.string().length(78, 'Invalid PUUID format');

export const summonerIdSchema = z.string().min(1, 'Summoner ID is required');

// API Request schemas
export const getSummonerRequestSchema = z.object({
  name: summonerNameSchema,
  region: regionSchema,
});

export const getMatchHistoryRequestSchema = z.object({
  puuid: puuidSchema,
  region: regionSchema,
  start: z.coerce.number().min(0).default(0),
  count: z.coerce.number().min(1).max(100).default(20),
  queue: queueSchema.optional(),
  type: z.enum(['ranked', 'normal', 'aram']).optional(),
});

export const getMatchRequestSchema = z.object({
  matchId: z.string().min(1, 'Match ID is required'),
  region: regionSchema,
});

// Database schemas
export const summonerDbSchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  accountId: z.string(),
  puuid: puuidSchema,
  name: z.string(),
  profileIconId: z.number(),
  revisionDate: z.number(),
  summonerLevel: z.number(),
  region: regionSchema,
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const participantSchema = z.object({
  assists: z.number(),
  baronKills: z.number(),
  bountyLevel: z.number(),
  champExperience: z.number(),
  champLevel: z.number(),
  championId: z.number(),
  championName: z.string(),
  championTransform: z.number(),
  consumablesPurchased: z.number(),
  damageDealtToBuildings: z.number(),
  damageDealtToObjectives: z.number(),
  damageDealtToTurrets: z.number(),
  damageSelfMitigated: z.number(),
  deaths: z.number(),
  detectorWardsPlaced: z.number(),
  doubleKills: z.number(),
  dragonKills: z.number(),
  firstBloodAssist: z.boolean(),
  firstBloodKill: z.boolean(),
  firstTowerAssist: z.boolean(),
  firstTowerKill: z.boolean(),
  gameEndedInEarlySurrender: z.boolean(),
  gameEndedInSurrender: z.boolean(),
  goldEarned: z.number(),
  goldSpent: z.number(),
  individualPosition: z.string(),
  inhibitorKills: z.number(),
  inhibitorTakedowns: z.number(),
  inhibitorsLost: z.number(),
  item0: z.number(),
  item1: z.number(),
  item2: z.number(),
  item3: z.number(),
  item4: z.number(),
  item5: z.number(),
  item6: z.number(),
  itemsPurchased: z.number(),
  killingSprees: z.number(),
  kills: z.number(),
  lane: z.string(),
  largestCriticalStrike: z.number(),
  largestKillingSpree: z.number(),
  largestMultiKill: z.number(),
  longestTimeSpentLiving: z.number(),
  magicDamageDealt: z.number(),
  magicDamageDealtToChampions: z.number(),
  magicDamageTaken: z.number(),
  neutralMinionsKilled: z.number(),
  nexusKills: z.number(),
  nexusLost: z.number(),
  nexusTakedowns: z.number(),
  objectivesStolen: z.number(),
  objectivesStolenAssists: z.number(),
  participantId: z.number(),
  pentaKills: z.number(),
  physicalDamageDealt: z.number(),
  physicalDamageDealtToChampions: z.number(),
  physicalDamageTaken: z.number(),
  profileIcon: z.number(),
  puuid: puuidSchema,
  quadraKills: z.number(),
  riotIdName: z.string(),
  riotIdTagline: z.string(),
  role: z.string(),
  sightWardsBoughtInGame: z.number(),
  spell1Casts: z.number(),
  spell2Casts: z.number(),
  spell3Casts: z.number(),
  spell4Casts: z.number(),
  summoner1Casts: z.number(),
  summoner1Id: z.number(),
  summoner2Casts: z.number(),
  summoner2Id: z.number(),
  summonerId: z.string(),
  summonerLevel: z.number(),
  summonerName: z.string(),
  teamEarlySurrendered: z.boolean(),
  teamId: z.number(),
  teamPosition: z.string(),
  timeCCingOthers: z.number(),
  timePlayed: z.number(),
  totalDamageDealt: z.number(),
  totalDamageDealtToChampions: z.number(),
  totalDamageShieldedOnTeammates: z.number(),
  totalDamageTaken: z.number(),
  totalHeal: z.number(),
  totalHealsOnTeammates: z.number(),
  totalMinionsKilled: z.number(),
  totalTimeCCDealt: z.number(),
  totalTimeSpentDead: z.number(),
  totalUnitsHealed: z.number(),
  tripleKills: z.number(),
  trueDamageDealt: z.number(),
  trueDamageDealtToChampions: z.number(),
  trueDamageTaken: z.number(),
  turretKills: z.number(),
  turretTakedowns: z.number(),
  turretsLost: z.number(),
  unrealKills: z.number(),
  visionScore: z.number(),
  visionWardsBoughtInGame: z.number(),
  wardsKilled: z.number(),
  wardsPlaced: z.number(),
  win: z.boolean(),
});

export const matchDbSchema = z.object({
  _id: z.string().optional(),
  metadata: z.object({
    dataVersion: z.string(),
    matchId: z.string(),
    participants: z.array(puuidSchema),
  }),
  info: z.object({
    gameCreation: z.number(),
    gameDuration: z.number(),
    gameEndTimestamp: z.number(),
    gameId: z.number(),
    gameMode: z.string(),
    gameName: z.string(),
    gameStartTimestamp: z.number(),
    gameType: z.string(),
    gameVersion: z.string(),
    mapId: z.number(),
    participants: z.array(participantSchema),
    platformId: z.string(),
    queueId: z.number(),
    teams: z.array(
      z.object({
        bans: z.array(
          z.object({
            championId: z.number(),
            pickTurn: z.number(),
          }),
        ),
        objectives: z.object({
          baron: z.object({
            first: z.boolean(),
            kills: z.number(),
          }),
          champion: z.object({
            first: z.boolean(),
            kills: z.number(),
          }),
          dragon: z.object({
            first: z.boolean(),
            kills: z.number(),
          }),
          inhibitor: z.object({
            first: z.boolean(),
            kills: z.number(),
          }),
          riftHerald: z.object({
            first: z.boolean(),
            kills: z.number(),
          }),
          tower: z.object({
            first: z.boolean(),
            kills: z.number(),
          }),
        }),
        teamId: z.number(),
        win: z.boolean(),
      }),
    ),
    tournamentCode: z.string().optional(),
  }),
  region: regionSchema,
  createdAt: z.date().default(() => new Date()),
});

export const championMasteryDbSchema = z.object({
  _id: z.string().optional(),
  championId: z.number(),
  championLevel: z.number(),
  championPoints: z.number(),
  lastPlayTime: z.number(),
  championPointsSinceLastLevel: z.number(),
  championPointsUntilNextLevel: z.number(),
  chestGranted: z.boolean(),
  tokensEarned: z.number(),
  summonerId: z.string(),
  puuid: puuidSchema,
  region: regionSchema,
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});