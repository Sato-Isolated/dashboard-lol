// Cache Management
export { CacheManager } from '@/shared/lib/cache/CacheManager';

// Optimized Hooks
export {
  useOptimizedFetch,
  useOptimizedSummoner,
  useOptimizedMatchHistory,
  useOptimizedChampionStats,
  useOptimizedMasteries,
} from '@/shared/hooks/useOptimizedFetch';

export { default as usePerformanceOptimization } from '@/shared/hooks/usePerformanceOptimization';

// Performance Monitoring
export { default as PerformanceMonitoringService } from '@/shared/services/monitoring/PerformanceMonitoringService';

// Database Optimization
export { default as DatabaseOptimizationService } from '@/shared/services/database/DatabaseOptimizationService';

// Error Boundaries
export {
  ErrorBoundary,
  AsyncErrorBoundary,
  withErrorBoundary,
} from '@/shared/components/error/ErrorBoundary';

// Performance Components
export {
  withPerformanceTracking,
  PerformanceWrapper,
  useComponentPerformanceTracking,
} from '@/shared/components/performance/PerformanceWrapper';

export { default as PerformanceDashboard } from '@/shared/components/debug/PerformanceDashboard';

/**
 * Initialization function for all optimization services
 */
export async function initializeOptimizations() {
  try {
    // Initialize performance monitoring
    const PerformanceMonitoringService = (
      await import('@/shared/services/monitoring/PerformanceMonitoringService')
    ).default;
    const performanceMonitor = PerformanceMonitoringService.getInstance();
    performanceMonitor.startMonitoring();

    // Initialize database optimization (server-side only)
    if (typeof window === 'undefined') {
      const DatabaseOptimizationService = (
        await import('@/shared/services/database/DatabaseOptimizationService')
      ).default;
      const dbOptimizer = DatabaseOptimizationService.getInstance();
      await dbOptimizer.createOptimizedIndexes();
    }

    console.log('🚀 Performance optimizations initialized');
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
    import('@/shared/lib/cache/CacheManager').then(m =>
      m.CacheManager.getApiCache()
    ),
  getStaticDataCache: () =>
    import('@/shared/lib/cache/CacheManager').then(m =>
      m.CacheManager.getStaticDataCache()
    ),
  getUserDataCache: () =>
    import('@/shared/lib/cache/CacheManager').then(m =>
      m.CacheManager.getUserDataCache()
    ),

  // Quick performance monitoring
  getPerformanceMonitor: () =>
    import('@/shared/services/monitoring/PerformanceMonitoringService').then(
      m => m.default.getInstance()
    ),

  // Quick database optimization
  getDatabaseOptimizer: () =>
    import('@/shared/services/database/DatabaseOptimizationService').then(m =>
      m.default.getInstance()
    ),
};
