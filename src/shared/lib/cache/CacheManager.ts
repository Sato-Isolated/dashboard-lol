/**
 * CacheManager - In-memory caching system with TTL support
 * Optimizes API responses and reduces redundant requests
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  maxSize?: number; // Maximum cache size
}

export class CacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL: number;
  private maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize || 1000; // 1000 entries max
  }
  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // If cache is at max size, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  /**
   * Delete cached data
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear cache entries by pattern
   */
  clearByPattern(pattern: string): number {
    let removedCount = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        removedCount++;
      }
    }
    return removedCount;
  }

  /**
   * Clear champions and masteries cache specifically
   */
  clearChampionsAndMasteriesCache(): void {
    this.clearByPattern("champion-stats:");
    this.clearByPattern("masteries:");
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    memoryUsage: number;
  } {
    const memoryUsage = JSON.stringify([...this.cache]).length;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // Would need to track hits/misses for this
      memoryUsage,
    };
  }

  /**
   * Clean expired entries
   */
  cleanup(): number {
    let removedCount = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    return removedCount;
  }

  /**
   * Get or set cached data with a factory function
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const data = await factory();
    this.set(key, data, ttl);
    return data;
  }
  /**
   * Invalidate cache entries by pattern
   */
  invalidatePattern(pattern: string): number {
    let removedCount = 0;
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    return removedCount;
  }

  /**
   * Static methods to access singleton cache instances
   */
  static getApiCache(): CacheManager {
    return apiCache;
  }

  static getStaticDataCache(): CacheManager {
    return staticDataCache;
  }

  static getUserDataCache(): CacheManager {
    return userDataCache;
  }
}

// Create singleton instances for different cache types
export const apiCache = new CacheManager({
  ttl: 5 * 60 * 1000, // 5 minutes for API responses
  maxSize: 500,
});

export const staticDataCache = new CacheManager({
  ttl: 60 * 60 * 1000, // 1 hour for static data (champions, items, etc.)
  maxSize: 100,
});

export const userDataCache = new CacheManager({
  ttl: 2 * 60 * 1000, // 2 minutes for user-specific data
  maxSize: 200,
});

// Auto-cleanup every 10 minutes
setInterval(() => {
  apiCache.cleanup();
  staticDataCache.cleanup();
  userDataCache.cleanup();
}, 10 * 60 * 1000);
