import type { SearchFormData } from '../types';

export const validateSearchForm = (data: SearchFormData): boolean => {
  return data.summonerName.trim() !== '' && data.tagline.trim() !== '';
};

export const sanitizeInput = (value: string): string => {
  return value.trimStart();
};
