'use client';
import { useState, useCallback } from 'react';
import type { ViewMode, SortOption } from '../masteryTabTypes';

export const useMasteryControls = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('points');

  const handleSort = useCallback((option: SortOption) => {
    setSortBy(option);
  }, []);

  const handleViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    viewMode,
    sortBy,
    handleSort,
    handleViewMode,
    clearSearch,
  };
};
