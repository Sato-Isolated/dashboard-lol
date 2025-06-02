import React from 'react';
import { motion } from 'motion/react';
import {
  suggestionListVariants,
  suggestionItemVariants,
} from '../utils/animations';
import type { SuggestionListProps } from '../types';

export const SuggestionList: React.FC<SuggestionListProps> = React.memo(
  ({ suggestions, highlightedIndex, onSelect, onHighlight }) => {
    return (
      <motion.ul
        initial={suggestionListVariants.initial}
        animate={suggestionListVariants.animate}
        exit={suggestionListVariants.exit}
        transition={suggestionListVariants.transition}
        className='absolute left-0 top-full mt-2 w-full bg-base-100 border border-base-300 
                   rounded-xl shadow-xl backdrop-blur-sm z-[9999] max-h-60 overflow-auto
                   scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent'
      >
        {suggestions.map((s, i) => (
          <motion.li
            key={`${s.name}-${s.tagline}-${s.region}-${i}`}
            initial={suggestionItemVariants.initial}
            animate={suggestionItemVariants.animate}
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
    );
  },
);

SuggestionList.displayName = 'SuggestionList';
