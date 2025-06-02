import { ObjectId } from 'mongodb';

export interface SummonerCollection {
  _id: ObjectId;
  puuid: string;
  region: string;
  name: string;
  tagline: string;
  fetchOldGames: boolean;
  lastFetchedGameEndTimestamp?: number; // timestamp of the most recent match fetched
  lastUpdateTimestamp?: number; // timestamp when the "Update" button was last pressed
  aramScore?: number; // custom ARAM score
  aramScoreFirstCalculated?: boolean;
  aramScoreLastCheck?: number;
  profileIconId?: number; // Riot profile icon ID
}
