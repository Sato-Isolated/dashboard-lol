import { useMemo, useCallback } from 'react';
import type { UIMatch } from '@/features/matches/types/uiMatchTypes';

export const useTabState = (match: UIMatch, setTab: (tab: string) => void) => {
  // Use a unique group name for each match card (use gameId)
  const groupId = useMemo(
    () => `match_tabs_${match.gameId || 'default'}`,
    [match.gameId],
  );

  // Memoize event handlers
  const handleTabChange = useCallback(
    (newTab: string) => {
      setTab(newTab);
    },
    [setTab],
  );

  return {
    groupId,
    handleTabChange,
  };
};
