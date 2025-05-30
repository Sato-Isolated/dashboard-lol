'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Favorite } from '../types/Favorites';

const FAVORITES_KEY = 'lol-favorites';

function getFavorites(): Favorite[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(favs: Favorite[]) {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export const useFavorites = (
  effectiveRegion: string,
  effectiveTagline: string,
  effectiveName: string
) => {
  // Optimization: initialize directly with the correct values
  const [favorites, setFavorites] = useState<Favorite[]>(() => getFavorites());

  // Calculate isFav with useMemo to avoid recalculations
  const isFav = useMemo(
    () =>
      favorites.some(
        f =>
          f.region === effectiveRegion &&
          f.tagline === effectiveTagline &&
          f.name === effectiveName
      ),
    [favorites, effectiveRegion, effectiveTagline, effectiveName]
  );

  const handleToggleFavorite = useCallback(() => {
    const favs = getFavorites();
    const idx = favs.findIndex(
      f =>
        f.region === effectiveRegion &&
        f.tagline === effectiveTagline &&
        f.name === effectiveName
    );
    if (idx !== -1) {
      favs.splice(idx, 1);
    } else {
      favs.push({
        region: effectiveRegion,
        tagline: effectiveTagline,
        name: effectiveName,
      });
    }
    saveFavorites(favs);
    setFavorites(favs);
  }, [effectiveRegion, effectiveTagline, effectiveName]);

  return {
    favorites,
    isFav,
    handleToggleFavorite,
  };
};
