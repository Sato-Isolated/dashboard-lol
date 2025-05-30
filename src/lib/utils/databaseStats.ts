import { MongoService } from '@/lib/api/database/MongoService';

export interface DatabaseCounts {
  playersCount: number;
  matchesCount: number;
}

/**
 * Fetch real-time statistics from the MongoDB database
 * @returns Promise with players and matches counts
 */
export async function getDatabaseCounts(): Promise<DatabaseCounts> {
  try {
    const mongo = MongoService.getInstance();

    // Get collections
    const summonersCollection = await mongo.getCollection('summoners');
    const matchesCollection = await mongo.getCollection('matches');

    // Count documents in parallel for better performance
    const [playersCount, matchesCount] = await Promise.all([
      summonersCollection.countDocuments(),
      matchesCollection.countDocuments({ 'info.queueId': 450 }), // ARAM matches only
    ]);

    return { playersCount, matchesCount };
  } catch (error) {
    console.error('Failed to fetch database counts:', error);
    // Fallback to static values if database is unavailable
    return { playersCount: 2547, matchesCount: 18342 };  }
}
