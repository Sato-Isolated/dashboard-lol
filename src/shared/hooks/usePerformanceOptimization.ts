import { useEffect, useCallback, useMemo } from 'react';
import {
  apiCache,
  staticDataCache,
  userDataCache,
} from '@/shared/lib/cache/CacheManager';
import PerformanceMonitoringService from '@/shared/services/monitoring/PerformanceMonitoringService';

// Type for database service
type DatabaseOptimizationServiceType = {
  getInstance: () => {
    createOptimizedIndexes: () => Promise<void>;
  };
} | null;

// Conditionally import database service only on server side
let DatabaseOptimizationService: DatabaseOptimizationServiceType = null;
if (typeof window === 'undefined') {
  try {
    // Use dynamic import for server-side only
    import('@/shared/services/database/DatabaseOptimizationService')
      .then(({ default: DbService }) => {
        DatabaseOptimizationService = DbService;
      })
      .catch(() => {
        console.warn(
          'DatabaseOptimizationService not available on client side'
        );
      });
  } catch {
    console.warn('DatabaseOptimizationService not available on client side');
  }
}

/**
 * Comprehensive performance optimization hook
 * Provides utilities and monitoring for application performance
 */
export function usePerformanceOptimization() {
  const performanceMonitor = useMemo(
    () => PerformanceMonitoringService.getInstance(),
    []
  );

  // Use the exported cache instances directly
  const apiCacheInstance = useMemo(() => apiCache, []);
  const staticDataCacheInstance = useMemo(() => staticDataCache, []);
  const userDataCacheInstance = useMemo(() => userDataCache, []);

  // Initialize performance monitoring
  useEffect(() => {
    performanceMonitor.startMonitoring();
  }, [performanceMonitor]);
  // Performance timing decorator
  const withPerformanceTracking = useCallback(
    <T extends (...args: unknown[]) => Promise<unknown>>(
      fn: T,
      operationName: string
    ): T => {
      return (async (...args: unknown[]) => {
        const startTime = performance.now();
        performanceMonitor.startTimer(operationName);

        try {
          const result = await fn(...args);
          const duration = performance.now() - startTime;
          performanceMonitor.endTimer(operationName);

          // Track different types of operations
          if (operationName.includes('api')) {
            performanceMonitor.trackAPICall(
              operationName,
              'GET',
              duration,
              200
            );
          } else if (operationName.includes('db')) {
            performanceMonitor.trackDatabaseQuery(
              'unknown',
              operationName,
              duration
            );
          }

          return result;
        } catch (error) {
          const duration = performance.now() - startTime;
          performanceMonitor.endTimer(operationName);

          if (operationName.includes('api')) {
            performanceMonitor.trackAPICall(
              operationName,
              'GET',
              duration,
              500
            );
          }

          throw error;
        }
      }) as T;
    },
    [performanceMonitor]
  );
  // Optimized fetch with caching and performance tracking
  const optimizedFetch = useCallback(
    async <T = unknown>(
      url: string,
      options: {
        cacheKey?: string;
        cacheTTL?: number;
        cacheType?: 'api' | 'static' | 'user';
        trackPerformance?: boolean;
      } = {}
    ): Promise<T> => {
      const {
        cacheKey = url,
        cacheTTL = 5 * 60 * 1000, // 5 minutes default
        cacheType = 'api',
        trackPerformance = true,
      } = options;
      const cache =
        cacheType === 'static'
          ? staticDataCacheInstance
          : cacheType === 'user'
            ? userDataCacheInstance
            : apiCacheInstance;

      if (trackPerformance) {
        performanceMonitor.startTimer(`fetch_${cacheKey}`);
      }

      try {
        // Check cache first
        const cached = cache.get<T>(cacheKey);
        if (cached) {
          if (trackPerformance) {
            performanceMonitor.trackCacheOperation('hit', cacheType);
            performanceMonitor.endTimer(`fetch_${cacheKey}`);
          }
          return cached;
        }

        // Cache miss - fetch data
        if (trackPerformance) {
          performanceMonitor.trackCacheOperation('miss', cacheType);
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache the result
        cache.set(cacheKey, data, cacheTTL);
        if (trackPerformance) {
          performanceMonitor.trackCacheOperation('set', cacheType);
        }

        return data;
      } catch (error) {
        if (trackPerformance) {
          performanceMonitor.trackAPICall(url, 'GET', performance.now(), 500);
        }
        throw error;
      } finally {
        if (trackPerformance) {
          performanceMonitor.endTimer(`fetch_${cacheKey}`);
        }
      }
    },
    [
      apiCacheInstance,
      staticDataCacheInstance,
      userDataCacheInstance,
      performanceMonitor,
    ]
  );

  // Component render tracking
  const trackComponentRender = useCallback(
    (componentName: string) => {
      const startTime = performance.now();

      return () => {
        const duration = performance.now() - startTime;
        performanceMonitor.trackComponentRender(componentName, duration);
      };
    },
    [performanceMonitor]
  );

  // User interaction tracking
  const trackUserInteraction = useCallback(
    (interactionType: string) => {
      const startTime = performance.now();

      return () => {
        const duration = performance.now() - startTime;
        performanceMonitor.trackUserInteraction(interactionType, duration);
      };
    },
    [performanceMonitor]
  );
  // Database optimization utilities
  const initializeDatabaseOptimization = useCallback(async () => {
    if (!DatabaseOptimizationService) {
      console.warn('DatabaseOptimizationService not available');
      return false;
    }

    try {
      const dbOptimizer = DatabaseOptimizationService.getInstance();
      await dbOptimizer.createOptimizedIndexes();
      return true;
    } catch (error) {
      console.error('Failed to initialize database optimization:', error);
      return false;
    }
  }, []);
  // Cache management utilities
  const cacheUtils = useMemo(
    () => ({
      clearAll: () => {
        apiCacheInstance.clear();
        staticDataCacheInstance.clear();
        userDataCacheInstance.clear();
      },

      getStats: () => ({
        api: apiCacheInstance.getStats(),
        static: staticDataCacheInstance.getStats(),
        user: userDataCacheInstance.getStats(),
      }),

      invalidatePattern: (pattern: string) => {
        apiCacheInstance.invalidatePattern(pattern);
        staticDataCacheInstance.invalidatePattern(pattern);
        userDataCacheInstance.invalidatePattern(pattern);
      },
    }),
    [apiCacheInstance, staticDataCacheInstance, userDataCacheInstance]
  );

  // Performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return {
      dashboard: performanceMonitor.getPerformanceDashboard(),
      cache: performanceMonitor.getCacheMetrics(),
      cacheStats: cacheUtils.getStats(),
    };
  }, [performanceMonitor, cacheUtils]);
  // Memory optimization
  const optimizeMemory = useCallback(() => {
    // Clear old cache entries
    apiCacheInstance.cleanup();
    staticDataCacheInstance.cleanup();
    userDataCacheInstance.cleanup();

    // Force garbage collection if available
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as Window & { gc?: () => void }).gc?.();
    }

    performanceMonitor.trackMemoryUsage();
  }, [
    apiCacheInstance,
    staticDataCacheInstance,
    userDataCacheInstance,
    performanceMonitor,
  ]);

  return {
    // Core utilities
    optimizedFetch,
    withPerformanceTracking,

    // Tracking functions
    trackComponentRender,
    trackUserInteraction,

    // Cache management
    cacheUtils,

    // Database optimization
    initializeDatabaseOptimization,

    // Performance metrics
    getPerformanceMetrics,

    // Memory optimization
    optimizeMemory, // Direct access to services
    performanceMonitor,
    apiCache: apiCacheInstance,
    staticDataCache: staticDataCacheInstance,
    userDataCache: userDataCacheInstance,
  };
}

export default usePerformanceOptimization;
