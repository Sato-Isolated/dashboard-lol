import React from 'react';
import { motion } from 'motion/react';
import { Star, Share2, RefreshCw } from 'lucide-react';

interface ActionButtonsProps {
  isFav: boolean;
  updateUserDataLoading: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  onUpdateAndRank: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isFav,
  updateUserDataLoading,
  onToggleFavorite,
  onShare,
  onUpdateAndRank,
}) => {
  return (
    <motion.div
      className='flex flex-wrap gap-3 justify-start'
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      <motion.button
        className={`btn btn-sm group relative overflow-hidden ${
          isFav ? 'btn-warning text-warning-content' : 'btn-outline btn-warning'
        }`}
        onClick={onToggleFavorite}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{ rotate: isFav ? 0 : 360 }}
          transition={{ duration: 0.6 }}
        >
          <Star size={16} className={isFav ? 'fill-current' : ''} />
        </motion.div>
        <span className='relative z-10'>
          {isFav ? 'Remove favorite' : 'Add favorite'}
        </span>
      </motion.button>

      <motion.button
        className='btn btn-sm btn-outline btn-info group relative overflow-hidden'
        onClick={onShare}
        whileTap={{ scale: 0.98 }}
      >
        <Share2 size={16} />
        <span className='relative z-10'>Share profile</span>
      </motion.button>

      <motion.button
        className='btn btn-primary btn-sm group relative overflow-hidden'
        onClick={onUpdateAndRank}
        disabled={updateUserDataLoading}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{ rotate: updateUserDataLoading ? 360 : 0 }}
          transition={{
            repeat: updateUserDataLoading ? Infinity : 0,
            duration: 1,
            ease: 'linear',
          }}
        >
          <RefreshCw size={16} />
        </motion.div>
        <span className='relative z-10'>
          {updateUserDataLoading ? 'Updating...' : 'Update'}
        </span>
      </motion.button>
    </motion.div>
  );
};
