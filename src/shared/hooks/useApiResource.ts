// src/hooks/useApiResource.ts
import useSWR from 'swr';

export function useApiResource<T = unknown>(
  url: string | null,
  cacheKey: string
) {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok)
      throw new Error(json?.error || 'Erreur lors du chargement des données');
    return json;
  };

  const { data, error, isLoading, mutate } = useSWR<T>(
    url ? [url, cacheKey] : null,
    ([url]) => fetcher(url)
  );

  return {
    data: data ?? null,
    loading: isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : String(error)
      : null,
    refetch: () => mutate(),
  };
}
