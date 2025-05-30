import { useMemo } from 'react';
import type { KDAPartsHook } from '../matchCardStatsTypes';

export const useKDAParts = (kdaParts: string[]): KDAPartsHook => {
  return useMemo(
    () => ({
      kills: kdaParts[0],
      deaths: kdaParts[1],
      assists: kdaParts[2],
    }),
    [kdaParts],
  );
};
