import { useState, useEffect } from 'react';
import { PlatformRegion } from '@/lib/api/api/riot/types';
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

