import { useMemo } from 'react';
import { getRegion } from '@/lib/utils/helpers';

export const usePlayerProfile = (name: string, tagline?: string) => {
  const region = useMemo(() => getRegion(), []);

  const profileUrl = useMemo(
    () =>
      `/${region}/summoner/${encodeURIComponent(
        name,
      )}/${encodeURIComponent(tagline || 'EUW')}`,
    [region, name, tagline],
  );

  return { region, profileUrl };
};
