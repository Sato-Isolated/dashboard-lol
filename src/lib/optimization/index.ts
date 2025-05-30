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

// Performance Monitoring
export { default as PerformanceMonitoringService } from '@/lib/api/monitoring/PerformanceMonitoringService';

// Database Optimization
export { default as DatabaseOptimizationService } from '@/lib/api/database/DatabaseOptimizationService';

// Error Boundaries
export {
  ErrorBoundary,
  AsyncErrorBoundary,
  withErrorBoundary,
} from '@/components/common/error/ErrorBoundary';

export { default as PerformanceDashboard } from '@/components/common/debug/PerformanceDashboard';

/**
 * Initialization function for all optimization services
 */
export async function initializeOptimizations() {
  try {
    // Initialize performance monitoring
    const PerformanceMonitoringService = (
      await import('@/lib/api/monitoring/PerformanceMonitoringService')
    ).default;
    const performanceMonitor = PerformanceMonitoringService.getInstance();
    performanceMonitor.startMonitoring();

    // Initialize database optimization (server-side only)
    if (typeof window === 'undefined') {
      const DatabaseOptimizationService = (
        await import('@/lib/api/database/DatabaseOptimizationService')
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
    import('@/lib/cache/CacheManager').then(m => m.CacheManager.getApiCache()),
  getStaticDataCache: () =>
    import('@/lib/cache/CacheManager').then(m =>
      m.CacheManager.getStaticDataCache(),
    ),
  getUserDataCache: () =>
    import('@/lib/cache/CacheManager').then(m =>
      m.CacheManager.getUserDataCache(),
    ),

  // Quick performance monitoring
  getPerformanceMonitor: () =>
    import('@/lib/api/monitoring/PerformanceMonitoringService').then(m =>
      m.default.getInstance(),
    ),

  // Quick database optimization
  getDatabaseOptimizer: () =>
    import('@/lib/api/database/DatabaseOptimizationService').then(m =>
      m.default.getInstance(),
    ),
};
