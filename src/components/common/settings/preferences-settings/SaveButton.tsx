'use client';

import { motion } from 'motion/react';
import { Save } from 'lucide-react';
import type { SaveButtonProps } from './types';

/**
 * SaveButton Component
 *
 * Handles preference saving with loading state and visual feedback.
 * Provides tactile feedback with scale animation on press.
 */
export default function SaveButton({ onSave, isLoading }: SaveButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className='flex justify-end'
    >
      <motion.button
        onClick={onSave}
        disabled={isLoading}
        whileTap={{ scale: 0.98 }}
        className='btn btn-primary gap-2'
      >
        {isLoading ? (
          <span className='loading loading-spinner loading-sm'></span>
        ) : (
          <Save className='w-4 h-4' />
        )}
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </motion.button>
    </motion.div>
  );
}
