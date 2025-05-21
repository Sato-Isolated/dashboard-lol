import { ObjectId } from "mongodb";
import { Match } from "../api/match";

export interface MatchCollection extends Match {
  _id: Match["metadata"]["matchId"] | ObjectId;
}