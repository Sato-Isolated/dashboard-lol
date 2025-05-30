'use client';
import React from 'react';
import { EmptyState as SharedEmptyState } from '@/components/common/ui/states';

interface EmptyStateProps {
  type: 'no-user' | 'no-matches';
}

const EmptyStateComponent: React.FC<EmptyStateProps> = ({ type }) => {
  if (type === 'no-user') {
    return (
      <SharedEmptyState
        type='users'
        title='No Player Selected'
        message="Veuillez renseigner un nom de joueur et un tagline pour afficher l'historique."
        emoji='⚠️'
        size='lg'
      />
    );
  }

  return <SharedEmptyState type='matches' size='lg' />;
};

// Memoize component to prevent unnecessary re-renders
const EmptyState = React.memo(EmptyStateComponent);
EmptyState.displayName = 'EmptyState';

export default EmptyState;
