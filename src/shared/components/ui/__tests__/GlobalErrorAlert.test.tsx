import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalErrorAlert from '../GlobalErrorAlert';
import { useGlobalError } from '@/shared/hooks/useGlobalError';

// Mock the global error hook
const mockSetError = jest.fn();

jest.mock('@/shared/hooks/useGlobalError', () => ({
  useGlobalError: jest.fn(),
}));

const mockUseGlobalError = useGlobalError as jest.MockedFunction<
  typeof useGlobalError
>;

describe('GlobalErrorAlert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalError.mockReturnValue({
      error: null,
      setError: mockSetError,
    });
  });

  describe('Rendering', () => {
    it('renders nothing when no error', () => {
      const { container } = render(<GlobalErrorAlert />);
      expect(container.firstChild).toBeNull();
    });

    it('renders error alert when error exists', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error message',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('displays error with proper alert styling', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error message',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      const alertElement = screen
        .getByText('Test error message')
        .closest('.alert');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveClass('alert', 'alert-error');
    });

    it('shows close button when error is present', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error message',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent('✕');
    });
  });

  describe('Error Types', () => {
    it('handles short error messages', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Error',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('handles long error messages', () => {
      mockUseGlobalError.mockReturnValue({
        error:
          'This is a very long error message that might wrap to multiple lines and should still be displayed correctly in the error alert component',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      expect(
        screen.getByText(/This is a very long error message/)
      ).toBeInTheDocument();
    });

    it('handles error messages with special characters', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Error: Failed to fetch data (404) - Not Found!',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      expect(
        screen.getByText('Error: Failed to fetch data (404) - Not Found!')
      ).toBeInTheDocument();
    });

    it('handles multiline error messages', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Line 1\nLine 2\nLine 3',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      expect(screen.getByText(/Line 1.*Line 2.*Line 3/)).toBeInTheDocument();
    });

    it('handles empty string error', () => {
      mockUseGlobalError.mockReturnValue({
        error: '',
        setError: mockSetError,
      });
      const { container } = render(<GlobalErrorAlert />);

      // Empty string should be treated as no error
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Positioning and Layout', () => {
    it('applies correct positioning classes', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      const alertElement = screen.getByText('Test error').closest('.alert');
      expect(alertElement).toHaveClass(
        'fixed',
        'top-4',
        'left-1/2',
        '-translate-x-1/2',
        'z-50'
      );
    });

    it('applies correct width constraints', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      const alertElement = screen.getByText('Test error').closest('.alert');
      expect(alertElement).toHaveClass('w-fit');
    });

    it('applies shadow styling', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      const alertElement = screen.getByText('Test error').closest('.alert');
      expect(alertElement).toHaveClass('shadow-lg');
    });
  });

  describe('Interactive Behavior', () => {
    it('calls setError with null when close button is clicked', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      const closeButton = screen.getByRole('button');
      fireEvent.click(closeButton);

      expect(mockSetError).toHaveBeenCalledWith(null);
      expect(mockSetError).toHaveBeenCalledTimes(1);
    });

    it('close button has proper classes', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('btn', 'btn-xs', 'btn-ghost', 'ml-4');
    });

    it('close button has proper aria-label', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveAttribute('aria-label', "Fermer l'erreur");
    });
  });

  describe('State Management', () => {
    it('updates when error state changes', () => {
      // Start with no error
      mockUseGlobalError.mockReturnValue({
        error: null,
        setError: mockSetError,
      });
      const { rerender } = render(<GlobalErrorAlert />);
      expect(screen.queryByText('New error')).not.toBeInTheDocument();

      // Add error
      mockUseGlobalError.mockReturnValue({
        error: 'New error',
        setError: mockSetError,
      });
      rerender(<GlobalErrorAlert />);
      expect(screen.getByText('New error')).toBeInTheDocument();

      // Clear error
      mockUseGlobalError.mockReturnValue({
        error: null,
        setError: mockSetError,
      });
      rerender(<GlobalErrorAlert />);
      expect(screen.queryByText('New error')).not.toBeInTheDocument();
    });

    it('updates error message content', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'First error',
        setError: mockSetError,
      });
      const { rerender } = render(<GlobalErrorAlert />);
      expect(screen.getByText('First error')).toBeInTheDocument();

      mockUseGlobalError.mockReturnValue({
        error: 'Second error',
        setError: mockSetError,
      });
      rerender(<GlobalErrorAlert />);
      expect(screen.getByText('Second error')).toBeInTheDocument();
      expect(screen.queryByText('First error')).not.toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not render when error is null', () => {
      mockUseGlobalError.mockReturnValue({
        error: null,
        setError: mockSetError,
      });
      const { container } = render(<GlobalErrorAlert />);

      // Should return null early, no DOM elements created
      expect(container.firstChild).toBeNull();
    });

    it('efficiently updates on error changes', () => {
      const { rerender } = render(<GlobalErrorAlert />);

      // Multiple re-renders should work efficiently
      for (let i = 0; i < 10; i++) {
        mockUseGlobalError.mockReturnValue({
          error: `Error ${i}`,
          setError: mockSetError,
        });
        rerender(<GlobalErrorAlert />);
        expect(screen.getByText(`Error ${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles null error gracefully', () => {
      mockUseGlobalError.mockReturnValue({
        error: null,
        setError: mockSetError,
      });
      const { container } = render(<GlobalErrorAlert />);

      expect(container.firstChild).toBeNull();
    });

    it('handles undefined error gracefully', () => {
      mockUseGlobalError.mockReturnValue({
        error: undefined as any,
        setError: mockSetError,
      });
      const { container } = render(<GlobalErrorAlert />);

      expect(container.firstChild).toBeNull();
    });

    it('handles numeric error codes', () => {
      mockUseGlobalError.mockReturnValue({
        error: '404',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('handles JSON error strings', () => {
      mockUseGlobalError.mockReturnValue({
        error: '{"error": "Invalid request", "code": 400}',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      expect(
        screen.getByText('{"error": "Invalid request", "code": 400}')
      ).toBeInTheDocument();
    });

    it('handles very long error messages', () => {
      const longError = 'A'.repeat(1000);
      mockUseGlobalError.mockReturnValue({
        error: longError,
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      expect(screen.getByText(longError)).toBeInTheDocument();
    });
  });

  describe('Styling Consistency', () => {
    it('maintains consistent DaisyUI classes', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      const alertElement = screen.getByText('Test error').closest('.alert');
      expect(alertElement).toHaveClass('alert', 'alert-error');

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('btn', 'btn-xs', 'btn-ghost');
    });

    it('applies proper z-index for overlay', () => {
      mockUseGlobalError.mockReturnValue({
        error: 'Test error',
        setError: mockSetError,
      });
      render(<GlobalErrorAlert />);

      const alertElement = screen.getByText('Test error').closest('.alert');
      expect(alertElement).toHaveClass('z-50');
    });
  });
});
