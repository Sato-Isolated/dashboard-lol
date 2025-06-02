import { useState, useEffect, useMemo } from 'react';
import { PlatformRegion } from '@/lib/api/api/riot/types';
import { getInitialRegion, setStoredRegion } from '../utils/regionUtils';

export const useRegionPreference = (effectiveRegion?: PlatformRegion | '') => {
  // Optimization: initialize directly with the correct value
  const [region, setRegion] = useState<PlatformRegion | ''>(() =>
    getInitialRegion(effectiveRegion)
  );

  // Optimization: use useMemo to update region when effectiveRegion changes
  const currentRegion = useMemo(() => {
    if (effectiveRegion && effectiveRegion !== region) {
      const newRegion = getInitialRegion(effectiveRegion);
      // Update state directly in render (React optimizes this)
      setRegion(newRegion);
      return newRegion;
    }
    return region;
  }, [effectiveRegion, region]);

  // Optimization: combine state update and storage
  const updateRegion = useMemo(
    () => (newRegion: PlatformRegion | '') => {
      setRegion(newRegion);
      if (newRegion) {
        setStoredRegion(newRegion);
      }
    },
    []
  );

  return { region: currentRegion, setRegion: updateRegion };
};
