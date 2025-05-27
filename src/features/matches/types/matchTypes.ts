// Re-export the main Match type from the shared API types
export type { Match } from "@/shared/types/api/match.types";

// Query options interface for optimized match queries
export interface MatchQueryOptions {
  limit?: number;
  skip?: number;
  queueId?: number;
  fromDate?: Date;
  toDate?: Date;
  gameMode?: string;
  championId?: number;
  outcome?: "win" | "lose";
}
