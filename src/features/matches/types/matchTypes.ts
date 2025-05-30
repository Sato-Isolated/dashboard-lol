import { ObjectId } from 'mongodb';
import { Match } from '@/types/api/matchTypes';

export interface MatchCollection extends Match {
  _id: Match['metadata']['matchId'] | ObjectId;
}

// Re-export the main Match type from the shared API types
export type { Match } from '@/types/api/matchTypes';

// Query options interface for optimized match queries
export interface MatchQueryOptions {
  limit?: number;
  skip?: number;
  queueId?: number;
  fromDate?: Date;
  toDate?: Date;
  gameMode?: string;
  championId?: number;
  outcome?: 'win' | 'lose';
}
