import { useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import type { UIMatch } from '@/features/matches/types/ui-match.types';
import { mapRiotMatchToUIMatch } from '@/shared/lib/utils/helpers';
import { useEffectiveUser } from '@/shared/hooks/useEffectiveUser';
import type { Match } from '@/shared/types/api/match.types';

const PAGE_SIZE = 10;

export function useMatchHistory(): {
  matches: UIMatch[];
  error: string | null;
  loading: boolean;
  hasMore: boolean;
  fetchMatches: (reset?: boolean) => void;
} {
  const { effectiveName, effectiveRegion, effectiveTagline } =
    useEffectiveUser();

  const getKey = (
    pageIndex: number,
    previousPageData: { data: Match[] } | null
  ) => {
    if (!effectiveName || !effectiveRegion || !effectiveTagline) return null;
    if (
      previousPageData &&
      previousPageData.data &&
      previousPageData.data.length === 0
    )
      return null; // no more pages
    return [
      `/api/summoner/matches?name=${encodeURIComponent(
        effectiveName
      )}&region=${encodeURIComponent(
        effectiveRegion
      )}&tagline=${encodeURIComponent(effectiveTagline)}&start=${
        pageIndex * PAGE_SIZE
      }&count=${PAGE_SIZE}`,
      effectiveRegion,
      effectiveTagline,
      effectiveName,
    ];
  };

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'Error loading data');
    return json;
  };

  const { data, error, isLoading, setSize, size, mutate, isValidating } =
    useSWRInfinite<{ data: Match[] }>(getKey, ([url]) => fetcher(url));

  // Concatenate all match pages
  const matches: UIMatch[] =
    data?.flatMap(page =>
      (page.data || []).map(m => mapRiotMatchToUIMatch(m, effectiveName))
    ) || [];

  const hasMore = data
    ? data[data.length - 1]?.data.length === PAGE_SIZE
    : true;

  // fetchMatches: reset = true => reset pagination, otherwise load next page
  const fetchMatches = useCallback(
    (reset = false) => {
      if (reset) {
        setSize(1);
        mutate();
      } else {
        setSize(size + 1);
      }
    },
    [setSize, size, mutate]
  );

  return {
    matches,
    error: error
      ? error instanceof Error
        ? error.message
        : String(error)
      : null,
    loading: isLoading || isValidating,
    hasMore,
    fetchMatches,
  };
}
