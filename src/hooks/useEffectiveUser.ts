'use client';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { useEffect } from 'react';

export function useEffectiveUser(): {
  effectiveRegion: string;
  effectiveTagline: string;
  effectiveName: string;
} {
  const params = useParams();
  const { region, tagline, summonerName, setUser } = useUserStore();
  const effectiveRegion = (params?.region as string) || region;
  const effectiveTagline = params?.tagline
    ? decodeURIComponent(params.tagline as string)
    : tagline;
  const effectiveName = params?.name
    ? decodeURIComponent(params.name as string)
    : summonerName;

  // Sync store if params are present and different from store
  useEffect(() => {
    if (
      params?.region &&
      params?.tagline &&
      params?.name &&
      (params.region !== region ||
        params.tagline !== tagline ||
        params.name !== summonerName)
    ) {
      setUser({
        region: params.region as string,
        tagline: decodeURIComponent(params.tagline as string),
        summonerName: decodeURIComponent(params.name as string),
      });
    }
  }, [params, setUser, region, tagline, summonerName]);

  return { effectiveRegion, effectiveTagline, effectiveName };
}

