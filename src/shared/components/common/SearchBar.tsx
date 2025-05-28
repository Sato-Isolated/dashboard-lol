'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/shared/store/userStore';
import { PlatformRegion } from '@/shared/types/api/platformregion.types';
import { useEffectiveUser } from '@/shared/hooks/useEffectiveUser';
import { mapLangToRegion } from '@/shared/lib/utils/langToRegion';

// Explicit typing for SearchBar props
const SearchBar: React.FC = () => {
  // Use local state for the form, sync with store only on submit
  const { effectiveRegion, effectiveTagline, effectiveName } =
    useEffectiveUser();
  const { setUser } = useUserStore();
  const router = useRouter();
  const [hasError, setHasError] = useState<boolean>(false);
  const [region, setRegion] = useState<PlatformRegion | ''>(
    (effectiveRegion as PlatformRegion) || '',
  );
  const [tagline, setTagline] = useState<string>(effectiveTagline || '');
  const [summonerName, setSummonerName] = useState<string>(effectiveName || '');
  const [suggestions, setSuggestions] = useState<
    { name: string; tagline: string; region: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  // Preselect region based on browser language or localStorage if none is set
  useEffect(() => {
    const savedRegion =
      typeof window !== 'undefined'
        ? localStorage.getItem('preferredRegion')
        : null;
    if (savedRegion && !region) {
      setRegion(savedRegion as PlatformRegion);
      return;
    }
    if (!region) {
      const browserLang = navigator.language || navigator.languages?.[0] || '';
      const defaultRegion = mapLangToRegion(browserLang) as PlatformRegion;
      setRegion(defaultRegion);
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferredRegion', defaultRegion);
      }
    }
  }, [region]);

  // Remember region choice on each change
  useEffect(() => {
    if (region && typeof window !== 'undefined') {
      localStorage.setItem('preferredRegion', region);
    }
  }, [region]);

  // Sync local state with effective values (e.g., direct navigation)
  useEffect(() => {
    setRegion((effectiveRegion as PlatformRegion) || '');
    setTagline(effectiveTagline || '');
    setSummonerName(effectiveName || '');
  }, [effectiveRegion, effectiveTagline, effectiveName]);

  useEffect(() => {
    const controller = new AbortController();
    if (summonerName.length >= 2) {
      setSuggestionError(null);
      fetch(`/api/summoner/search?q=${encodeURIComponent(summonerName)}`, {
        signal: controller.signal,
      })
        .then(res => {
          if (!res.ok) {throw new Error('Error while searching for players.');}
          return res.json();
        })
        .then(data => setSuggestions(data))
        .catch(e => {
          if (e.name === 'AbortError') {return;}
          setSuggestionError(e.message || 'Error while searching for players.');
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
      setSuggestionError(null);
    }
    return () => controller.abort();
  }, [summonerName]);

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
  // Reset highlighted index when suggestions or list visibility changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions, showSuggestions]);

  // Memoize form submission handler
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const isInvalid = summonerName.trim() === '' || tagline.trim() === '';
      if (isInvalid) {
        setHasError(true);
        return;
      }
      setHasError(false);
      setUser({ region, tagline, summonerName });
      router.push(
        `/${region}/summoner/${encodeURIComponent(
          summonerName,
        )}/${encodeURIComponent(tagline)}`,
      );
    },
    [summonerName, tagline, region, setUser, router],
  );

  // Memoize suggestion selection handler
  const handleSuggestionSelect = useCallback(
    (suggestion: { name: string; tagline: string; region: string }) => {
      setSummonerName(suggestion.name);
      setTagline(suggestion.tagline);
      setRegion(suggestion.region as PlatformRegion);
      setShowSuggestions(false);
    },
    [],
  );

  // Memoize keyboard navigation handlers
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) {return;}

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev <= 0 ? suggestions.length - 1 : prev - 1,
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        const suggestion = suggestions[highlightedIndex];
        handleSuggestionSelect(suggestion);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    },
    [showSuggestions, suggestions, highlightedIndex, handleSuggestionSelect],
  );

  // Add SuggestionList subcomponent
  interface Suggestion {
    name: string;
    tagline: string;
    region: string;
  }

  interface SuggestionListProps {
    suggestions: Suggestion[];
    highlightedIndex: number;
    onSelect: (s: Suggestion) => void;
    onHighlight: (i: number) => void;
  } // Memoize SuggestionList component
  const SuggestionList: React.FC<SuggestionListProps> = React.memo(
    ({ suggestions, highlightedIndex, onSelect, onHighlight }) => (
      <motion.ul
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='absolute left-0 top-full mt-2 w-full bg-base-100 border border-base-300 
                   rounded-xl shadow-xl backdrop-blur-sm z-[9999] max-h-60 overflow-auto
                   scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent'
      >
        {suggestions.map((s, i) => (
          <motion.li
            key={`${s.name}-${s.tagline}-${s.region}-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className={`px-4 py-3 cursor-pointer flex justify-between items-center
                       transition-all duration-200                       ${
                         i === highlightedIndex
                           ? 'bg-primary/10 border-l-4 border-primary text-primary'
                           : 'bg-base-200/50'
                       }`}
            onClick={() => onSelect(s)}
            onMouseEnter={() => onHighlight(i)}
          >
            <span className='font-semibold'>{s.name}</span>
            <span
              className='text-xs text-base-content/60 font-medium bg-base-200 
                           px-2 py-1 rounded-full'
            >
              #{s.tagline} • {s.region}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    ),
  );

  SuggestionList.displayName = 'SuggestionList';

  // Memoize platform region options
  const platformRegionOptions = useMemo(
    () =>
      Object.entries(PlatformRegion).map(([key, value]) => (
        <option key={key} value={value} className='text-lg'>
          {value}
        </option>
      )),
    [],
  );
  return (
    <div className='w-full'>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        onSubmit={handleSubmit}
        className='flex flex-col items-center gap-2 sm:gap-3 w-full max-w-2xl mx-auto px-2'
        autoComplete='off'
      >
        <motion.div
          whileFocus={{ scale: 1.01 }}
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
            <div className='flex-1 min-w-0'>
              <label htmlFor='summonerName' className='sr-only'>
                Summoner Name
              </label>
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                id='summonerName'
                type='text'
                value={summonerName}
                onChange={e => {
                  setSummonerName(e.target.value.trimStart());
                  setShowSuggestions(true);
                }}
                placeholder='Summoner Name'
                aria-invalid={hasError && summonerName.trim() === ''}
                className={`w-full bg-transparent border-0 outline-none text-base sm:text-lg font-semibold 
                         placeholder:text-base-content/50 transition-colors duration-300
                         ${
                           hasError && summonerName.trim() === ''
                             ? 'text-error placeholder:text-error/50'
                             : 'text-base-content'
                         }`}
                ref={inputRef}
                autoComplete='off'
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
              />
            </div>
            {/* Separator */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 }}
              className='hidden sm:block w-px h-6 sm:h-8 bg-gradient-to-b from-transparent via-base-content/30 to-transparent'
            />
            {/* Tagline Input */}
            <div className='flex-shrink-0 min-w-0 sm:min-w-[100px]'>
              <label htmlFor='tagline' className='sr-only'>
                Tagline
              </label>
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                id='tagline'
                type='text'
                value={tagline}
                onChange={e => setTagline(e.target.value.trimStart())}
                placeholder='Tagline'
                aria-invalid={hasError && tagline.trim() === ''}
                className={`w-full bg-transparent border-0 outline-none text-base sm:text-lg font-semibold 
                         placeholder:text-base-content/50 transition-colors duration-300
                         ${
                           hasError && tagline.trim() === ''
                             ? 'text-error placeholder:text-error/50'
                             : 'text-base-content'
                         }`}
                autoComplete='off'
              />
            </div>
            {/* Separator */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.5 }}
              className='hidden sm:block w-px h-6 sm:h-8 bg-gradient-to-b from-transparent via-base-content/30 to-transparent'
            />
            {/* Region Select */}
            <div className='flex-shrink-0'>
              <label htmlFor='region' className='sr-only'>
                Region
              </label>
              <motion.select
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                name='region'
                id='region'
                className='select select-ghost bg-transparent border-0 outline-none text-sm sm:text-lg font-bold 
                       cursor-pointer text-primary transition-colors duration-300 w-16 sm:w-24'
                value={region}
                onChange={e => setRegion(e.target.value as PlatformRegion)}
              >
                {platformRegionOptions}
              </motion.select>
            </div>
            {/* Search Button */}
            <motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                delay: 0.7,
                type: 'spring',
                stiffness: 400,
                damping: 15,
              }}
              type='submit'
              className='btn btn-circle btn-primary btn-md sm:btn-lg shadow-lg 
                     shadow-primary/40 transition-all duration-300 group/btn flex-shrink-0'
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Search
                  size={20}
                  strokeWidth={2.5}
                  className='sm:w-6 sm:h-6 scale-110 transition-transform duration-200'
                />
              </motion.div>
            </motion.button>
          </div>
          {/* Suggestions Dropdown */}
          <AnimatePresence mode='wait'>
            {showSuggestions && suggestions.length > 0 && (
              <SuggestionList
                suggestions={suggestions}
                highlightedIndex={highlightedIndex}
                onSelect={handleSuggestionSelect}
                onHighlight={setHighlightedIndex}
              />
            )}
          </AnimatePresence>
        </motion.div>
        {/* Error Messages */}
        <AnimatePresence>
          {hasError && (
            <motion.p
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className='text-error text-sm font-semibold flex items-center gap-2'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Please fill in both summoner name and tagline.
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {suggestionError && (
            <motion.p
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className='text-error text-xs font-medium flex items-center gap-2'
            >
              <svg
                className='w-3 h-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              {suggestionError}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
};

export default SearchBar;
