import React from 'react';
import { Trophy } from 'lucide-react';
import {
  LoadingState as SharedLoadingState,
  ErrorState as SharedErrorState,
  EmptyState as SharedEmptyState,
} from '@/components/common/ui/states';

export const LoadingState: React.FC = () => {
  return (
    <SharedLoadingState
      message='Fetching your champion mastery progression...'
      icon={<Trophy className='animate-bounce text-primary' />}
      size='lg'
    />
  );
};

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <SharedErrorState
      error={error}
      title='Failed to Load Mastery Data'
      onRetry={() => window.location.reload()}
      retryText='Try Again'
      icon={<span className='text-4xl'>⚠️</span>}
      size='lg'
    />
  );
};

export const NoDataState: React.FC = () => {
  return (
    <SharedEmptyState
      type='champions'
      title='No Mastery Data Found'
      message='Start playing champions to build your mastery collection!'
      emoji='🎯'
      size='lg'
    />
  );
};

interface EmptySearchStateProps {
  onClearSearch: () => void;
}

export const EmptySearchState: React.FC<EmptySearchStateProps> = ({
  onClearSearch,
}) => {
  return (
    <SharedEmptyState
      type='search'
      title='No champions found'
      message='Try adjusting your search term or clear the filter'
      emoji='🔍'
      action={{
        label: 'Clear search',
        onClick: onClearSearch,
      }}
      size='md'
    />
  );
};
