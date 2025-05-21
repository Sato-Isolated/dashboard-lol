import { useState, useCallback, useEffect } from "react";
import type { UIMatch } from "@/types/ui-match";
import { mapRiotMatchToUIMatch } from "@/utils/helper";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";
import { useApiResource } from "./useApiResource";
import type { Match } from "@/types/api/match";

export function useMatchHistory(): {
  matches: UIMatch[];
  error: string | null;
  loading: boolean;
  hasMore: boolean;
  fetchMatches: (reset?: boolean) => void;
} {
  const { effectiveName, effectiveRegion, effectiveTagline } =
    useEffectiveUser();
  const [matches, setMatches] = useState<UIMatch[]>([]);
  const [start, setStart] = useState(0);
  const count = 10;
  const [hasMore, setHasMore] = useState(true);
  const [resetFlag, setResetFlag] = useState(false);

  const cacheKey = `${effectiveRegion}-${effectiveTagline}-${effectiveName}-${start}-${resetFlag}`;
  const url =
    effectiveName && effectiveRegion && effectiveTagline
      ? `/api/matches?name=${encodeURIComponent(
          effectiveName
        )}&region=${encodeURIComponent(
          effectiveRegion
        )}&tagline=${encodeURIComponent(effectiveTagline)}&start=${start}&count=${count}`
      : null;

  const { data, error, loading } = useApiResource<unknown[]>(url, cacheKey);

  useEffect(() => {
    if (!data) return;
    const uiMatches = (data as Match[]).map((m) =>
      mapRiotMatchToUIMatch(m, effectiveName)
    );
    setMatches(resetFlag ? uiMatches : [...matches, ...uiMatches]);
    setHasMore(uiMatches.length === count);
    if (resetFlag) {
      setStart(count);
    } else {
      setStart((prev) => prev + count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, resetFlag]);

  const fetchMatches = useCallback(
    (reset = false) => {
      if (reset) {
        setResetFlag(true);
        setStart(0);
        setMatches([]);
      } else {
        setResetFlag(false);
      }
    },
    []
  );

  return { matches, error: error || null, loading, hasMore, fetchMatches };
}
