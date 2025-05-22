import { useState, useCallback } from "react";
import { handleUserUpdate, handleUserChampionMastery, handleUserRecentlyPlayedUpdate } from "@/lib/backgroundApiFetcher";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";

export function useUpdateUserData() {
  const { effectiveRegion, effectiveName, effectiveTagline } = useEffectiveUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await handleUserUpdate(effectiveRegion, effectiveName, effectiveTagline);
      await handleUserChampionMastery(effectiveRegion, effectiveName, effectiveTagline);
      await handleUserRecentlyPlayedUpdate(effectiveRegion, effectiveName, effectiveTagline);
      window.location.reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la mise à jour.");
    }
    setLoading(false);
  }, [effectiveRegion, effectiveName, effectiveTagline]);

  return { loading, error, updateUserData };
} 