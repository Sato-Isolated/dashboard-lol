import React from 'react';
import { ERROR_STATE_CONFIG } from '../constants';

interface ErrorStateProps {
  error: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  className = '',
}) => (
  <div
    className={`bg-base-200 rounded-xl p-6 border border-error/20 text-center ${className}`}
  >
    <div className='text-error text-lg mb-2'>
      {ERROR_STATE_CONFIG.icon} {ERROR_STATE_CONFIG.title}
    </div>
    <div className='text-base-content/70 text-sm'>{error}</div>
  </div>
);
