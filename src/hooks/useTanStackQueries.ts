'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { RiotAccountDto } from '@/types/api/accountTypes';
import type { SummonerDto, LeagueEntry } from '@/types/api/summonerTypes';
import type { UIRecentlyPlayed } from '@/types/sidebarTypes';

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
 * Hook for fetching ARAM score specifically
 */
export function useAramScoreQuery(region?: string, name?: string, tagline?: string) {
  return useQuery({
    queryKey: region && name && tagline 
      ? summonerKeys.aramScore(region, name, tagline) 
      : ['aramScore', 'disabled'],
    queryFn: () => fetcher(
      `/api/summoner/aram-score?region=${encodeURIComponent(region!)}&name=${encodeURIComponent(name!)}&tagline=${encodeURIComponent(tagline!)}`
    ),
    enabled: !!(region && name && tagline),
    staleTime: 10 * 60 * 1000, // 10 minutes - ARAM score changes less frequently
    gcTime: 60 * 60 * 1000, // 1 hour cache
    retry: 1,
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
 * Hook for fetching champion masteries
 */
export function useMasteriesQuery(region?: string, name?: string, tagline?: string) {
  return useQuery({
    queryKey: region && name && tagline 
      ? summonerKeys.masteries(region, name, tagline) 
      : ['masteries', 'disabled'],
    queryFn: () => fetcher(
      `/api/summoner/masteries?region=${encodeURIComponent(region!)}&name=${encodeURIComponent(name!)}&tagline=${encodeURIComponent(tagline!)}`
    ),
    enabled: !!(region && name && tagline),
    staleTime: 30 * 60 * 1000, // 30 minutes - masteries don't change often
    gcTime: 2 * 60 * 60 * 1000, // 2 hours cache
    retry: 1,
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

/**
 * Hook for fetching a single page of match history
 */
export function useMatchHistoryQuery(
  region?: string, 
  name?: string, 
  tagline?: string,
  start: number = 0,
  count: number = 20
) {
  return useQuery({
    queryKey: region && name && tagline 
      ? [...matchKeys.summoner(region, name, tagline), start, count] 
      : ['matches', 'disabled'],
    queryFn: () => fetcher(
      `/api/summoner/matches?region=${encodeURIComponent(region!)}&name=${encodeURIComponent(name!)}&tagline=${encodeURIComponent(tagline!)}&start=${start}&count=${count}`
    ),
    enabled: !!(region && name && tagline),
    staleTime: 5 * 60 * 1000, // 5 minutes 
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 2,
  });
}

// ========== Mutation Hooks ==========

/**
 * Hook for updating summoner data (fetching fresh data from Riot API)
 */
export function useUpdateSummonerMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ region, name, tagline }: { region: string; name: string; tagline: string }) => {
      // Update recently played (this triggers a fresh fetch from Riot)
      const response = await fetch('/api/summoner/recently-played', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region, name, tagline }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || 'Failed to update summoner data');
      }
      
      return response.json();
    },
    onSuccess: (data, { region, name, tagline }) => {
      // Invalidate related queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: summonerKeys.summoner(region, name, tagline) });
      queryClient.invalidateQueries({ queryKey: summonerKeys.aramScore(region, name, tagline) });
      queryClient.invalidateQueries({ queryKey: summonerKeys.recentlyPlayed(region, name, tagline, 5) });
      queryClient.invalidateQueries({ queryKey: matchKeys.summoner(region, name, tagline) });
    },
    retry: 1,
  });
}

/**
 * Hook for syncing ARAM score
 */
export function useSyncAramScoreMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ region, name, tagline }: { region: string; name: string; tagline: string }) => {
      const response = await fetch('/api/summoner/aram-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region, name, tagline }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || 'Failed to sync ARAM score');
      }
      
      return response.json();
    },
    onSuccess: (data, { region, name, tagline }) => {
      // Update the ARAM score in cache
      queryClient.invalidateQueries({ queryKey: summonerKeys.aramScore(region, name, tagline) });
      queryClient.invalidateQueries({ queryKey: summonerKeys.summoner(region, name, tagline) });
    },
    retry: 1,
  });
}

/**
 * Hook for updating masteries
 */
export function useUpdateMasteriesMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ region, name, tagline }: { region: string; name: string; tagline: string }) => {
      const response = await fetch('/api/summoner/masteries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region, name, tagline }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || 'Failed to update masteries');
      }
      
      return response.json();
    },
    onSuccess: (data, { region, name, tagline }) => {
      queryClient.invalidateQueries({ queryKey: summonerKeys.masteries(region, name, tagline) });
    },
    retry: 1,
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

/**
 * Generic hook for infinite queries - replaces useInfiniteApiCall
 * @param getUrl - Function that returns URL for each page
 * @param options - Additional infinite query options
 */
export function useApiInfiniteQuery<T = unknown>(
  getUrl: (pageParam: number, previousPageData?: any) => string | null,
  options?: Partial<Parameters<typeof useInfiniteQuery>[0]>
) {
  return useInfiniteQuery({
    queryKey: ['infinite', getUrl(0)],
    queryFn: ({ pageParam = 0 }) => {
      const url = getUrl(pageParam as number);
      return url ? fetcher(url) : Promise.reject(new Error('No URL generated'));
    },
    getNextPageParam: (lastPage: any, pages) => {
      // Default pagination logic - can be overridden
      return lastPage?.data && lastPage.data.length > 0 ? pages.length : undefined;
    },
    enabled: !!getUrl(0),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    initialPageParam: 0,
    ...options,
  });
}

/**
 * Generic hook for operations (custom async functions) - replaces useAsyncData with operation
 * @param operation - The async operation to perform
 * @param queryKey - Unique key for the query
 * @param options - Additional query options
 */
export function useAsyncOperation<T = unknown>(
  operation?: () => Promise<T>,
  queryKey?: (string | number | boolean | null | undefined)[],
  options?: Partial<Parameters<typeof useQuery>[0]>
) {
  return useQuery({
    queryKey: queryKey || ['operation', operation?.toString()],
    queryFn: operation!,
    enabled: !!operation,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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

/**
 * Hook for fetching champion statistics
 */
export function useChampionStatsQuery(
  region?: string,
  championId?: string,
  options?: Partial<Parameters<typeof useQuery>[0]>
) {
  return useQuery({
    queryKey: region && championId 
      ? championKeys.stats(region, championId) 
      : ['champion-stats', 'disabled'],
    queryFn: () => fetcher(
      `/api/champions/stats?region=${encodeURIComponent(region!)}&championId=${encodeURIComponent(championId!)}`
    ),
    enabled: !!(region && championId),
    staleTime: 30 * 60 * 1000, // 30 minutes - champion stats don't change often
    gcTime: 2 * 60 * 60 * 1000, // 2 hours cache
    retry: 1,
    ...options,
  });
}

// ========== Search Hooks ==========

export const searchKeys = {
  all: ['search'] as const,
  suggestions: (query: string) => 
    [...searchKeys.all, 'suggestions', query] as const,
} as const;

/**
 * Hook for search suggestions
 */
export function useSearchSuggestionsQuery(
  query?: string,
  options?: Partial<Parameters<typeof useQuery>[0]>
) {
  return useQuery({
    queryKey: query 
      ? searchKeys.suggestions(query) 
      : ['search-suggestions', 'disabled'],
    queryFn: () => fetcher(`/api/search/suggestions?q=${encodeURIComponent(query!)}`),
    enabled: !!(query && query.length >= 2),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    retry: 1,
    ...options,
  });
}

// ========== Convenient wrapper hooks (standardized names) ==========

/**
 * Hook for fetching summoner data
 */
export function useSummoner(
  region?: string,
  name?: string,
  tagline?: string,
) {
  return useSummonerQuery(region, name, tagline);
}

/**
 * Hook for fetching match history
 */
export function useMatchHistory(
  region?: string,
  puuid?: string,
  count = 20,
) {
  const url =
    region && puuid
      ? `/api/matches?region=${encodeURIComponent(region)}&puuid=${encodeURIComponent(puuid)}&count=${count}`
      : null;

  return useApiQuery(url, {
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

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
