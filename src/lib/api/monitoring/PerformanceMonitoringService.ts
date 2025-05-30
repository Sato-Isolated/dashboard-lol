/**
 * Performance monitoring service for tracking application metrics
 */

// Metric value interface
interface MetricValue {
  name: string;
  value: number;
  timestamp: number;
  tags: Record<string, string>;
}

// Metric summary interface
interface MetricSummary {
  count: number;
  average: number;
  min: number;
  max: number;
  p95: number;
}

export class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private metrics: Map<string, MetricValue> = new Map();
  private startTimes: Map<string, number> = new Map();

  public static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance =
        new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  /**
   * Start timing an operation
   */
  startTimer(operationName: string): void {
    this.startTimes.set(operationName, performance.now());
  }

  /**
   * End timing an operation and record the duration
   */
  endTimer(operationName: string): number {
    const startTime = this.startTimes.get(operationName);
    if (!startTime) {
      console.warn(`Timer for operation '${operationName}' was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.recordMetric(operationName, duration);
    this.startTimes.delete(operationName);
    return duration;
  }

  /**
   * Record a custom metric
   */
  recordMetric(
    name: string,
    value: number,
    tags?: Record<string, string>,
  ): void {
    const timestamp = Date.now();
    const metricKey = `${name}_${timestamp}`;

    this.metrics.set(metricKey, {
      name,
      value,
      timestamp,
      tags: tags || {},
    });

    // Keep only recent metrics (last hour)
    this.cleanupOldMetrics();
  }

  /**
   * Track API response times
   */
  trackAPICall(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
  ): void {
    this.recordMetric('api_response_time', duration, {
      endpoint,
      method,
      status: statusCode.toString(),
    });
  }

  /**
   * Track database query performance
   */
  trackDatabaseQuery(
    collection: string,
    operation: string,
    duration: number,
  ): void {
    this.recordMetric('db_query_time', duration, {
      collection,
      operation,
    });
  }

  /**
   * Track cache hit/miss rates
   */
  trackCacheOperation(
    operation: 'hit' | 'miss' | 'set' | 'delete',
    cacheType: string,
  ): void {
    this.recordMetric('cache_operation', 1, {
      operation,
      cacheType,
    });
  }

  /**
   * Track component render times
   */
  trackComponentRender(componentName: string, duration: number): void {
    this.recordMetric('component_render_time', duration, {
      component: componentName,
    });
  }

  /**
   * Track memory usage
   */
  trackMemoryUsage(): void {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (
        performance as Performance & {
          memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        }
      ).memory;
      if (memory) {
        this.recordMetric('memory_used', memory.usedJSHeapSize);
        this.recordMetric('memory_total', memory.totalJSHeapSize);
        this.recordMetric('memory_limit', memory.jsHeapSizeLimit);
      }
    }
  }

  /**
   * Track user interaction performance
   */
  trackUserInteraction(interactionType: string, duration: number): void {
    this.recordMetric('user_interaction_time', duration, {
      type: interactionType,
    });
  }

  /**
   * Get performance summary for a specific metric
   */
  getMetricSummary(
    metricName: string,
    timeWindow = 3600000,
  ): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  } {
    const cutoff = Date.now() - timeWindow;
    const relevantMetrics = Array.from(this.metrics.values())
      .filter(
        metric => metric.name === metricName && metric.timestamp >= cutoff,
      )
      .map(metric => metric.value)
      .sort((a, b) => a - b);

    if (relevantMetrics.length === 0) {
      return { count: 0, average: 0, min: 0, max: 0, p95: 0 };
    }

    const count = relevantMetrics.length;
    const sum = relevantMetrics.reduce((acc, val) => acc + val, 0);
    const average = sum / count;
    const min = relevantMetrics[0];
    const max = relevantMetrics[count - 1];
    const p95Index = Math.floor(count * 0.95);
    const p95 = relevantMetrics[p95Index] || max;

    return { count, average, min, max, p95 };
  }

  /**
   * Get all performance metrics for dashboard
   */
  getPerformanceDashboard(): Record<string, MetricSummary> {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    const recentMetrics = Array.from(this.metrics.values()).filter(
      metric => metric.timestamp >= oneHourAgo,
    );

    const metricsByName = recentMetrics.reduce(
      (acc, metric) => {
        if (!acc[metric.name]) {
          acc[metric.name] = [];
        }
        acc[metric.name].push(metric.value);
        return acc;
      },
      {} as Record<string, number[]>,
    );

    const dashboard: Record<string, MetricSummary> = {};

    Object.entries(metricsByName).forEach(([name, values]) => {
      const numValues = values as number[];
      const sorted = numValues.sort((a: number, b: number) => a - b);
      dashboard[name] = {
        count: numValues.length,
        average: numValues.reduce((a, b) => a + b, 0) / numValues.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        p95:
          sorted[Math.floor(sorted.length * 0.95)] || sorted[sorted.length - 1],
      };
    });

    return dashboard;
  }

  /**
   * Get cache performance metrics
   */
  getCacheMetrics(): {
    hitRate: number;
    missRate: number;
    totalOperations: number;
  } {
    const cacheMetrics = Array.from(this.metrics.values())
      .filter(metric => metric.name === 'cache_operation')
      .filter(metric => metric.timestamp >= Date.now() - 3600000);

    const hits = cacheMetrics.filter(m => m.tags.operation === 'hit').length;
    const misses = cacheMetrics.filter(m => m.tags.operation === 'miss').length;
    const total = hits + misses;

    return {
      hitRate: total > 0 ? (hits / total) * 100 : 0,
      missRate: total > 0 ? (misses / total) * 100 : 0,
      totalOperations: total,
    };
  }

  /**
   * Clean up old metrics to prevent memory leaks
   */
  private cleanupOldMetrics(): void {
    const cutoff = Date.now() - 3600000; // Keep last hour
    const keysToDelete: string[] = [];

    this.metrics.forEach((metric, key) => {
      if (metric.timestamp < cutoff) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.metrics.delete(key));
  }

  /**
   * Export performance data for analysis
   */
  exportMetrics(timeWindow = 3600000): MetricValue[] {
    const cutoff = Date.now() - timeWindow;
    return Array.from(this.metrics.values())
      .filter(metric => metric.timestamp >= cutoff)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Create performance timing decorator for functions
   */
  createTimingDecorator(operationName: string) {
    return <T extends (...args: unknown[]) => unknown>(
      target: unknown,
      propertyKey: string,
      descriptor: TypedPropertyDescriptor<T>,
    ) => {
      const originalMethod = descriptor.value;

      descriptor.value = async function (this: unknown, ...args: unknown[]) {
        const timer = `${operationName}_${propertyKey}`;
        PerformanceMonitoringService.getInstance().startTimer(timer);

        try {
          const result = await originalMethod?.apply(this, args);
          return result;
        } finally {
          PerformanceMonitoringService.getInstance().endTimer(timer);
        }
      } as T;

      return descriptor;
    };
  }

  /**
   * Monitor Core Web Vitals if in browser
   */
  monitorCoreWebVitals(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Monitor Largest Contentful Paint (LCP)
    if ('web-vitals' in window) {
      // This would require installing web-vitals package
      // For now, we'll use basic performance observer
    }

    // Basic performance observer for navigation timing
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric(
              'page_load_time',
              navEntry.loadEventEnd - navEntry.startTime,
            );
            this.recordMetric(
              'dom_content_loaded',
              navEntry.domContentLoadedEventEnd - navEntry.startTime,
            );
            this.recordMetric(
              'first_paint',
              navEntry.fetchStart ? navEntry.fetchStart - navEntry.startTime : 0,
            );
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  /**
   * Start automatic performance monitoring
   */
  startMonitoring(): void {
    // Monitor memory usage every 30 seconds
    setInterval(() => {
      this.trackMemoryUsage();
    }, 30000);

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Clean up old metrics every 5 minutes
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 300000);

    console.log('Performance monitoring started');
  }
}

export default PerformanceMonitoringService;
