import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { useEffectiveUser } from '@/hooks/useEffectiveUser';
import { validateSearchForm } from '../utils/validationUtils';
import type { SearchFormData, Suggestion } from '../types';

export const useSearchForm = () => {
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const { setUser } = useUserStore();
  const router = useRouter();

  const [summonerName, setSummonerName] = useState<string>(effectiveName || '');
  const [tagline, setTagline] = useState<string>(effectiveTagline || '');
  const [hasError, setHasError] = useState<boolean>(false);

  // Sync local state with effective values (e.g., direct navigation)
  useEffect(() => {
    setTagline(effectiveTagline || '');
    setSummonerName(effectiveName || '');
  }, [effectiveTagline, effectiveName]);

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
          summonerName,
        )}/${encodeURIComponent(tagline)}`,
      );
    },
    [summonerName, tagline, setUser, router],
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: Suggestion, setRegion: (region: any) => void) => {
      setSummonerName(suggestion.name);
      setTagline(suggestion.tagline);
      setRegion(suggestion.region);
    },
    [],
  );

  return {
    summonerName,
    setSummonerName,
    tagline,
    setTagline,
    hasError,
    handleSubmit,
    handleSuggestionSelect,
  };
};
