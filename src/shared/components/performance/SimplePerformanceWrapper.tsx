'use client';
import React, { useEffect, forwardRef } from "react";

/**
 * Simple client-side performance tracking wrapper
 * Does not use any server-side dependencies
 */
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PerformanceTrackedComponent = forwardRef<any, P>((props, ref) => {
    useEffect(() => {
      if (typeof window !== "undefined") {
        const startTime = performance.now();
        const name =
          componentName ||
          WrappedComponent.displayName ||
          WrappedComponent.name ||
          "Unknown";

        return () => {
          const endTime = performance.now();
          const renderTime = endTime - startTime;

          // Log slow renders (>16ms for 60fps)
          if (renderTime > 16) {
            console.warn(
              `Slow render detected in ${name}: ${renderTime.toFixed(2)}ms`
            );
          }

          // Track in performance observer if available
          if ("performance" in window && "mark" in performance) {
            performance.mark(`${name}_render_end`);
          }
        };
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <WrappedComponent {...(props as any)} ref={ref} />;
  });

  PerformanceTrackedComponent.displayName = `withPerformanceTracking(${
    componentName || WrappedComponent.displayName || WrappedComponent.name
  })`;

  return PerformanceTrackedComponent;
}
