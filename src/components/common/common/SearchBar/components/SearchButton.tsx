import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { buttonVariants, iconRotationVariants } from '../utils/animations';

interface SearchButtonProps {
  onSubmit: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onSubmit }) => {
  return (
    <motion.button
      initial={buttonVariants.initial}
      animate={buttonVariants.animate}
      whileTap={buttonVariants.whileTap}
      type='submit'
      onClick={onSubmit}
      className='btn btn-circle btn-primary btn-md sm:btn-lg shadow-lg 
             shadow-primary/40 transition-all duration-300 group/btn flex-shrink-0'
    >
      <motion.div
        animate={iconRotationVariants.animate}
        transition={iconRotationVariants.transition}
      >
        <Search
          size={20}
          strokeWidth={2.5}
          className='sm:w-6 sm:h-6 scale-110 transition-transform duration-200'
        />
      </motion.div>
    </motion.button>
  );
};
