import React from 'react';
import { motion } from 'motion/react';
import { sanitizeInput } from '../utils/validationUtils';
import { inputVariants } from '../utils/animations';

interface TaglineInputProps {
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
  placeholder: string;
  id: string;
}

export const TaglineInput: React.FC<TaglineInputProps> = ({
  value,
  onChange,
  hasError,
  placeholder,
  id,
}) => {
  return (
    <div className='flex-shrink-0 min-w-0 sm:min-w-[100px]'>
      <label htmlFor={id} className='sr-only'>
        {placeholder}
      </label>
      <motion.input
        initial={inputVariants.initial}
        animate={inputVariants.animate}
        transition={{ delay: 0.4 }}
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
      />
    </div>
  );
};
