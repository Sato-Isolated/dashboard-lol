'use client';

import { useQuery, useInfiniteQuery  } from '@tanstack/react-query';

// ========== Query Key Factories ==========
export const summonerKeys = {
  all: ['summoner'] as const,
  summoner: (region: string, name: string, tagline: string) => 
    [...summonerKeys.all, 'data', region, name, tagline] as const,
  aramScore: (region: string, name: string, tagline: string) => 
    [...summonerKeys.all, 'aramScore', region, name, tagline] as const,
  recentlyPlayed: (region: string, name: string, tagline: string, limit: number) => 
    [...summonerKeys.all, 'recentlyPlayed', region, name, tagline, limit] as const,
  masteries: (region: string, name: string, tagline: string) => 
    [...summonerKeys.all, 'masteries', region, name, tagline] as const,
  search: (query: string) => 
    [...summonerKeys.all, 'search', query] as const,
} as const;

export const matchKeys = {
  all: ['matches'] as const,
  history: (region: string, puuid: string) => 
    [...matchKeys.all, 'history', region, puuid] as const,
  summoner: (region: string, name: string, tagline: string) => 
    [...matchKeys.all, 'summoner', region, name, tagline] as const,
} as const;

// ========== Fetcher Functions ==========
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
};

// ========== Summoner Hooks ==========

/**
 * Hook for fetching complete summoner data (account + summoner + leagues + aramScore)
 */
export function useSummonerQuery(region?: string, name?: string, tagline?: string) {
  return useQuery({
    queryKey: region && name && tagline 
      ? summonerKeys.summoner(region, name, tagline) 
      : ['summoner', 'disabled'],
    queryFn: () => fetcher(
      `/api/summoner?region=${encodeURIComponent(region!)}&name=${encodeURIComponent(name!)}&tagline=${encodeURIComponent(tagline!)}`
    ),
    enabled: !!(region && name && tagline),
    staleTime: 5 * 60 * 1000, // 5 minutes - summoner data doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching recently played summoners
 */
export function useRecentlyPlayedQuery(
  region?: string, 
  name?: string, 
  tagline?: string, 
  limit: number = 5
) {
  return useQuery({
    queryKey: region && name && tagline 
      ? summonerKeys.recentlyPlayed(region, name, tagline, limit) 
      : ['recentlyPlayed', 'disabled'],
    queryFn: () => fetcher(
      `/api/summoner/recently-played?region=${encodeURIComponent(region!)}&name=${encodeURIComponent(name!)}&tagline=${encodeURIComponent(tagline!)}&limit=${limit}`
    ),
    enabled: !!(region && name && tagline),
    staleTime: 2 * 60 * 1000, // 2 minutes - recently played changes more frequently
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    retry: 2,
  });
}

/**
 * Hook for searching summoners
 */
export function useSummonerSearchQuery(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: query && enabled 
      ? summonerKeys.search(query) 
      : ['search', 'disabled'],
    queryFn: () => fetcher(`/api/summoner/search?q=${encodeURIComponent(query)}`),
    enabled: enabled && query.length >= 2, // Don't search for very short queries
    staleTime: 1 * 60 * 1000, // 1 minute - search results can change
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 1,
  });
}

// ========== Match Hooks ==========

/**
 * Hook for fetching infinite match history with pagination
 */
export function useMatchHistoryInfinite(
  region?: string, 
  name?: string, 
  tagline?: string,
  count: number = 20
) {
  return useInfiniteQuery({
    queryKey: region && name && tagline 
      ? matchKeys.summoner(region, name, tagline) 
      : ['matches', 'disabled'],
    queryFn: ({ pageParam = 0 }) => fetcher(
      `/api/summoner/matches?region=${encodeURIComponent(region!)}&name=${encodeURIComponent(name!)}&tagline=${encodeURIComponent(tagline!)}&start=${pageParam}&count=${count}`
    ),    getNextPageParam: (lastPage, pages) => {
      // More robust pagination logic
      const hasMore = lastPage?.data?.length === count;
      const nextStart = pages.length * count;
      
      console.log('getNextPageParam:', {
        lastPageLength: lastPage?.data?.length,
        expectedCount: count,
        hasMore,
        nextStart,
        totalPages: pages.length,
      });
      
      return hasMore ? nextStart : undefined;
    },
    enabled: !!(region && name && tagline),
    staleTime: 5 * 60 * 1000, // 5 minutes - match history can change
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 2,
    initialPageParam: 0,
  });
}

// ========== Generic Hooks (replacements for useAsyncData) ==========

/**
 * Generic hook for any API call - replaces useAsyncData
 * @param url - The URL to fetch from
 * @param options - Additional query options
 */
export function useApiQuery<T = unknown>(
  url?: string | null,
  options?: Partial<Parameters<typeof useQuery>[0]>
) {
  return useQuery({
    queryKey: [url],
    queryFn: () => fetcher(url!),
    enabled: !!url,
    staleTime: 5 * 60 * 1000, // 5 minutes default
    gcTime: 30 * 60 * 1000, // 30 minutes default
    retry: 2,
    ...options,
  });
}

// ========== Champion Hooks ==========

export const championKeys = {
  all: ['champion'] as const,
  stats: (region: string, championId: string) => 
    [...championKeys.all, 'stats', region, championId] as const,
  masteries: (region: string, puuid: string, championId?: string) => 
    [...championKeys.all, 'masteries', region, puuid, championId] as const,
} as const;

// ========== Search Hooks ==========

export const searchKeys = {
  all: ['search'] as const,
  suggestions: (query: string) => 
    [...searchKeys.all, 'suggestions', query] as const,
} as const;

// ========== Convenient wrapper hooks (standardized names) ==========

/**
 * Hook for fetching champion statistics
 */
export function useChampionStats(
  region?: string,
  name?: string,
  tagline?: string,
) {
  const url =
    region && name && tagline
      ? `/api/champion-stats?region=${encodeURIComponent(region)}&name=${encodeURIComponent(name)}&tagline=${encodeURIComponent(tagline)}`
      : null;

  return useApiQuery(url, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook for fetching champion masteries
 */
export function useMasteries(
  region?: string,
  name?: string,
  tagline?: string,
) {
  const url =
    region && name && tagline
      ? `/api/masteries?region=${encodeURIComponent(region)}&name=${encodeURIComponent(name)}&tagline=${encodeURIComponent(tagline)}`
      : null;

  return useApiQuery(url, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
