import { PlatformRegion } from '@/lib/api/api/riot/types';
import { mapLangToRegion } from '@/lib/utils/langToRegion';

export const getStoredRegion = (): PlatformRegion | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = localStorage.getItem('preferredRegion');
  return stored as PlatformRegion | null;
};

export const setStoredRegion = (region: PlatformRegion): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('preferredRegion', region);
};

export const getBrowserDefaultRegion = (): PlatformRegion => {
  const browserLang = navigator.language || navigator.languages?.[0] || '';
  return mapLangToRegion(browserLang) as PlatformRegion;
};

export const getInitialRegion = (
  currentRegion?: PlatformRegion | '',
): PlatformRegion => {
  // If we already have a region, keep it
  if (currentRegion) {
    return currentRegion;
  }

  // Try to retrieve from local storage
  const stored = getStoredRegion();
  if (stored) {
    return stored;
  }

  // Otherwise, use the browser's default region
  const defaultRegion = getBrowserDefaultRegion();
  setStoredRegion(defaultRegion);
  return defaultRegion;
};
