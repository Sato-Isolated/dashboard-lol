// src/hooks/useApiResource.ts
import { useState, useRef, useEffect, useCallback } from "react";

export function useApiResource<T = unknown>(
  url: string | null,
  cacheKey: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Record<string, T>>({});

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    if (cache.current[cacheKey]) {
      setData(cache.current[cacheKey]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(url);
      let json;
      try {
        json = await res.json();
      } catch {
        json = null;
      }
      if (!res.ok) {
        setError(json?.error || "Erreur lors du chargement des données");
        setData(null);
      } else {
        setData(json);
        cache.current[cacheKey] = json;
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors du chargement des données");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, cacheKey]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, cacheKey]);

  return { data, loading, error, refetch: fetchData };
}
