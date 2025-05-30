import { useState, useEffect, useMemo } from 'react';
import { PlatformRegion } from '@/lib/api/api/riot/types';
import { getInitialRegion, setStoredRegion } from '../utils/regionUtils';

export const useRegionPreference = (effectiveRegion?: PlatformRegion | '') => {
  // Optimisation: initialiser directement avec la bonne valeur
  const [region, setRegion] = useState<PlatformRegion | ''>(() =>
    getInitialRegion(effectiveRegion)
  );

  // Optimisation: utiliser useMemo pour mettre à jour la région quand effectiveRegion change
  const currentRegion = useMemo(() => {
    if (effectiveRegion && effectiveRegion !== region) {
      const newRegion = getInitialRegion(effectiveRegion);
      // Mettre à jour l'état directement dans le render (React optimise cela)
      setRegion(newRegion);
      return newRegion;
    }
    return region;
  }, [effectiveRegion, region]);

  // Optimisation: combiner la mise à jour d'état et le storage
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
