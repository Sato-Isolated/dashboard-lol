import { useMemo, useState, useEffect } from 'react';
import { useAsyncData } from '@/hooks/useAsyncData';
import type { Suggestion } from '../types';

export const useSearchSuggestions = (summonerName: string) => {
  // Debounce pour éviter trop de requêtes
  const [debouncedSummonerName, setDebouncedSummonerName] = useState(summonerName);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSummonerName(summonerName);
    }, 300); // 300ms de délai

    return () => clearTimeout(timer);
  }, [summonerName]);

  // Utilisation d'useAsyncData au lieu d'useEffect manuel pour une meilleure gestion
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
    retryCount: 1, // Réduire les retry pour les recherches
    cacheTTL: 30000, // Cache 30s pour éviter les requêtes répétées
  });

  return {
    suggestions: searchUrl ? suggestions : [],
    suggestionError,
    loading,
  };
};
