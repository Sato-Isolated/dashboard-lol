'use client';
import { useState, useCallback } from 'react';

export const useToastMessages = () => {
  const [shareMsg, setShareMsg] = useState('');
  const [rankMsg, setRankMsg] = useState<string>('');

  const handleShare = useCallback(
    (
      effectiveRegion: string,
      effectiveName: string,
      effectiveTagline: string,
    ) => {
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        const url = `${
          window.location.origin
        }/${effectiveRegion}/summoner/${encodeURIComponent(
          effectiveName,
        )}/${encodeURIComponent(effectiveTagline)}`;
        if (
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === 'function'
        ) {
          navigator.clipboard.writeText(url);
          setShareMsg('Link copied!');
          setTimeout(() => setShareMsg(''), 1500);
        } else {
          setShareMsg('Clipboard not available');
          setTimeout(() => setShareMsg(''), 1500);
        }
      }
    },
    [],
  );

  const showRankMessage = useCallback((message: string) => {
    setRankMsg(message);
    setTimeout(() => setRankMsg(''), 2500);
  }, []);

  return {
    shareMsg,
    rankMsg,
    handleShare,
    showRankMessage,
  };
};
