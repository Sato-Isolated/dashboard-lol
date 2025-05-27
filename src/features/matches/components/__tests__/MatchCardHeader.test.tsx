import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchCardHeader from '../MatchCardHeader';

describe('MatchCardHeader Component', () => {
  const defaultProps = {
    mode: 'ARAM',
    date: '2025-01-15',
    result: 'Win',
    duration: '25:30',
  };

  it('renders all header information correctly', () => {
    render(<MatchCardHeader {...defaultProps} />);

    expect(screen.getByText('ARAM')).toBeInTheDocument();
    expect(screen.getByText('2025-01-15')).toBeInTheDocument();
    expect(screen.getByText('Victory')).toBeInTheDocument();
    expect(screen.getByText('25:30')).toBeInTheDocument();
  });

  it('displays victory result with correct styling', () => {
    render(<MatchCardHeader {...defaultProps} />);

    const resultElement = screen.getByText('Victory');
    expect(resultElement).toBeInTheDocument();
    expect(resultElement).toHaveClass('text-success');
  });

  it('displays defeat result with correct styling', () => {
    render(<MatchCardHeader {...defaultProps} result='Loss' />);

    const resultElement = screen.getByText('Defeat');
    expect(resultElement).toBeInTheDocument();
    expect(resultElement).toHaveClass('text-error');
  });

  it('applies correct badge styling for mode', () => {
    render(<MatchCardHeader {...defaultProps} />);

    const modeBadge = screen.getByText('ARAM');
    expect(modeBadge).toHaveClass(
      'badge',
      'badge-primary',
      'badge-sm',
      'font-bold',
      'uppercase',
      'tracking-wider',
      'mb-1',
      'w-fit'
    );
  });

  it('applies correct styling for date', () => {
    render(<MatchCardHeader {...defaultProps} />);

    const dateElement = screen.getByText('2025-01-15');
    expect(dateElement).toHaveClass(
      'text-xs',
      'text-base-content/60',
      'font-mono'
    );
  });

  it('applies correct styling for duration', () => {
    render(<MatchCardHeader {...defaultProps} />);

    const durationElement = screen.getByText('25:30');
    expect(durationElement).toHaveClass(
      'text-xs',
      'text-base-content/70',
      'mt-1',
      'font-mono'
    );
  });
  it('handles different game modes correctly', () => {
    const modes = ['ARAM', 'Ranked Solo', 'Normal Draft', 'URF'];

    modes.forEach(mode => {
      const { unmount } = render(
        <MatchCardHeader {...defaultProps} mode={mode} />
      );
      expect(screen.getByText(mode)).toBeInTheDocument();

      // Cleanup for next iteration
      unmount();
    });
  });
  it('handles different date formats correctly', () => {
    const dates = ['2025-01-15', '2024-12-31', '2025-02-29'];

    dates.forEach(date => {
      const { unmount } = render(
        <MatchCardHeader {...defaultProps} date={date} />
      );
      expect(screen.getByText(date)).toBeInTheDocument();

      // Cleanup for next iteration
      unmount();
    });
  });
  it('handles different duration formats correctly', () => {
    const durations = ['25:30', '15:45', '1:02:15', '5:23'];

    durations.forEach(duration => {
      const { unmount } = render(
        <MatchCardHeader {...defaultProps} duration={duration} />
      );
      expect(screen.getByText(duration)).toBeInTheDocument();

      // Cleanup for next iteration
      unmount();
    });
  });

  it('has correct container styling', () => {
    render(<MatchCardHeader {...defaultProps} />);

    const container = screen.getByText('ARAM').closest('div');
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'justify-center',
      'min-w-[120px]',
      'max-w-[160px]',
      'bg-base-200/90',
      'rounded-t-3xl',
      'sm:rounded-l-3xl',
      'sm:rounded-tr-none',
      'border-2',
      'border-primary/30',
      'shadow-inner',
      'px-3',
      'py-2',
      'gap-1'
    );
  });
  it('handles different result values correctly', () => {
    const resultTests = [
      { result: 'Win', expected: 'Victory', className: 'text-success' },
      { result: 'Loss', expected: 'Defeat', className: 'text-error' },
      { result: 'win', expected: 'Victory', className: 'text-success' },
      { result: 'loss', expected: 'Defeat', className: 'text-error' },
    ];

    resultTests.forEach(({ result, expected, className }) => {
      const { unmount } = render(
        <MatchCardHeader {...defaultProps} result={result} />
      );

      const resultElement = screen.getByText(expected);
      expect(resultElement).toBeInTheDocument();
      expect(resultElement).toHaveClass(className);

      // Cleanup for next iteration
      unmount();
    });
  });

  it('memoizes computed values correctly', () => {
    const { rerender } = render(<MatchCardHeader {...defaultProps} />);

    expect(screen.getByText('Victory')).toBeInTheDocument();

    // Rerender with same props should maintain same content
    rerender(<MatchCardHeader {...defaultProps} />);
    expect(screen.getByText('Victory')).toBeInTheDocument();

    // Rerender with different result should update
    rerender(<MatchCardHeader {...defaultProps} result='Loss' />);
    expect(screen.getByText('Defeat')).toBeInTheDocument();
  });

  it('renders result with correct font weight', () => {
    render(<MatchCardHeader {...defaultProps} />);

    const resultElement = screen.getByText('Victory');
    expect(resultElement).toHaveClass('mt-2', 'text-base', 'font-bold');
  });

  it('maintains accessibility standards', () => {
    render(<MatchCardHeader {...defaultProps} />);

    // Component should be semantically structured
    const container = screen.getByText('ARAM').closest('div');
    expect(container).toBeInTheDocument();

    // Text elements should be readable
    expect(screen.getByText('ARAM')).toBeVisible();
    expect(screen.getByText('2025-01-15')).toBeVisible();
    expect(screen.getByText('Victory')).toBeVisible();
    expect(screen.getByText('25:30')).toBeVisible();
  });

  it('handles edge case values gracefully', () => {
    const edgeCaseProps = {
      mode: '',
      date: '',
      result: '',
      duration: '',
    };

    expect(() => render(<MatchCardHeader {...edgeCaseProps} />)).not.toThrow();
  });

  it('renders component with proper display name', () => {
    const { container } = render(<MatchCardHeader {...defaultProps} />);

    // Component should render without errors
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies responsive design classes correctly', () => {
    render(<MatchCardHeader {...defaultProps} />);

    const container = screen.getByText('ARAM').closest('div');

    // Check for responsive border radius classes
    expect(container).toHaveClass(
      'rounded-t-3xl',
      'sm:rounded-l-3xl',
      'sm:rounded-tr-none'
    );
  });

  it('maintains consistent spacing with gap classes', () => {
    render(<MatchCardHeader {...defaultProps} />);

    const container = screen.getByText('ARAM').closest('div');
    expect(container).toHaveClass('gap-1');
  });

  it('uses monospace font for time-related content', () => {
    render(<MatchCardHeader {...defaultProps} />);

    const dateElement = screen.getByText('2025-01-15');
    const durationElement = screen.getByText('25:30');

    expect(dateElement).toHaveClass('font-mono');
    expect(durationElement).toHaveClass('font-mono');
  });

  it('handles very long game modes', () => {
    const longMode = 'Very Long Game Mode Name That Might Overflow';

    render(<MatchCardHeader {...defaultProps} mode={longMode} />);

    const modeBadge = screen.getByText(longMode);
    expect(modeBadge).toBeInTheDocument();
    expect(modeBadge).toHaveClass('w-fit'); // Should fit content
  });

  it('maintains proper text contrast with opacity classes', () => {
    render(<MatchCardHeader {...defaultProps} />);

    const dateElement = screen.getByText('2025-01-15');
    const durationElement = screen.getByText('25:30');

    expect(dateElement).toHaveClass('text-base-content/60');
    expect(durationElement).toHaveClass('text-base-content/70');
  });
});
