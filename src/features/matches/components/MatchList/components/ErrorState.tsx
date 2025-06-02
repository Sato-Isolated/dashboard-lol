import React from 'react';
import { ErrorState as SharedErrorState } from '@/components/common/ui/states';

interface ErrorStateProps {
  error: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  className = '',
}) => (
  <div className={className}>
    <SharedErrorState
      error={error}
      title='Error Loading Matches'
      size='md'
      icon={<span className='text-4xl'>⚠️</span>}
    />
  </div>
);
