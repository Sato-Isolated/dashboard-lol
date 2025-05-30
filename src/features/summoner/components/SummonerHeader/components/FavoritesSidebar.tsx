import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Users, Heart } from 'lucide-react';
import { Favorite } from '../types/Favorites';
import { FavoriteButton } from './FavoriteButton';

interface FavoritesSidebarProps {
  favorites: Favorite[];
  effectiveRegion: string;
  effectiveTagline: string;
  effectiveName: string;
  onSelectFavorite: (fav: Favorite) => void;
}

export const FavoritesSidebar: React.FC<FavoritesSidebarProps> = ({
  favorites,
  effectiveRegion,
  effectiveTagline,
  effectiveName,
  onSelectFavorite,
}) => {
  const favoritesList = useMemo(() => {
    if (favorites.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex items-center justify-center py-6 text-base-content/50'
        >
          <div className='flex flex-col items-center gap-2'>
            <Heart size={20} className='text-base-content/30' />
            <span className='text-sm'>No favorites yet</span>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className='space-y-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {favorites.map((fav, i) => {
          const isActive =
            fav.region === effectiveRegion &&
            fav.tagline === effectiveTagline &&
            fav.name === effectiveName;

          return (
            <motion.div
              key={`${fav.region}-${fav.tagline}-${fav.name}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <FavoriteButton
                favorite={fav}
                isActive={isActive}
                onSelect={onSelectFavorite}
              />
            </motion.div>
          );
        })}
      </motion.div>
    );
  }, [
    favorites,
    effectiveRegion,
    effectiveTagline,
    effectiveName,
    onSelectFavorite,
  ]);

  return (
    <motion.div
      className='lg:w-80 xl:w-96'
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <div className='bg-base-200/30 rounded-xl p-4 border border-base-300/30'>
        <div className='flex items-center gap-2 justify-center mb-4'>
          <Users size={16} className='text-primary' />
          <h3 className='font-semibold text-base-content'>Favorites</h3>
          <span className='badge badge-primary badge-sm'>
            {favorites.length}
          </span>
        </div>

        <div className='max-h-40 overflow-y-auto custom-scrollbar'>
          {favoritesList}
        </div>
      </div>
    </motion.div>
  );
};
