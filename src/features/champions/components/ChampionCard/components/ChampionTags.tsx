import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../constants';

interface ChampionTagsProps {
  tags: string[];
  variant: 'compact' | 'default' | 'detailed';
}

export const ChampionTags: React.FC<ChampionTagsProps> = ({
  tags,
  variant,
}) => {
  if (variant === 'compact') {
    return null; // No tags in compact variant
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        className='flex flex-wrap gap-2 justify-center'
        variants={fadeInUp}
      >
        {tags.map(tag => (
          <span key={tag} className='badge badge-outline badge-sm'>
            {tag}
          </span>
        ))}
      </motion.div>
    );
  }

  // Default variant - show only first 2 tags
  return (
    <div className='flex flex-wrap gap-1 mb-3'>
      {tags.slice(0, 2).map(tag => (
        <span key={tag} className='badge badge-outline badge-xs'>
          {tag}
        </span>
      ))}
    </div>
  );
};

export default React.memo(ChampionTags);
