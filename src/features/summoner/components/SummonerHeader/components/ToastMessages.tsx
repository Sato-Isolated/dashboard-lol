import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Trophy } from 'lucide-react';

interface ToastMessagesProps {
  shareMsg: string;
  rankMsg: string;
}

export const ToastMessages: React.FC<ToastMessagesProps> = ({
  shareMsg,
  rankMsg,
}) => {
  return (
    <AnimatePresence>
      {shareMsg && (
        <motion.div
          className='absolute top-4 right-4 bg-success text-success-content px-4 py-2 rounded-lg shadow-lg flex items-center gap-2'
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Copy size={16} />
          <span className='text-sm font-medium'>{shareMsg}</span>
        </motion.div>
      )}

      {rankMsg && (
        <motion.div
          className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-info text-info-content px-6 py-3 rounded-lg shadow-lg flex items-center gap-2'
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Trophy size={18} />
          <span className='font-medium'>{rankMsg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
