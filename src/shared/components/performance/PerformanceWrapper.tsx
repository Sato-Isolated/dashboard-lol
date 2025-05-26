import React, { useEffect, useRef, forwardRef } from "react";
import usePerformanceOptimization from "@/shared/hooks/usePerformanceOptimization";

interface PerformanceWrapperProps {
  componentName: string;
  trackRender?: boolean;
  trackInteractions?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * HOC that adds performance tracking to any component
 */
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const PerformanceTrackedComponent = forwardRef<
    React.ComponentRef<typeof WrappedComponent>,
    P
  >((props, ref) => {
    const { trackComponentRender } = usePerformanceOptimization();
    const renderEndRef = useRef<(() => void) | null>(null);

    useEffect(() => {
      renderEndRef.current = trackComponentRender(
        componentName ||
          WrappedComponent.displayName ||
          WrappedComponent.name ||
          "Unknown"
      );

      return () => {
        if (renderEndRef.current) {
          renderEndRef.current();
        }
      };
    });

    return <WrappedComponent {...(props as P)} ref={ref} />;
  });

  PerformanceTrackedComponent.displayName = `withPerformanceTracking(${
    componentName || WrappedComponent.displayName || WrappedComponent.name
  })`;

  return PerformanceTrackedComponent;
}

/**
 * Wrapper component that adds performance tracking
 */
export const PerformanceWrapper: React.FC<PerformanceWrapperProps> = ({
  componentName,
  trackRender = true,
  trackInteractions = false,
  children,
  className,
}) => {
  const { trackComponentRender, trackUserInteraction } =
    usePerformanceOptimization();
  const renderEndRef = useRef<(() => void) | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trackRender) {
      renderEndRef.current = trackComponentRender(componentName);
    }

    return () => {
      if (renderEndRef.current) {
        renderEndRef.current();
      }
    };
  }, [componentName, trackComponentRender, trackRender]);

  useEffect(() => {
    if (trackInteractions && containerRef.current) {
      const container = containerRef.current;
      const interactionTrackers = new Map<string, () => void>();

      const handleClick = () => {
        const endTracking = trackUserInteraction(`${componentName}_click`);
        setTimeout(endTracking, 0); // Track immediate response
      };

      const handleFocus = () => {
        const endTracking = trackUserInteraction(`${componentName}_focus`);
        interactionTrackers.set("focus", endTracking);
      };

      const handleBlur = () => {
        const endTracking = interactionTrackers.get("focus");
        if (endTracking) {
          endTracking();
          interactionTrackers.delete("focus");
        }
      };

      const handleKeyDown = () => {
        const endTracking = trackUserInteraction(`${componentName}_keydown`);
        setTimeout(endTracking, 0);
      };

      container.addEventListener("click", handleClick);
      container.addEventListener("focus", handleFocus, true);
      container.addEventListener("blur", handleBlur, true);
      container.addEventListener("keydown", handleKeyDown);

      return () => {
        container.removeEventListener("click", handleClick);
        container.removeEventListener("focus", handleFocus, true);
        container.removeEventListener("blur", handleBlur, true);
        container.removeEventListener("keydown", handleKeyDown);

        // End any ongoing tracking
        interactionTrackers.forEach((endTracking) => endTracking());
      };
    }
  }, [trackInteractions, componentName, trackUserInteraction]);

  return (
    <div
      ref={containerRef}
      className={className}
      data-component={componentName}
    >
      {children}
    </div>
  );
};

/**
 * Hook for manual performance tracking within components
 */
export function useComponentPerformanceTracking(componentName: string) {
  const { trackComponentRender, trackUserInteraction } =
    usePerformanceOptimization();

  const trackRender = React.useCallback(() => {
    return trackComponentRender(componentName);
  }, [trackComponentRender, componentName]);

  const trackInteraction = React.useCallback(
    (interactionType: string) => {
      return trackUserInteraction(`${componentName}_${interactionType}`);
    },
    [trackUserInteraction, componentName]
  );
  const trackAsyncOperation = React.useCallback(
    async <T,>(
      operationName: string,
      operation: () => Promise<T>
    ): Promise<T> => {
      const endTracking = trackUserInteraction(
        `${componentName}_${operationName}`
      );
      try {
        const result = await operation();
        return result;
      } finally {
        endTracking();
      }
    },
    [trackUserInteraction, componentName]
  );

  return {
    trackRender,
    trackInteraction,
    trackAsyncOperation,
  };
}

export default PerformanceWrapper;
