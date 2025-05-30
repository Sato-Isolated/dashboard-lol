'use client';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SmoothTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  fallback?: React.ReactNode;
  className?: string;
  duration?: number;
}

/**
 * Component to handle smooth transitions and prevent content flashing
 * during state changes that might cause rerenders
 */
export const SmoothTransition: React.FC<SmoothTransitionProps> = ({
  children,
  isVisible,
  fallback = null,
  className = '',
  duration = 0.3,
}) => {
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode='wait'>
        {isVisible ? (
          <motion.div
            key='content'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration, ease: 'easeOut' }}
            className='w-full'
          >
            {children}
          </motion.div>
        ) : fallback ? (
          <motion.div
            key='fallback'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration * 0.5 }}
            className='w-full'
          >
            {fallback}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default SmoothTransition;
