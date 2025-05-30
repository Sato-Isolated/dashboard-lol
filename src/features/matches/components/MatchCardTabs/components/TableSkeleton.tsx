import React from 'react';
import { TableSkeleton as SharedTableSkeleton } from '@/components/common/ui/states';

const TableSkeletonComponent: React.FC = () => {
  return (
    <SharedTableSkeleton
      rows={5}
      columns={4}
      showHeader={true}
      className='space-y-4'
    />
  );
};

// Memoize component to prevent unnecessary re-renders
const TableSkeleton = React.memo(TableSkeletonComponent);
TableSkeleton.displayName = 'TableSkeleton';

export default TableSkeleton;
