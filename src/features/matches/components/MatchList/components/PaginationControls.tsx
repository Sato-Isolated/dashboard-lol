import React from 'react';
import { Button } from '@/components/common/ui/Button';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}) => (
  <div className='flex justify-center items-center gap-2 mt-6'>
    <Button
      variant='outline'
      size='sm'
      onClick={onPrevPage}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    <span className='text-base-content/70 px-4'>
      Page {currentPage} of {totalPages}
    </span>
    <Button
      variant='outline'
      size='sm'
      onClick={onNextPage}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
);
