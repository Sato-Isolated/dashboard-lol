import React from 'react';

interface SectionCardProps {
  title: string;
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  role?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  loading,
  error,
  children,
  role = 'region',
}) => (
  <section
    className='bg-base-100 rounded-xl shadow p-4 min-h-[200px] flex flex-col items-center w-full'
    aria-busy={loading}
    aria-live='polite'
    role={role}
  >
    <span className='font-semibold text-base-content mb-2'>{title}</span>
    {loading ? (
      <div className='flex flex-col gap-2 w-full animate-pulse'>
        <div className='skeleton h-6 w-32 mb-2' />
        <div className='skeleton h-4 w-full mb-1' />
        <div className='skeleton h-4 w-full mb-1' />
      </div>
    ) : error ? (
      <span className='text-error text-xs text-center mb-2'>{error}</span>
    ) : (
      children
    )}
  </section>
);

const MemoizedSectionCard = React.memo(SectionCard);
MemoizedSectionCard.displayName = 'SectionCard';

export default MemoizedSectionCard;
