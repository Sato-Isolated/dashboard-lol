'use client';
import React, { useEffect, useState } from 'react';
import PerformanceMonitoringService from '@/lib/api/monitoring/PerformanceMonitoringService';

interface PerformanceMetrics {
  [key: string]: {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  };
}

interface CacheMetrics {
  hitRate: number;
  missRate: number;
  totalOperations: number;
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [cacheMetrics, setCacheMetrics] = useState<CacheMetrics>({
    hitRate: 0,
    missRate: 0,
    totalOperations: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const performanceMonitor = PerformanceMonitoringService.getInstance();

    const updateMetrics = () => {
      if (isVisible) {
        const dashboard = performanceMonitor.getPerformanceDashboard();
        const cache = performanceMonitor.getCacheMetrics();
        setMetrics(dashboard);
        setCacheMetrics(cache);
      }
    };

    // Update metrics every 5 seconds when visible
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial load

    return () => clearInterval(interval);
  }, [isVisible]);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const formatDuration = (ms: number): string => {
    if (ms < 1) {
      return `${ms.toFixed(2)}ms`;
    }
    if (ms < 1000) {
      return `${ms.toFixed(1)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) {
      return '0 Bytes';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <>
      {/* Toggle Button */}
      <div className='fixed bottom-4 right-4 z-50'>
        <button
          className='btn btn-circle btn-primary btn-sm'
          onClick={() => setIsVisible(!isVisible)}
          title='Toggle Performance Dashboard'
        >
          📊
        </button>
      </div>

      {/* Performance Dashboard Modal */}
      {isVisible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4'>
          <div className='bg-base-100 rounded-lg shadow-xl max-w-6xl w-full max-h-[80vh] overflow-auto'>
            <div className='p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>Performance Dashboard</h2>
                <button
                  className='btn btn-circle btn-sm'
                  onClick={() => setIsVisible(false)}
                >
                  ✕
                </button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {/* Cache Performance */}
                <div className='card bg-base-200 shadow'>
                  <div className='card-body'>
                    <h3 className='card-title text-lg'>Cache Performance</h3>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span>Hit Rate:</span>
                        <span className='font-mono text-success'>
                          {cacheMetrics.hitRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Miss Rate:</span>
                        <span className='font-mono text-error'>
                          {cacheMetrics.missRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Total Ops:</span>
                        <span className='font-mono'>
                          {cacheMetrics.totalOperations}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Response Times */}
                {metrics.api_response_time && (
                  <div className='card bg-base-200 shadow'>
                    <div className='card-body'>
                      <h3 className='card-title text-lg'>API Response Time</h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span>Average:</span>
                          <span className='font-mono'>
                            {formatDuration(metrics.api_response_time.average)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>P95:</span>
                          <span className='font-mono'>
                            {formatDuration(metrics.api_response_time.p95)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Max:</span>
                          <span className='font-mono'>
                            {formatDuration(metrics.api_response_time.max)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Count:</span>
                          <span className='font-mono'>
                            {metrics.api_response_time.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Database Query Times */}
                {metrics.db_query_time && (
                  <div className='card bg-base-200 shadow'>
                    <div className='card-body'>
                      <h3 className='card-title text-lg'>Database Queries</h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span>Average:</span>
                          <span className='font-mono'>
                            {formatDuration(metrics.db_query_time.average)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>P95:</span>
                          <span className='font-mono'>
                            {formatDuration(metrics.db_query_time.p95)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Max:</span>
                          <span className='font-mono'>
                            {formatDuration(metrics.db_query_time.max)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Count:</span>
                          <span className='font-mono'>
                            {metrics.db_query_time.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Component Render Times */}
                {metrics.component_render_time && (
                  <div className='card bg-base-200 shadow'>
                    <div className='card-body'>
                      <h3 className='card-title text-lg'>Component Renders</h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span>Average:</span>
                          <span className='font-mono'>
                            {formatDuration(
                              metrics.component_render_time.average
                            )}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>P95:</span>
                          <span className='font-mono'>
                            {formatDuration(metrics.component_render_time.p95)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Count:</span>
                          <span className='font-mono'>
                            {metrics.component_render_time.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Memory Usage */}
                {metrics.memory_used && (
                  <div className='card bg-base-200 shadow'>
                    <div className='card-body'>
                      <h3 className='card-title text-lg'>Memory Usage</h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span>Used:</span>
                          <span className='font-mono'>
                            {formatBytes(metrics.memory_used.average)}
                          </span>
                        </div>
                        {metrics.memory_total && (
                          <div className='flex justify-between'>
                            <span>Total:</span>
                            <span className='font-mono'>
                              {formatBytes(metrics.memory_total.average)}
                            </span>
                          </div>
                        )}
                        {metrics.memory_limit && (
                          <div className='flex justify-between'>
                            <span>Limit:</span>
                            <span className='font-mono'>
                              {formatBytes(metrics.memory_limit.average)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Page Load Times */}
                {metrics.page_load_time && (
                  <div className='card bg-base-200 shadow'>
                    <div className='card-body'>
                      <h3 className='card-title text-lg'>Page Load</h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span>Load Time:</span>
                          <span className='font-mono'>
                            {formatDuration(metrics.page_load_time.average)}
                          </span>
                        </div>
                        {metrics.dom_content_loaded && (
                          <div className='flex justify-between'>
                            <span>DOM Ready:</span>
                            <span className='font-mono'>
                              {formatDuration(
                                metrics.dom_content_loaded.average
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Export Button */}
              <div className='mt-6 flex justify-end'>
                <button
                  className='btn btn-outline btn-sm'
                  onClick={() => {
                    const performanceMonitor =
                      PerformanceMonitoringService.getInstance();
                    const exportData = performanceMonitor.exportMetrics();
                    const blob = new Blob(
                      [JSON.stringify(exportData, null, 2)],
                      {
                        type: 'application/json',
                      }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `performance-metrics-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export Metrics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceDashboard;
