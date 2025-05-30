import { useMemo, useState, useEffect } from 'react';
import { useAsyncData } from '@/hooks/useAsyncData';
import type { Suggestion } from '../types';

export const useSearchSuggestions = (summonerName: string) => {
  // Debounce to avoid too many requests
  const [debouncedSummonerName, setDebouncedSummonerName] = useState(summonerName);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSummonerName(summonerName);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [summonerName]);

  // Using useAsyncData instead of manual useEffect for better management
  const searchUrl = useMemo(() => {
    return debouncedSummonerName.length >= 2
      ? `/api/summoner/search?q=${encodeURIComponent(debouncedSummonerName)}`
      : null;
  }, [debouncedSummonerName]);

  const {
    data: suggestions = [],
    error: suggestionError,
    loading,
  } = useAsyncData<Suggestion[]>({
    url: searchUrl,
    enabled: !!searchUrl,
    immediate: true,
    retryCount: 1, // Reduce retry for searches
    cacheTTL: 30000, // Cache 30s to avoid repeated requests
  });

  return {
    suggestions: searchUrl ? suggestions : [],
    suggestionError,
    loading,
  };
};
