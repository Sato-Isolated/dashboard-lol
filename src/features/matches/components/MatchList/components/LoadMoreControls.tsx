import React, { useCallback, useRef } from 'react';
import { Button } from '@/components/common/ui/Button';

interface LoadMoreControlsProps {
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

export const LoadMoreControls: React.FC<LoadMoreControlsProps> = ({
  hasMore,
  onLoadMore,
  loadingMore,
}) => {
  // Prevent multiple rapid clicks
  const isLoadingRef = useRef(false);

  const handleLoadMore = useCallback(() => {
    if (isLoadingRef.current || loadingMore || !onLoadMore) {
      return;
    }
    
    isLoadingRef.current = true;
    onLoadMore();
    
    // Reset flag after a short delay to prevent multiple clicks
    setTimeout(() => {
      isLoadingRef.current = false;
    }, 1000);
  }, [onLoadMore, loadingMore]);

  return (
    <>
      {/* Load More button - for loading additional data from API */}
      {hasMore && onLoadMore && (
        <div className='text-center'>
          <Button
            variant='primary'
            onClick={handleLoadMore}
            isLoading={loadingMore}
            disabled={loadingMore || isLoadingRef.current}
          >
            {loadingMore ? 'Loading...' : 'Load More Matches'}
          </Button>
        </div>
      )}
    </>
  );
};
