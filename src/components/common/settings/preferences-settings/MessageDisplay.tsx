'use client';

import { motion } from 'motion/react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { MessageDisplayProps } from './types';

/**
 * MessageDisplay Component
 *
 * Displays success or error messages with appropriate styling and icons.
 * Uses motion animations for smooth appearance/disappearance.
 */
export default function MessageDisplay({ message }: MessageDisplayProps) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`alert ${
        message.type === 'success' ? 'alert-success' : 'alert-error'
      }`}
    >
      {message.type === 'success' ? (
        <CheckCircle className='w-4 h-4' />
      ) : (
        <AlertCircle className='w-4 h-4' />
      )}
      <span className='text-sm'>{message.text}</span>
    </motion.div>
  );
}
