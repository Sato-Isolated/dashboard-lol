import { useMemo } from 'react';
import { getDisplayResult, getResultClass, isWinResult } from '../utils';
import type { MatchResultHook } from '../matchCardHeaderTypes';

export const useMatchResult = (result: string): MatchResultHook => {
  const isWin = useMemo(() => isWinResult(result), [result]);
  const displayResult = useMemo(() => getDisplayResult(isWin), [isWin]);
  const resultClass = useMemo(() => getResultClass(isWin), [isWin]);

  return {
    isWin,
    displayResult,
    resultClass,
  };
};
