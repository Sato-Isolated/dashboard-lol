import { useState, useRef, useCallback } from "react";
import type { UIMatch } from "@/types/ui-match";
import { mapRiotMatchToUIMatch } from "@/utils/helper";
import { useEffectiveUser } from "@/hooks/useEffectiveUser";

export function useMatchHistory() {
  const { effectiveName, effectiveRegion, effectiveTagline } = useEffectiveUser();
  const [matches, setMatches] = useState<UIMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(0);
  const count = 10;
  const [hasMore, setHasMore] = useState(true);
  const cacheMatches = useRef<Record<string, UIMatch[]>>({});

  const fetchMatches = useCallback(async (reset = false) => {
    if (!effectiveName || !effectiveRegion || !effectiveTagline) return;
    setLoading(true);
    setError(null);
    const cacheKey = `${effectiveRegion}-${effectiveTagline}-${effectiveName}`;
    if (cacheMatches.current[cacheKey] && !reset) {
      setMatches(cacheMatches.current[cacheKey]);
      setLoading(false);
      setHasMore(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/matches?name=${encodeURIComponent(effectiveName)}&region=${encodeURIComponent(effectiveRegion)}&tagline=${encodeURIComponent(effectiveTagline)}&start=${reset ? 0 : start}&count=${count}`
      );
      if (!res.ok) throw new Error("Erreur lors du chargement des matchs");
      const data = await res.json();
      const uiMatches = data.map((m: any) => mapRiotMatchToUIMatch(m, effectiveName));
      setMatches(reset ? uiMatches : [...matches, ...uiMatches]);
      cacheMatches.current[cacheKey] = reset ? uiMatches : [...matches, ...uiMatches];
      setHasMore(uiMatches.length === count);
      setStart(reset ? count : start + count);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [effectiveName, effectiveRegion, effectiveTagline, start, matches]);

  return { matches, error, loading, hasMore, fetchMatches };
} 