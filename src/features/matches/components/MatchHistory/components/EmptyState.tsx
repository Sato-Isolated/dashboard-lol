'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, GamepadIcon } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-user' | 'no-matches';
}

const EmptyStateComponent: React.FC<EmptyStateProps> = ({ type }) => {
  if (type === 'no-user') {
    return (
      <motion.div
        key='no-user'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className='flex flex-col items-center justify-center py-12 space-y-4'
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <AlertCircle className='w-16 h-16 text-warning' />
        </motion.div>
        <p className='text-lg font-semibold text-warning'>No Player Selected</p>
        <p className='text-base-content/70 text-center'>
          Veuillez renseigner un nom de joueur et un tagline pour afficher
          l'historique.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col items-center justify-center py-12 space-y-4'
    >
      <GamepadIcon className='w-16 h-16 text-base-content/30' />
      <span className='text-base-content/50 text-lg'>No matches found</span>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const EmptyState = React.memo(EmptyStateComponent);
EmptyState.displayName = 'EmptyState';

export default EmptyState;
