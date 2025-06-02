import { useState, useEffect } from 'react';
import { useSummonerSearchQuery } from '@/hooks/useTanStackQueries';
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

  // Use the existing summoner search endpoint
  const { 
    data, 
    isLoading: loading, 
    error 
  } = useSummonerSearchQuery(
    debouncedSummonerName, 
    debouncedSummonerName.length >= 2
  );

  // Transform the API response to match our Suggestion interface
  const suggestions: Suggestion[] = (data || []).map((user: any) => ({
    name: user.name,
    tagline: user.tagline,
    region: user.region,
  }));

  const suggestionError: string | null = error?.message || null;

  return {
    suggestions: debouncedSummonerName.length >= 2 ? suggestions : [],
    suggestionError,
    loading,
  };
};
