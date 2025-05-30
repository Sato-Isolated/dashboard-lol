// Cache Management
export { CacheManager } from '@/lib/cache/CacheManager';

// Optimized Hooks - use useAsyncData directly for unified hook approach
export { useAsyncData } from '@/hooks';
export {
  useOptimizedSummoner,
  useOptimizedMatchHistory,
} from '@/features/summoner/hooks/useOptimizedSummoner';
export { useOptimizedChampionStats } from '@/features/champions/hooks/useOptimizedChampionStats';
export { useOptimizedMasteries } from '@/features/champions/hooks/useOptimizedMasteries';

// Database Optimization
export { default as DatabaseOptimizationService } from '@/lib/api/database/DatabaseOptimizationService';

// Error Boundaries
export {
  ErrorBoundary,
  AsyncErrorBoundary,
  withErrorBoundary,
} from '@/components/common/error/ErrorBoundary';

/**
 * Initialization function for all optimization services
 */
export async function initializeOptimizations() {
  try {
    // Initialize database optimization (server-side only)
    if (typeof window === 'undefined') {
      const DatabaseOptimizationService = (
        await import('@/lib/api/database/DatabaseOptimizationService')
      ).default;
      const dbOptimizer = DatabaseOptimizationService.getInstance();
      await dbOptimizer.createOptimizedIndexes();
    }

    console.log('🚀 Database optimizations initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize optimizations:', error);
    return false;
  }
}

/**
 * Performance optimization utilities for quick setup
 */
export const PerformanceUtils = {
  // Quick cache instances
  getApiCache: () =>
    import('@/lib/cache/CacheManager').then(m => m.CacheManager.getApiCache()),
  getStaticDataCache: () =>
    import('@/lib/cache/CacheManager').then(m =>
      m.CacheManager.getStaticDataCache(),
    ),
  getUserDataCache: () =>
    import('@/lib/cache/CacheManager').then(m =>
      m.CacheManager.getUserDataCache(),
    ),

  // Quick database optimization
  getDatabaseOptimizer: () =>
    import('@/lib/api/database/DatabaseOptimizationService').then(m =>
      m.default.getInstance(),
    ),
};
