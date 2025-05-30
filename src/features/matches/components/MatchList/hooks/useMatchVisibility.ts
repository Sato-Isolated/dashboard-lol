import { useState, useEffect, useRef } from 'react';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';

/**
 * Hook to manage match list visibility and prevent rerender issues
 * Ensures matches remain visible during state transitions
 */
export const useMatchVisibility = (
  matches: UIMatch[],
  loading: boolean,
  error: string | null,
) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastValidMatches, setLastValidMatches] = useState<UIMatch[]>(matches);
  const prevMatchesRef = useRef<UIMatch[]>(matches);
  const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (visibilityTimeoutRef.current) {
      clearTimeout(visibilityTimeoutRef.current);
    }

    // If we have valid matches, update our last valid state
    if (matches && matches.length > 0) {
      setLastValidMatches(matches);
      setIsVisible(true);
      prevMatchesRef.current = matches;
      return;
    }

    // If no matches but we're loading, keep showing previous matches temporarily
    if (loading && prevMatchesRef.current.length > 0) {
      setIsVisible(true);
      return;
    }

    // If we have an error, show it immediately
    if (error) {
      setIsVisible(true);
      return;
    }

    // If no matches and not loading, hide after a short delay to prevent flashing
    if (!matches || matches.length === 0) {
      visibilityTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    }

    return () => {
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
    };
  }, [matches, loading, error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
    };
  }, []);

  return {
    isVisible,
    displayMatches:
      isVisible && matches?.length > 0 ? matches : lastValidMatches,
    shouldShowContent: isVisible || loading,
  };
};
