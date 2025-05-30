import React from 'react';
import { EmptyState as SharedEmptyState } from '@/components/common/ui/states';

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  className = '',
}) => (
  <div className={className}>
    <SharedEmptyState type='matches' message={message} size='md' />
  </div>
);
