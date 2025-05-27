import { ObjectId } from 'mongodb';
import { Match } from '@/shared/types/api/match.types';

export interface MatchCollection extends Match {
  _id: Match['metadata']['matchId'] | ObjectId;
}
