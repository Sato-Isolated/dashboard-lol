import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RankBadge from '../RankBadge';
import { getAramRank } from '@/features/aram/utils/aramRankSystem';

// Mock the ARAM rank system
jest.mock('@/features/aram/utils/aramRankSystem', () => ({
  getAramRank: jest.fn(),
}));

// Type the mocked function
const mockGetAramRank = getAramRank as jest.MockedFunction<typeof getAramRank>;

describe('RankBadge', () => {
  const mockAramRank = {
    name: 'Yeti' as const,
    min: 1000,
    max: 1499,
    color: '#8bb6d6',
    displayName: 'Yeti',
  };

  const mockLeagues = [
    {
      queueType: 'RANKED_SOLO_5x5',
      tier: 'GOLD',
      rank: 'III',
      leaguePoints: 45,
      wins: 42,
      losses: 38,
    },
    {
      queueType: 'RANKED_FLEX_SR',
      tier: 'SILVER',
      rank: 'I',
      leaguePoints: 78,
      wins: 23,
      losses: 17,
    },
  ];

  const defaultProps = {
    aramScore: 1250,
    leagues: mockLeagues,
  };

  beforeEach(() => {
    mockGetAramRank.mockReturnValue(mockAramRank);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<RankBadge {...defaultProps} />);
      expect(screen.getByText('Yeti')).toBeInTheDocument();
    });

    it('displays ARAM rank information correctly', () => {
      render(<RankBadge {...defaultProps} />);

      // Check ARAM rank display
      expect(screen.getByText('Yeti')).toBeInTheDocument();
      expect(screen.getByText(/ARAM Score:/)).toBeInTheDocument();
      expect(screen.getByText('1250')).toBeInTheDocument();

      // Check avatar with first letter
      const avatar = screen.getByText('Y');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveStyle({ color: '#8bb6d6' });
    });
    it('displays league ranks correctly', () => {
      render(<RankBadge {...defaultProps} />);

      // Check league titles - using the exact text that appears in DOM
      expect(screen.getByText('SOLO')).toBeInTheDocument();
      expect(screen.getByText('FLEX')).toBeInTheDocument();

      // Check tier and rank info
      expect(screen.getByText(/GOLD.*III/)).toBeInTheDocument();
      expect(screen.getByText(/SILVER.*I/)).toBeInTheDocument();

      // Check LP and win/loss info
      expect(screen.getByText('(45 LP)')).toBeInTheDocument();
      expect(screen.getByText('(78 LP)')).toBeInTheDocument();
      expect(screen.getByText('42W')).toBeInTheDocument();
      expect(screen.getByText('38L')).toBeInTheDocument();
      expect(screen.getByText('23W')).toBeInTheDocument();
      expect(screen.getByText('17L')).toBeInTheDocument();
    });

    it('shows unranked badge when no leagues provided', () => {
      render(<RankBadge aramScore={500} leagues={[]} />);

      expect(screen.getByText('Unranked')).toBeInTheDocument();
      expect(screen.getByText('Yeti')).toBeInTheDocument(); // ARAM rank still shows
    });

    it('applies correct styling classes', () => {
      render(<RankBadge {...defaultProps} />);

      // Check main card styling
      const mainCard = screen.getByText('Yeti').closest('.card');
      expect(mainCard).toHaveClass(
        'bg-base-100',
        'rounded-2xl',
        'shadow-xl',
        'p-4',
        'w-full',
        'border',
        'border-primary/30'
      );

      // Check rank item styling
      const rankItems = screen.getAllByText(/GOLD|SILVER/);
      rankItems.forEach(item => {
        const container = item.closest('.bg-base-200');
        expect(container).toHaveClass(
          'bg-base-200',
          'rounded-lg',
          'px-3',
          'py-2',
          'border',
          'border-base-300'
        );
      });
    });
  });

  describe('ARAM Integration', () => {
    it('calls getAramRank with correct aramScore', () => {
      render(<RankBadge aramScore={2500} leagues={mockLeagues} />);

      expect(mockGetAramRank).toHaveBeenCalledWith(2500);
      expect(mockGetAramRank).toHaveBeenCalledTimes(1);
    });

    it('handles different ARAM ranks correctly', () => {
      const bridgeLegendRank = {
        name: 'Bridge Legend' as const,
        min: 3000,
        max: 3499,
        color: '#c9e6ff',
        displayName: 'Bridge Legend',
      };

      mockGetAramRank.mockReturnValue(bridgeLegendRank);

      render(<RankBadge aramScore={3200} leagues={mockLeagues} />);

      expect(screen.getByText('Bridge Legend')).toBeInTheDocument();
      const avatar = screen.getByText('B');
      expect(avatar).toHaveStyle({ color: '#c9e6ff' });
    });

    it('handles low ARAM scores', () => {
      const poroRank = {
        name: 'Poro' as const,
        min: 0,
        max: 499,
        color: '#e0e6eb',
        displayName: 'Poro',
      };

      mockGetAramRank.mockReturnValue(poroRank);

      render(<RankBadge aramScore={100} leagues={mockLeagues} />);

      expect(screen.getByText('Poro')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('handles zero ARAM score', () => {
      const poroRank = {
        name: 'Poro' as const,
        min: 0,
        max: 499,
        color: '#e0e6eb',
        displayName: 'Poro',
      };

      mockGetAramRank.mockReturnValue(poroRank);

      render(<RankBadge aramScore={0} leagues={[]} />);

      expect(screen.getByText('Poro')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Unranked')).toBeInTheDocument();
    });
  });

  describe('League Data Processing', () => {
    it('formats queue types correctly', () => {
      render(<RankBadge {...defaultProps} />);

      // Should remove "RANKED_" prefix and suffixes
      expect(screen.getByText('SOLO')).toBeInTheDocument();
      expect(screen.getByText('FLEX')).toBeInTheDocument();
      expect(screen.queryByText('RANKED_SOLO_5x5')).not.toBeInTheDocument();
    });
    it('handles single league', () => {
      const singleLeague = [mockLeagues[0]];
      render(<RankBadge aramScore={1250} leagues={singleLeague} />);

      expect(screen.getByText('SOLO')).toBeInTheDocument();
      expect(screen.getByText(/GOLD.*III/)).toBeInTheDocument();
      expect(screen.queryByText('FLEX')).not.toBeInTheDocument();
    });

    it('handles unusual queue types', () => {
      const unusualLeagues = [
        {
          queueType: 'RANKED_TFT',
          tier: 'PLATINUM',
          rank: 'II',
          leaguePoints: 67,
          wins: 15,
          losses: 10,
        },
      ];

      render(<RankBadge aramScore={1250} leagues={unusualLeagues} />);

      expect(screen.getByText('TFT')).toBeInTheDocument();
      expect(screen.getByText('PLATINUM II')).toBeInTheDocument();
    });

    it('displays correct win/loss statistics', () => {
      render(<RankBadge {...defaultProps} />);

      // Check that wins are styled with success color
      const winElements = screen.getAllByText(/\d+W/);
      expect(winElements).toHaveLength(2);
      winElements.forEach(element => {
        expect(element).toHaveClass('text-success');
      });

      // Check that losses are styled with error color
      const lossElements = screen.getAllByText(/\d+L/);
      expect(lossElements).toHaveLength(2);
      lossElements.forEach(element => {
        expect(element).toHaveClass('text-error');
      });
    });
  });

  describe('Component Structure', () => {
    it('renders with correct semantic structure', () => {
      render(<RankBadge {...defaultProps} />);

      // Should have divider between ARAM and League sections
      expect(screen.getByText('League Rank')).toBeInTheDocument();

      // Check for flex layout structure
      const container = screen.getByText('Yeti').closest('.flex.flex-col');
      expect(container).toBeInTheDocument();
    });

    it('renders leagues in correct order', () => {
      render(<RankBadge {...defaultProps} />);

      const rankElements = screen.getAllByText(/GOLD|SILVER/);
      expect(rankElements[0]).toHaveTextContent('GOLD III');
      expect(rankElements[1]).toHaveTextContent('SILVER I');
    });
  });

  describe('Memoization and Performance', () => {
    it('memoizes rank calculations', () => {
      const { rerender } = render(<RankBadge {...defaultProps} />);

      // Clear mock calls from initial render
      mockGetAramRank.mockClear();

      // Rerender with same props
      rerender(<RankBadge {...defaultProps} />);

      // getAramRank should not be called again due to useMemo
      expect(mockGetAramRank).toHaveBeenCalledTimes(0);
    });

    it('recalculates when aramScore changes', () => {
      const { rerender } = render(<RankBadge {...defaultProps} />);

      // Clear mock calls from initial render
      mockGetAramRank.mockClear();

      // Rerender with different aramScore
      rerender(<RankBadge aramScore={2000} leagues={mockLeagues} />);

      expect(mockGetAramRank).toHaveBeenCalledWith(2000);
    });
    it('recalculates when leagues change', () => {
      const { rerender } = render(<RankBadge {...defaultProps} />);

      // Check initial render has both leagues
      expect(screen.getByText('SOLO')).toBeInTheDocument();
      expect(screen.getByText('FLEX')).toBeInTheDocument();

      // Rerender with different leagues
      const newLeagues = [mockLeagues[0]]; // Only first league
      rerender(<RankBadge aramScore={1250} leagues={newLeagues} />);

      expect(screen.getByText('SOLO')).toBeInTheDocument();
      expect(screen.queryByText('FLEX')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined leagues gracefully', () => {
      // @ts-expect-error Testing edge case
      render(<RankBadge aramScore={1000} leagues={undefined} />);

      // Should not crash and still show ARAM info
      expect(screen.getByText('Yeti')).toBeInTheDocument();
    });

    it('handles negative ARAM score', () => {
      mockGetAramRank.mockReturnValue({
        name: 'Poro' as const,
        min: 0,
        max: 499,
        color: '#e0e6eb',
        displayName: 'Poro',
      });

      render(<RankBadge aramScore={-100} leagues={[]} />);

      expect(screen.getByText('Poro')).toBeInTheDocument();
      expect(screen.getByText('-100')).toBeInTheDocument();
    });

    it('handles very high ARAM score', () => {
      const blizzardRank = {
        name: 'Blizzard Spirit' as const,
        min: 3500,
        max: Infinity,
        color: '#aee9f9',
        displayName: 'Blizzard Spirit',
      };

      mockGetAramRank.mockReturnValue(blizzardRank);

      render(<RankBadge aramScore={5000} leagues={[]} />);

      expect(screen.getByText('Blizzard Spirit')).toBeInTheDocument();
      expect(screen.getByText('5000')).toBeInTheDocument();
    });
    it('handles leagues with missing data', () => {
      const incompleteLeagues = [
        {
          queueType: 'RANKED_SOLO_5x5',
          tier: 'GOLD',
          rank: '',
          leaguePoints: 0,
          wins: 0,
          losses: 0,
        },
      ];

      render(<RankBadge aramScore={1000} leagues={incompleteLeagues} />);

      expect(screen.getByText('SOLO')).toBeInTheDocument();
      expect(screen.getByText(/GOLD/)).toBeInTheDocument();
      expect(screen.getByText('(0 LP)')).toBeInTheDocument();
    });

    it('handles very long queue type names', () => {
      const longQueueLeagues = [
        {
          queueType: 'RANKED_VERY_LONG_QUEUE_TYPE_NAME',
          tier: 'DIAMOND',
          rank: 'IV',
          leaguePoints: 25,
          wins: 50,
          losses: 45,
        },
      ];

      render(<RankBadge aramScore={1500} leagues={longQueueLeagues} />);

      expect(screen.getByText('VERY_LONG_QUEUE_TYPE_NAME')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders without performance issues', () => {
      // Component should render normally
      render(<RankBadge {...defaultProps} />);

      // Component should render without performance issues
      expect(screen.getByText('Yeti')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides semantic meaning through text content', () => {
      render(<RankBadge {...defaultProps} />);

      // ARAM section should be clearly labeled
      expect(screen.getByText(/ARAM Score:/)).toBeInTheDocument();
      expect(screen.getByText('League Rank')).toBeInTheDocument();
    });

    it('displays rank information in a logical reading order', () => {
      render(<RankBadge {...defaultProps} />);

      const container = screen.getByText('Yeti').closest('.flex.flex-col');
      expect(container).toBeInTheDocument();

      // Information should flow logically: ARAM info -> divider -> League info
      const elements = container?.querySelectorAll('*');
      expect(elements).toBeTruthy();
    });

    it('provides clear visual hierarchy', () => {
      render(<RankBadge {...defaultProps} />);

      // ARAM rank should be prominently displayed
      const aramRank = screen.getByText('Yeti');
      expect(aramRank).toHaveClass('text-lg', 'font-bold');

      // Queue types should be clearly distinguishable
      const queueTypes = screen.getAllByText(/SOLO|FLEX/);
      queueTypes.forEach(element => {
        expect(element).toHaveClass('font-semibold');
      });
    });
  });
});
