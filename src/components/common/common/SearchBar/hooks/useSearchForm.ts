import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { useEffectiveUser } from '@/hooks/useEffectiveUser';
import { validateSearchForm } from '../utils/validationUtils';
import type { SearchFormData, Suggestion } from '../types';

export const useSearchForm = () => {
  const { effectiveTagline, effectiveName } = useEffectiveUser();
  const { setUser } = useUserStore();
  const router = useRouter();

  // Optimization: initialize directly with the correct values
  const [summonerName, setSummonerName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

  // Optimization: only synchronize if the user hasn't interacted yet
  useEffect(() => {
    if (!hasUserInteracted && (effectiveName || effectiveTagline)) {
      setSummonerName(effectiveName || '');
      setTagline(effectiveTagline || '');
    }
  }, [effectiveName, effectiveTagline, hasUserInteracted]);

  const handleSubmit = useCallback(
    (region: string, e: React.FormEvent) => {
      e.preventDefault();
      const formData: SearchFormData = {
        summonerName,
        tagline,
        region: region as any,
      };

      const isValid = validateSearchForm(formData);

      if (!isValid) {
        setHasError(true);
        return;
      }

      setHasError(false);
      setUser({ region, tagline, summonerName });
      router.push(
        `/${region}/summoner/${encodeURIComponent(
          summonerName
        )}/${encodeURIComponent(tagline)}`
      );
    },
    [summonerName, tagline, setUser, router]
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: Suggestion, setRegion: (region: any) => void) => {
      setSummonerName(suggestion.name);
      setTagline(suggestion.tagline);
      setRegion(suggestion.region);
    },
    []
  );

  // Wrappers to mark user interaction
  const handleSummonerNameChange = useCallback((value: string) => {
    setHasUserInteracted(true);
    setSummonerName(value);
  }, []);

  const handleTaglineChange = useCallback((value: string) => {
    setHasUserInteracted(true);
    setTagline(value);
  }, []);

  return {
    summonerName,
    setSummonerName: handleSummonerNameChange,
    tagline,
    setTagline: handleTaglineChange,
    hasError,
    handleSubmit,
    handleSuggestionSelect,
  };
};
