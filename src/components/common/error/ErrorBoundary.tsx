'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { clientLogger } from '@/lib/logger/clientLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    clientLogger.error('Error boundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className='alert alert-error max-w-4xl mx-auto my-8'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='stroke-current shrink-0 h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span className='font-semibold'>Something went wrong</span>
            </div>

            <div className='text-sm opacity-75'>
              An unexpected error occurred. The development team has been
              notified.
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mt-4'>
                <summary className='cursor-pointer font-mono text-sm'>
                  Error Details (Development Only)
                </summary>
                <div className='mt-2 p-4 bg-base-200 rounded-lg'>
                  <div className='font-mono text-xs'>
                    <div className='font-semibold text-error mb-2'>
                      {this.state.error.message}
                    </div>
                    <pre className='whitespace-pre-wrap text-xs overflow-auto max-h-64'>
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <details className='mt-4'>
                        <summary className='cursor-pointer'>
                          Component Stack
                        </summary>
                        <pre className='whitespace-pre-wrap text-xs mt-2 opacity-75'>
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </details>
            )}

            <div className='flex gap-2 mt-4'>
              <button
                className='btn btn-sm btn-outline'
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
              <button
                className='btn btn-sm btn-primary'
                onClick={() =>
                  this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null,
                  })
                }
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

/**
 * Specialized error boundary for async components
 */
export class AsyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    clientLogger.error('Async error boundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex flex-col items-center justify-center h-64 p-8'>
          <div className='alert alert-warning max-w-md'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='stroke-current shrink-0 h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <div>
              <div className='font-semibold'>Content failed to load</div>
              <div className='text-sm opacity-75'>
                This section couldn&apos;t be loaded. Please try refreshing.
              </div>
            </div>
          </div>

          <button
            className='btn btn-sm btn-outline mt-4'
            onClick={() =>
              this.setState({ hasError: false, error: null, errorInfo: null })
            }
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
