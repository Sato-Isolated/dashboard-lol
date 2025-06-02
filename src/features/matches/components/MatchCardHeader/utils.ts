import { VICTORY_TEXT, DEFEAT_TEXT } from './constants';

export const getDisplayResult = (isWin: boolean): string => {
  return isWin ? VICTORY_TEXT : DEFEAT_TEXT;
};

export const getResultClass = (isWin: boolean): string => {
  return isWin ? 'text-success' : 'text-error';
};

export const isWinResult = (result: string): boolean => {
  return result.toLowerCase() === 'win';
};
