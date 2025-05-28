import { useState, useEffect } from 'react';
import { PlatformRegion } from '@/shared/types/api/platformregion.types';
import { getInitialRegion, setStoredRegion } from '../utils/regionUtils';

export const useRegionPreference = (effectiveRegion?: PlatformRegion | '') => {
  const [region, setRegion] = useState<PlatformRegion | ''>('');

  // Initialize region
  useEffect(() => {
    const initialRegion = getInitialRegion(effectiveRegion);
    setRegion(initialRegion);
  }, [effectiveRegion]);

  // Save region preference when it changes
  useEffect(() => {
    if (region) {
      setStoredRegion(region);
    }
  }, [region]);

  return { region, setRegion };
};
