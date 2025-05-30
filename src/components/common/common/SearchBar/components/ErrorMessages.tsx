import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { errorMessageVariants } from '../utils/animations';
import type { ErrorMessagesProps } from '../types';

export const ErrorMessages: React.FC<ErrorMessagesProps> = ({
  hasError,
  suggestionError,
}) => {
  return (
    <>
      {/* Form validation error */}
      <AnimatePresence>
        {hasError && (
          <motion.p
            initial={errorMessageVariants.initial}
            animate={errorMessageVariants.animate}
            exit={errorMessageVariants.exit}
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

      {/* Suggestion error */}
      <AnimatePresence>
        {suggestionError && (
          <motion.p
            initial={errorMessageVariants.initial}
            animate={errorMessageVariants.animate}
            exit={errorMessageVariants.exit}
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
    </>
  );
};
