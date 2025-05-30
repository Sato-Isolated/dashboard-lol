import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Suggestion } from '../types';

export const useKeyboardNavigation = (
  suggestions: Suggestion[],
  onSuggestionSelect: (suggestion: Suggestion) => void
) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Optimization: Reset highlighted index directly without useEffect
  const actualHighlightedIndex = useMemo(() => {
    // Reset automatically when suggestions or showSuggestions change
    return suggestions.length > 0 && showSuggestions ? highlightedIndex : -1;
  }, [suggestions.length, showSuggestions, highlightedIndex]);

  // Optimization: handle events with a single useEffect
  useEffect(() => {
    if (!showSuggestions) return;

    function handleClick(e: MouseEvent) {
      if (!inputRef.current?.parentElement?.contains(e.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSuggestions]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter' && actualHighlightedIndex >= 0) {
        e.preventDefault();
        const suggestion = suggestions[actualHighlightedIndex];
        onSuggestionSelect(suggestion);
        setShowSuggestions(false);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    },
    [showSuggestions, suggestions, actualHighlightedIndex, onSuggestionSelect]
  );

  return {
    showSuggestions,
    setShowSuggestions,
    highlightedIndex: actualHighlightedIndex,
    setHighlightedIndex,
    inputRef,
    handleKeyDown,
  };
};
