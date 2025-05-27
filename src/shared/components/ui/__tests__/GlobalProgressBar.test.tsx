import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalProgressBar from '../GlobalProgressBar';

// Mock the global loading hook
const mockSetLoading = jest.fn();

let mockLoading = false;
jest.mock('@/shared/hooks/useGlobalLoading', () => ({
  useGlobalLoading: () => ({
    loading: mockLoading,
    setLoading: mockSetLoading,
  }),
}));

describe('GlobalProgressBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoading = false;
  });

  describe('Rendering', () => {
    it('renders nothing when not loading', () => {
      mockLoading = false;
      const { container } = render(<GlobalProgressBar />);

      expect(container.firstChild).toBeNull();
    });

    it('renders progress bar when loading', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('applies correct positioning classes when loading', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass(
        'fixed',
        'top-0',
        'left-0',
        'w-full',
        'z-[100]'
      );
    });

    it('applies correct progress bar styling', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass(
        'h-1',
        'bg-gradient-to-r',
        'from-primary',
        'to-accent',
        'animate-pulse',
        'w-full',
        'transition-all',
        'duration-300'
      );
    });
  });

  describe('Loading States', () => {
    it('shows progress bar immediately when loading starts', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('hides progress bar when loading stops', () => {
      mockLoading = true;
      const { rerender } = render(<GlobalProgressBar />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      mockLoading = false;
      rerender(<GlobalProgressBar />);
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('toggles visibility correctly', () => {
      const { rerender } = render(<GlobalProgressBar />);

      // Start not loading
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

      // Start loading
      mockLoading = true;
      rerender(<GlobalProgressBar />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // Stop loading
      mockLoading = false;
      rerender(<GlobalProgressBar />);
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

      // Start loading again
      mockLoading = true;
      rerender(<GlobalProgressBar />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Styling and Appearance', () => {
    it('has gradient background', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass(
        'bg-gradient-to-r',
        'from-primary',
        'to-accent'
      );
    });

    it('has animation classes', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('animate-pulse');
    });

    it('has transition classes', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('transition-all', 'duration-300');
    });

    it('has correct height', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('h-1');
    });

    it('spans full width', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('w-full');
    });
  });

  describe('Positioning and Layering', () => {
    it('positions at top of screen', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass('top-0');
    });

    it('positions at left edge', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass('left-0');
    });

    it('has high z-index for overlay', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass('z-[100]');
    });

    it('uses fixed positioning', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const container = screen.getByRole('progressbar').parentElement;
      expect(container).toHaveClass('fixed');
    });
  });

  describe('Accessibility', () => {
    it('has progressbar role when loading', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('provides semantic meaning for screen readers', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('role', 'progressbar');
    });

    it('does not interfere with page navigation when not loading', () => {
      mockLoading = false;
      const { container } = render(<GlobalProgressBar />);

      // Should not add any elements to DOM that could interfere
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Performance', () => {
    it('returns early when not loading', () => {
      mockLoading = false;
      const { container } = render(<GlobalProgressBar />);

      // Should return null immediately, no DOM manipulation
      expect(container.firstChild).toBeNull();
    });

    it('efficiently updates loading state', () => {
      const { rerender } = render(<GlobalProgressBar />);

      // Multiple rapid state changes
      for (let i = 0; i < 10; i++) {
        mockLoading = i % 2 === 0;
        rerender(<GlobalProgressBar />);

        if (mockLoading) {
          expect(screen.getByRole('progressbar')).toBeInTheDocument();
        } else {
          expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        }
      }
    });
    it('does not cause memory leaks on rapid mounting/unmounting', () => {
      const { unmount: unmount1 } = render(<GlobalProgressBar />);

      mockLoading = true;
      const { unmount: unmount2 } = render(<GlobalProgressBar />);

      unmount1();
      unmount2();

      // Should unmount cleanly
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('Integration with Global Loading State', () => {
    it('responds to global loading hook', () => {
      // Simulate global loading state change
      mockLoading = true;
      render(<GlobalProgressBar />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('does not call setLoading function', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      // Component should only read loading state, not modify it
      expect(mockSetLoading).not.toHaveBeenCalled();
    });
  });

  describe('Visual Behavior', () => {
    it('has pulsing animation when active', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('animate-pulse');
    });

    it('uses theme colors', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('from-primary', 'to-accent');
    });

    it('has smooth transitions', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined loading state', () => {
      mockLoading = undefined as any;
      const { container } = render(<GlobalProgressBar />);

      // Should treat undefined as false
      expect(container.firstChild).toBeNull();
    });

    it('handles null loading state', () => {
      mockLoading = null as any;
      const { container } = render(<GlobalProgressBar />);

      // Should treat null as false
      expect(container.firstChild).toBeNull();
    });

    it('handles truthy non-boolean values', () => {
      mockLoading = 'loading' as any;
      render(<GlobalProgressBar />);

      // Should treat truthy values as true
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('handles falsy non-boolean values', () => {
      mockLoading = 0 as any;
      const { container } = render(<GlobalProgressBar />);

      // Should treat falsy values as false
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Component Structure', () => {
    it('has proper DOM structure when loading', () => {
      mockLoading = true;
      const { container } = render(<GlobalProgressBar />);

      // Should have container div with progress bar inside
      const outerDiv = container.firstChild as Element;
      expect(outerDiv.tagName).toBe('DIV');
      expect(outerDiv).toHaveClass('fixed', 'top-0', 'left-0', 'w-full');

      const progressBar = outerDiv.firstChild as Element;
      expect(progressBar.tagName).toBe('DIV');
      expect(progressBar).toHaveAttribute('role', 'progressbar');
    });

    it('maintains consistent class structure', () => {
      mockLoading = true;
      render(<GlobalProgressBar />);

      const progressBar = screen.getByRole('progressbar');
      const expectedClasses = [
        'h-1',
        'bg-gradient-to-r',
        'from-primary',
        'to-accent',
        'animate-pulse',
        'w-full',
        'transition-all',
        'duration-300',
      ];

      expectedClasses.forEach(className => {
        expect(progressBar).toHaveClass(className);
      });
    });
  });
});
