import { useState, useCallback } from "react";
import {
  handleUserUpdate,
  handleUserChampionMastery,
  handleUserRecentlyPlayedUpdate,
} from "@/lib/backgroundApiFetcher";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";

export function useUpdateUserData() {
  const { effectiveRegion, effectiveName, effectiveTagline } =
    useEffectiveUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await handleUserUpdate(effectiveRegion, effectiveName, effectiveTagline);
      await handleUserChampionMastery(
        effectiveRegion,
        effectiveName,
        effectiveTagline
      );
      await handleUserRecentlyPlayedUpdate(
        effectiveRegion,
        effectiveName,
        effectiveTagline
      );
      // Appel à syncAramScore via l'API
      const res = await fetch("/api/summoner/aram-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: effectiveRegion,
          name: effectiveName,
          tagline: effectiveTagline,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.calculated) {
          // Optional: show notification "ARAM score recalculated"
          // alert("ARAM score recalculated: " + data.aramScore);
        } else {
          // Optional: show notification "ARAM score already calculated"
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error while updating.");
    }
    setLoading(false);
  }, [effectiveRegion, effectiveName, effectiveTagline]);

  return { loading, error, updateUserData };
}
