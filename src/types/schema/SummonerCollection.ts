import { ObjectId } from "mongodb";

export interface SummonerCollection {
  _id: ObjectId;
  puuid: string;
  region: string;
  name: string;
  tagline: string;
  fetchOldGames: boolean;
  lastFetchedGameEndTimestamp?: number; // timestamp of the most recent match fetched
  aramScore?: number; // score ARAM personnalisé
  aramScoreFirstCalculated?: boolean;
  aramScoreLastCheck?: number;
}
