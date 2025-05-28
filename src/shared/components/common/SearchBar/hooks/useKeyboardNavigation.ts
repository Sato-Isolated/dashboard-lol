import { useState, useEffect, useCallback, useRef } from 'react';
import type { Suggestion } from '../types';

export const useKeyboardNavigation = (
  suggestions: Suggestion[],
  onSuggestionSelect: (suggestion: Suggestion) => void
) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Reset highlighted index when suggestions or list visibility changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions, showSuggestions]);

  // Close suggestions if click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!inputRef.current?.parentElement?.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showSuggestions]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        const suggestion = suggestions[highlightedIndex];
        onSuggestionSelect(suggestion);
        setShowSuggestions(false);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    },
    [showSuggestions, suggestions, highlightedIndex, onSuggestionSelect]
  );

  return {
    showSuggestions,
    setShowSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    inputRef,
    handleKeyDown,
  };
};
