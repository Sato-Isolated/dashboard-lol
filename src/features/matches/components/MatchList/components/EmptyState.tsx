import React from 'react';
import { EMPTY_STATE_CONFIG } from '../constants';

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = EMPTY_STATE_CONFIG.defaultMessage,
  className = '',
}) => (
  <div className={`bg-base-200 rounded-xl p-8 text-center ${className}`}>
    <div className='text-6xl mb-4'>{EMPTY_STATE_CONFIG.icon}</div>
    <div className='text-lg font-semibold text-base-content mb-2'>
      {EMPTY_STATE_CONFIG.title}
    </div>
    <div className='text-base-content/60'>{message}</div>
  </div>
);
