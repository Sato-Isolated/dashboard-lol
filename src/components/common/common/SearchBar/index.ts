export { default } from './SearchBar';
export { default as SearchBar } from './SearchBar';

// Export des composants individuels si nécessaire
export { SearchInput } from './components/SearchInput';
export { TaglineInput } from './components/TaglineInput';
export { RegionSelect } from './components/RegionSelect';
export { SearchButton } from './components/SearchButton';
export { SuggestionList } from './components/SuggestionList';
export { ErrorMessages } from './components/ErrorMessages';
export { Separator } from './components/Separator';

// Export des hooks
export { useSearchForm } from './hooks/useSearchForm';
export { useRegionPreference } from './hooks/useRegionPreference';
export { useSearchSuggestions } from './hooks/useSearchSuggestions';
export { useKeyboardNavigation } from './hooks/useKeyboardNavigation';

// Export des types
export type * from './types';
