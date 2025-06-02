'use client';
import React from 'react';
import { ErrorState as SharedErrorState } from '@/components/common/ui/states';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorStateComponent: React.FC<ErrorStateProps> = ({
  errorMessage,
  onRetry,
}) => {
  return (
    <SharedErrorState
      error={errorMessage}
      onRetry={onRetry}
      title='Failed to load match history'
      retryText='Try Again'
      size='lg'
    />
  );
};

// Memoize component to prevent unnecessary re-renders
const ErrorState = React.memo(ErrorStateComponent);
ErrorState.displayName = 'ErrorState';

export default ErrorState;
