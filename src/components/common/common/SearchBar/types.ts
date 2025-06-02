import { PlatformRegion } from '@/lib/api/api/riot/types';

export interface Suggestion {
  name: string;
  tagline: string;
  region: string;
}

export interface SearchFormData {
  summonerName: string;
  tagline: string;
  region: PlatformRegion | '';
}

export interface SuggestionListProps {
  suggestions: Suggestion[];
  highlightedIndex: number;
  onSelect: (s: Suggestion) => void;
  onHighlight: (i: number) => void;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  hasError: boolean;
  placeholder: string;
  id: string;
}

export interface RegionSelectProps {
  value: PlatformRegion | '';
  onChange: (region: PlatformRegion) => void;
}

export interface ErrorMessagesProps {
  hasError: boolean;
  suggestionError: string | null;
}
