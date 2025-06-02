'use client';
import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  /**
   * Type of skeleton to render
   */
  variant?: 'text' | 'circle' | 'rectangular' | 'rounded' | 'custom';
  /**
   * Width of the skeleton
   */
  width?: string | number;
  /**
   * Height of the skeleton
   */
  height?: string | number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to animate the skeleton
   */
  animate?: boolean;
  /**
   * Animation type
   */
  animation?: 'pulse' | 'wave' | 'shimmer';
}

interface SkeletonGroupProps {
  /**
   * Number of skeleton items to render
   */
  count: number;
  /**
   * Type of skeleton items
   */
  variant?: SkeletonProps['variant'];
  /**
   * Space between skeleton items
   */
  spacing?: 'sm' | 'md' | 'lg';
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  /**
   * Individual skeleton props
   */
  skeletonProps?: Omit<SkeletonProps, 'variant'>;
}

const variantClasses = {
  text: 'h-4 rounded',
  circle: 'rounded-full aspect-square',
  rectangular: 'rounded-none',
  rounded: 'rounded-lg',
  custom: '',
};

const spacingClasses = {
  sm: 'space-y-2',
  md: 'space-y-3',
  lg: 'space-y-4',
};

const animationClasses = {
  pulse: 'animate-pulse',
  wave: 'animate-pulse',
  shimmer: 'shimmer',
};

/**
 * Individual skeleton component
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  animate = true,
  animation = 'pulse',
}) => {
  const variantClass = variantClasses[variant];
  const animationClass = animate ? animationClasses[animation] : '';

  const style: React.CSSProperties = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && {
      height: typeof height === 'number' ? `${height}px` : height,
    }),
  };

  return (
    <div
      className={`
        bg-base-300 
        ${variantClass} 
        ${animationClass}
        ${className}
      `}
      style={style}
    />
  );
};

/**
 * Skeleton group component for rendering multiple skeletons
 */
export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count,
  variant = 'text',
  spacing = 'md',
  className = '',
  skeletonProps = {},
}) => {
  const spacingClass = spacingClasses[spacing];

  return (
    <div className={`${spacingClass} ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} variant={variant} {...skeletonProps} />
      ))}
    </div>
  );
};

/**
 * Card skeleton with common layout patterns
 */
export const CardSkeleton: React.FC<{
  showHeader?: boolean;
  showAvatar?: boolean;
  showContent?: boolean;
  showActions?: boolean;
  className?: string;
}> = ({
  showHeader = true,
  showAvatar = false,
  showContent = true,
  showActions = false,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`bg-base-100 rounded-lg p-4 border border-base-300 ${className}`}
  >
    {showHeader && (
      <div className='flex items-center gap-3 mb-4'>
        {showAvatar && <Skeleton variant='circle' width={40} height={40} />}
        <div className='flex-1 space-y-2'>
          <Skeleton variant='text' width='60%' height={20} />
          <Skeleton variant='text' width='40%' height={16} />
        </div>
      </div>
    )}

    {showContent && (
      <div className='space-y-3'>
        <Skeleton variant='text' width='100%' height={16} />
        <Skeleton variant='text' width='80%' height={16} />
        <Skeleton variant='text' width='90%' height={16} />
      </div>
    )}

    {showActions && (
      <div className='flex gap-2 mt-4'>
        <Skeleton variant='rounded' width={80} height={32} />
        <Skeleton variant='rounded' width={100} height={32} />
      </div>
    )}
  </motion.div>
);

/**
 * Table skeleton for data tables
 */
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}> = ({ rows = 5, columns = 4, showHeader = true, className = '' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`space-y-4 ${className}`}
  >
    {showHeader && (
      <div
        className='grid gap-4'
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={`header-${i}`} variant='text' height={24} />
        ))}
      </div>
    )}

    <div className='space-y-3'>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <motion.div
          key={rowIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: rowIndex * 0.1 }}
          className='grid gap-4'
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton
              key={`row-${rowIndex}-col-${colIndex}`}
              variant='text'
              height={20}
            />
          ))}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default Skeleton;
