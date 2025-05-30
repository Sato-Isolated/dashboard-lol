import { useState, useEffect } from 'react';
import type { Suggestion } from '../types';

export const useSearchSuggestions = (summonerName: string) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    if (summonerName.length >= 2) {
      setSuggestionError(null);
      fetch(`/api/summoner/search?q=${encodeURIComponent(summonerName)}`, {
        signal: controller.signal,
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Error while searching for players.');
          }
          return res.json();
        })
        .then(data => setSuggestions(data))
        .catch(e => {
          if (e.name === 'AbortError') {
            return;
          }
          setSuggestionError(e.message || 'Error while searching for players.');
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
      setSuggestionError(null);
    }

    return () => controller.abort();
  }, [summonerName]);

  return { suggestions, suggestionError };
};
