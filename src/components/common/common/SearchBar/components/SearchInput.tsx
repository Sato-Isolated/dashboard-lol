import React from 'react';
import { motion } from 'motion/react';
import { sanitizeInput } from '../utils/validationUtils';
import { inputVariants } from '../utils/animations';
import type { SearchInputProps } from '../types';

interface SearchInputPropsExtended extends Omit<SearchInputProps, 'onKeyDown'> {
  onKeyDown?: (e: React.KeyboardEvent) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchInput: React.FC<SearchInputPropsExtended> = ({
  value,
  onChange,
  onFocus,
  onKeyDown,
  hasError,
  placeholder,
  id,
  inputRef,
}) => {
  return (
    <div className='flex-1 min-w-0'>
      <label htmlFor={id} className='sr-only'>
        {placeholder}
      </label>
      <motion.input
        initial={inputVariants.initial}
        animate={inputVariants.animate}
        transition={{ delay: 0.2 }}
        id={id}
        type='text'
        value={value}
        onChange={e => onChange(sanitizeInput(e.target.value))}
        placeholder={placeholder}
        aria-invalid={hasError && value.trim() === ''}
        className={`w-full bg-transparent border-0 outline-none text-base sm:text-lg font-semibold 
                   placeholder:text-base-content/50 transition-colors duration-300
                   ${
                     hasError && value.trim() === ''
                       ? 'text-error placeholder:text-error/50'
                       : 'text-base-content'
                   }`}
        autoComplete='off'
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
    </div>
  );
};
