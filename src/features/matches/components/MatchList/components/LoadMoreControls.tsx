import React from 'react';
import { Button } from '@/shared/components/ui/Button';

interface LoadMoreControlsProps {
  matches: any[];
  maxInitialItems?: number;
  showAll: boolean;
  onShowAll: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

export const LoadMoreControls: React.FC<LoadMoreControlsProps> = ({
  matches,
  maxInitialItems,
  showAll,
  onShowAll,
  hasMore,
  onLoadMore,
  loadingMore,
}) => (
  <>
    {maxInitialItems && matches.length > maxInitialItems && !showAll && (
      <div className='text-center'>
        <Button variant='outline' onClick={onShowAll}>
          Show All {matches.length} Matches
        </Button>
      </div>
    )}

    {hasMore && onLoadMore && (
      <div className='text-center'>
        <Button
          variant='primary'
          onClick={onLoadMore}
          isLoading={loadingMore}
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading...' : 'Load More Matches'}
        </Button>
      </div>
    )}
  </>
);
