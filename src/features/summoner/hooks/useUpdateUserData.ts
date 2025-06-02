import { useCallback } from 'react';
import {
  handleUserUpdate,
  handleUserChampionMastery,
  handleUserRecentlyPlayedUpdate,
} from '@/lib/utils/backgroundApiClient';
import { useUserDataAction } from '@/hooks/useUserDataOperation';

export function useUpdateUserData() {
  const {
    loading,
    error,
    executeUserAction,
    effectiveRegion,
    effectiveName,
    effectiveTagline,
  } = useUserDataAction();

  const updateUserData = useCallback(async () => {
    return executeUserAction(
      async (region: string, name: string, tagline: string) => {
        await handleUserUpdate(region, name, tagline);
        await handleUserChampionMastery(region, name, tagline);
        await handleUserRecentlyPlayedUpdate(region, name, tagline);

        // Call to syncAramScore via the API
        const res = await fetch('/api/summoner/aram-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            region,
            name,
            tagline,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.calculated) {
            // Optional: show notification "ARAM score recalculated"
          }
        }

        // Handle API permission errors specifically
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const errorMessage = errorData.error || 'Error while updating.';

          if (
            errorMessage.includes('Forbidden') ||
            errorMessage.includes('API key lacks required permissions')
          ) {
            throw new Error(
              'Insufficient API permissions. Please check your Riot Games API key.',
            );
          } else {
            throw new Error(errorMessage);
          }
        }
      },
    );
  }, [executeUserAction]);

  return {
    loading,
    error,
    updateUserData,
    // Expose user data for convenience
    effectiveRegion,
    effectiveName,
    effectiveTagline,
  };
}
