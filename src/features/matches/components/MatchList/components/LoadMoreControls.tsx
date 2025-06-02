import React, { useCallback, useRef, useEffect } from 'react';
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
  // Prevent multiple rapid clicks with a shorter timeout
  const isLoadingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debug logging to help track state changes
  console.log('LoadMoreControls state:', {
    hasMore,
    loadingMore,
    isLoadingRef: isLoadingRef.current,
  });

  const handleLoadMore = useCallback(() => {
    if (isLoadingRef.current || loadingMore || !onLoadMore || !hasMore) {
      console.log('LoadMore blocked:', {
        isLoading: isLoadingRef.current,
        loadingMore,
        hasOnLoadMore: !!onLoadMore,
        hasMore,
      });
      return;
    }
    
    console.log('LoadMore triggered');
    isLoadingRef.current = true;
    onLoadMore();
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Reset flag after a short delay to prevent double clicks
    // Use shorter timeout since TanStack Query's loadingMore will handle the main loading state
    timeoutRef.current = setTimeout(() => {
      isLoadingRef.current = false;
      console.log('LoadMore click protection reset');
    }, 100);
  }, [onLoadMore, loadingMore, hasMore]);

  // Cleanup timeout on unmount or when loadingMore changes
  useEffect(() => {
    if (!loadingMore && isLoadingRef.current) {
      // If loading is complete, reset the ref immediately
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      isLoadingRef.current = false;
      console.log('LoadMore state reset due to loading completion');
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loadingMore]);
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
