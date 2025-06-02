import { useState, useEffect, useRef, useMemo } from 'react';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';

/**
 * Hook to manage match list visibility and prevent rerender issues
 * Ensures matches remain visible during state transitions
 */
export const useMatchVisibility = (
  matches: UIMatch[],
  loading: boolean,
  error: string | null
) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastValidMatches, setLastValidMatches] = useState<UIMatch[]>(matches);
  const prevMatchesRef = useRef<UIMatch[]>(matches);
  const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimization: calculate states with useMemo
  const visibilityState = useMemo(() => {
    const hasValidMatches = matches && matches.length > 0;
    const hadPreviousMatches = prevMatchesRef.current.length > 0;

    return {
      hasValidMatches,
      hadPreviousMatches,
      shouldShowImmediate:
        hasValidMatches || error || (loading && hadPreviousMatches),
      shouldHideWithDelay: !hasValidMatches && !loading && !error,
    };
  }, [matches, loading, error]);

  // Single optimized useEffect to handle all cases
  useEffect(() => {
    // Clear any existing timeout
    if (visibilityTimeoutRef.current) {
      clearTimeout(visibilityTimeoutRef.current);
      visibilityTimeoutRef.current = null;
    }

    const { hasValidMatches, shouldShowImmediate, shouldHideWithDelay } =
      visibilityState;

    // Update valid matches and refs when we have valid data
    if (hasValidMatches) {
      setLastValidMatches(matches);
      setIsVisible(true);
      prevMatchesRef.current = matches;
      return;
    }

    // Show immediately for loading/error states
    if (shouldShowImmediate) {
      setIsVisible(true);
      return;
    }

    // Hide with delay to prevent flashing
    if (shouldHideWithDelay) {
      visibilityTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    }

    // Cleanup function
    return () => {
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
        visibilityTimeoutRef.current = null;
      }
    };
  }, [matches, visibilityState]);

  return {
    isVisible,
    displayMatches:
      isVisible && matches?.length > 0 ? matches : lastValidMatches,
    shouldShowContent: isVisible || loading,
  };
};
