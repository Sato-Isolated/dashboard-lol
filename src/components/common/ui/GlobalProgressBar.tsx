'use client';
import React from 'react';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';

const GlobalProgressBar: React.FC = () => {
  const { loading } = useGlobalLoading();
  if (!loading) {
    return null;
  }
  return (
    <div className='fixed top-0 left-0 w-full z-[100]'>
      <div
        role='progressbar'
        className='h-1 bg-gradient-to-r from-primary to-accent animate-pulse w-full transition-all duration-300'
      />
    </div>
  );
};

export default GlobalProgressBar;
