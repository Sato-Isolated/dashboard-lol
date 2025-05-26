/**
 * Higher-Order Component for performance tracking
 */
import React, { useEffect, ComponentType } from "react";
import PerformanceMonitoringService from "./PerformanceMonitoringService";

export function withPerformanceTracking<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string
) {
  const TrackedComponent = (props: P) => {
    const performanceService = PerformanceMonitoringService.getInstance();

    useEffect(() => {
      const startTime = performance.now();
      const trackingId = `${componentName}_render_${Date.now()}`;

      performanceService.startTimer(trackingId);

      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;

        performanceService.endTimer(trackingId);
        performanceService.recordMetric(
          `${componentName}_render_time`,
          renderTime
        );

        // Log slow renders (>16ms for 60fps)
        if (renderTime > 16) {
          console.warn(
            `Slow render detected in ${componentName}: ${renderTime.toFixed(
              2
            )}ms`
          );
        }
      };
    });

    return <WrappedComponent {...props} />;
  };

  TrackedComponent.displayName = `withPerformanceTracking(${componentName})`;

  return TrackedComponent;
}

export default withPerformanceTracking;
