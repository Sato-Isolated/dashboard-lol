import React from 'react';
import { RefreshCw } from 'lucide-react';
import {
  LoadingState as SharedLoadingState,
  ErrorState as SharedErrorState,
  EmptyState as SharedEmptyState,
} from '@/components/common/ui/states';

interface LoadingStatesProps {
  loading?: boolean;
  error?: any;
  onRetry?: () => void;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <SharedLoadingState
        message='Loading champion statistics...'
        icon={<RefreshCw className='text-primary' />}
        size='lg'
      />
    );
  }

  if (error) {
    return (
      <SharedErrorState
        error={error}
        title='Error Loading Champions'
        onRetry={onRetry}
        retryText='Clear Cache & Retry'
        icon={<RefreshCw size={24} />}
        size='lg'
      />
    );
  }

  return null;
};

interface EmptyStateProps {
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onRetry }) => {
  return (
    <SharedEmptyState
      type='champions'
      title='No Champions Found'
      message='No champion statistics available for this summoner.'
      action={
        onRetry
          ? {
              label: 'Clear Cache & Retry',
              onClick: onRetry,
              variant: 'outline',
            }
          : undefined
      }
      size='lg'
    />
  );
};

interface SearchEmptyStateProps {
  searchTerm: string;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  searchTerm,
}) => {
  if (!searchTerm) {
    return null;
  }

  return (
    <SharedEmptyState
      type='search'
      title='No champions found'
      message='Try adjusting your search term'
      emoji='🔍'
      size='md'
    />
  );
};
