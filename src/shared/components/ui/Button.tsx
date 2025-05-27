import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'success'
    | 'error'
    | 'warning'
    | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  shape?: 'default' | 'square' | 'circle';
  wide?: boolean;
  glass?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  shape = 'default',
  wide = false,
  glass = false,
  ...props
}) => {
  // Base DaisyUI button class
  const baseClasses = 'btn';

  // DaisyUI variant classes - matching existing patterns in codebase
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    success: 'btn-success',
    error: 'btn-error',
    warning: 'btn-warning',
    info: 'btn-info',
  };

  // DaisyUI size classes - matching existing patterns
  const sizeClasses = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: '', // default size
    lg: 'btn-lg',
  };

  // Shape classes
  const shapeClasses = {
    default: '',
    square: 'btn-square',
    circle: 'btn-circle',
  };

  // Additional classes
  const additionalClasses = [
    wide && 'btn-wide',
    glass && 'glass',
    isLoading && 'loading',
  ].filter(Boolean);

  const allClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    shapeClasses[shape],
    ...additionalClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={allClasses} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <span className='loading loading-spinner loading-sm mr-2' />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
