'use client';
import { useState, useCallback } from 'react';
import { MatchCardState } from '../matchCardTypes';

/**
 * Custom hook to manage MatchCard state (open/close and tab selection)
 */
export const useMatchCardState = (initialTab = 'overview') => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(initialTab);

  const handleToggleOpen = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const handleSetTab = useCallback((newTab: string) => {
    setTab(newTab);
  }, []);

  const state: MatchCardState = { open, tab };

  return {
    state,
    actions: {
      toggleOpen: handleToggleOpen,
      setTab: handleSetTab,
    },
  };
};
