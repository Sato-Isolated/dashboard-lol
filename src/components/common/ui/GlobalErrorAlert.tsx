import React from 'react';
import { useGlobalError } from '@/hooks/useGlobalError';

const GlobalErrorAlert: React.FC = () => {
  const { error, setError } = useGlobalError();
  if (!error) {
    return null;
  }
  return (
    <div className='alert alert-error fixed top-4 left-1/2 -translate-x-1/2 z-50 w-fit shadow-lg'>
      <span>{error}</span>
      <button
        className='btn btn-xs btn-ghost ml-4'
        onClick={() => setError(null)}
        aria-label="Fermer l'erreur"
      >
        ✕
      </button>
    </div>
  );
};

export default GlobalErrorAlert;
