import { PlatformRegion } from '@/shared/types/api/platformregion.types';
import { mapLangToRegion } from '@/shared/lib/utils/langToRegion';

export const getStoredRegion = (): PlatformRegion | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('preferredRegion');
  return stored as PlatformRegion | null;
};

export const setStoredRegion = (region: PlatformRegion): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('preferredRegion', region);
};

export const getBrowserDefaultRegion = (): PlatformRegion => {
  const browserLang = navigator.language || navigator.languages?.[0] || '';
  return mapLangToRegion(browserLang) as PlatformRegion;
};

export const getInitialRegion = (
  currentRegion?: PlatformRegion | ''
): PlatformRegion => {
  // Si on a déjà une région, la garder
  if (currentRegion) return currentRegion;

  // Essayer de récupérer depuis le stockage local
  const stored = getStoredRegion();
  if (stored) return stored;

  // Sinon, utiliser la région par défaut du navigateur
  const defaultRegion = getBrowserDefaultRegion();
  setStoredRegion(defaultRegion);
  return defaultRegion;
};
