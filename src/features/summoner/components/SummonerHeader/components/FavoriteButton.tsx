import React, { useCallback } from 'react';
import { motion } from 'motion/react';
import { Crown } from 'lucide-react';
import { FavoriteButtonProps } from '../types/Favorites';

const FavoriteButtonComponent: React.FC<FavoriteButtonProps> = ({
  favorite,
  isActive,
  onSelect,
}) => {
  const handleClick = useCallback(() => {
    onSelect(favorite);
  }, [favorite, onSelect]);

  return (
    <motion.button
      className={`relative group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30'
          : 'bg-base-200/50 text-base-content/70 border border-transparent'
      }`}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          className='absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-full'
          layoutId='activeFavorite'
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
      )}

      <div className='flex items-center gap-2 flex-1 min-w-0'>
        {isActive && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className='text-primary'
          >
            <Crown size={14} />
          </motion.div>
        )}
        <span className='truncate'>
          {favorite.name}
          <span className='text-base-content/40 ml-1'>#{favorite.tagline}</span>
        </span>
      </div>

      <span
        className={`text-xs px-2 py-1 rounded-full font-bold ${
          isActive
            ? 'bg-primary/20 text-primary'
            : 'bg-base-300/50 text-base-content/50'
        }`}
      >
        {favorite.region.toUpperCase()}
      </span>
    </motion.button>
  );
};

export const FavoriteButton = React.memo(FavoriteButtonComponent);
FavoriteButton.displayName = 'FavoriteButton';
