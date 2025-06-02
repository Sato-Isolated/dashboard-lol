'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchInput } from './components/SearchInput';
import { TaglineInput } from './components/TaglineInput';
import { RegionSelect } from './components/RegionSelect';
import { SearchButton } from './components/SearchButton';
import { SuggestionList } from './components/SuggestionList';
import { ErrorMessages } from './components/ErrorMessages';
import { Separator } from './components/Separator';
import { useSearchForm } from './hooks/useSearchForm';
import { useRegionPreference } from './hooks/useRegionPreference';
import { useSearchSuggestions } from './hooks/useSearchSuggestions';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { formVariants, inputContainerVariants } from './utils/animations';

const SearchBar: React.FC = () => {
  const {
    summonerName,
    setSummonerName,
    tagline,
    setTagline,
    hasError,
    handleSubmit,
    handleSuggestionSelect,
  } = useSearchForm();

  const { region, setRegion } = useRegionPreference();
  const { suggestions, suggestionError } = useSearchSuggestions(summonerName);

  const {
    showSuggestions,
    setShowSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    inputRef,
    handleKeyDown,
  } = useKeyboardNavigation(suggestions || [], suggestion => {
    handleSuggestionSelect(suggestion, setRegion);
    setShowSuggestions(false);
  });

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(region, e);
  };

  return (
    <div className='w-full'>
      <motion.form
        initial={formVariants.initial}
        animate={formVariants.animate}
        onSubmit={onSubmit}
        className='flex flex-col items-center gap-2 sm:gap-3 w-full max-w-2xl mx-auto px-2'
        autoComplete='off'
      >
        <motion.div
          whileFocus={inputContainerVariants.whileFocus}
          className={`relative w-full bg-gradient-to-r from-base-100/95 via-base-100 to-base-100/95 
                   backdrop-blur-md border-2 rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-3 sm:py-4 shadow-2xl
                   transition-all duration-300 group
                   ${
                     hasError
                       ? 'border-error/60 shadow-error/20'
                       : 'border-primary/50 shadow-primary/10'
                   }`}
        >
          {/* Main input container */}
          <div className='relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full'>
            {/* Summoner Name Input */}
            <SearchInput
              value={summonerName}
              onChange={value => {
                setSummonerName(value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              hasError={hasError}
              placeholder='Summoner Name'
              id='summonerName'
              inputRef={inputRef}
            />
            {/* Separator */}
            <Separator delay={0.3} />
            {/* Tagline Input */}
            <TaglineInput
              value={tagline}
              onChange={setTagline}
              hasError={hasError}
              placeholder='Tagline'
              id='tagline'
            />
            {/* Separator */}
            <Separator delay={0.5} />
            {/* Region Select */}
            <RegionSelect value={region} onChange={setRegion} />
            {/* Search Button */}
            <SearchButton onSubmit={() => {}} />
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence mode='wait'>
            {showSuggestions && suggestions && suggestions.length > 0 && (
              <SuggestionList
                suggestions={suggestions}
                highlightedIndex={highlightedIndex}
                onSelect={suggestion => {
                  handleSuggestionSelect(suggestion, setRegion);
                  setShowSuggestions(false);
                }}
                onHighlight={setHighlightedIndex}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error Messages */}
        <ErrorMessages hasError={hasError} suggestionError={suggestionError} />
      </motion.form>
    </div>
  );
};

export default SearchBar;
