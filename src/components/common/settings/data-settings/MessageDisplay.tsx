import { motion } from 'motion/react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Message } from './types';

interface MessageDisplayProps {
  message: Message;
}

export default function MessageDisplay({ message }: MessageDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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
