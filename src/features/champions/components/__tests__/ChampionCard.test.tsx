import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChampionCard, {
  type ChampionCardData,
  type ChampionStats,
  type ChampionMastery,
} from '../ChampionCard';
import type { ChampionData } from '@/shared/types/data/champion';

// Mock Next.js Image component
interface MockImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));

// Mock helper functions
jest.mock('@/shared/lib/utils/helpers', () => ({
  getChampionIcon: (championId: string) => `/assets/champion/${championId}.png`,
  getChampionTags: (champion: { tags: string[] }) => champion.tags.join(', '),
}));

describe('ChampionCard Component', () => {
  const mockChampionData: ChampionData = {
    version: '14.1.1',
    id: 'Ahri',
    key: '103',
    name: 'Ahri',
    title: 'the Nine-Tailed Fox',
    blurb:
      'Innately connected to the latent power of Runeterra, Ahri is a vastaya who can reshape magic into orbs of raw energy.',
    info: {
      attack: 3,
      defense: 4,
      magic: 8,
      difficulty: 5,
    },
    image: {
      full: 'Ahri.png',
      sprite: 'champion0.png',
      group: 'champion',
      x: 48,
      y: 0,
      w: 48,
      h: 48,
    },
    tags: ['Mage', 'Assassin'],
    partype: 'Mana',
    stats: {},
  };

  const mockStats: ChampionStats = {
    champion: 'Ahri',
    games: 45,
    wins: 31,
    kda: 2.4,
    kills: 108,
    deaths: 67,
    assists: 93,
  };

  const mockMastery: ChampionMastery = {
    championId: 103,
    championPoints: 125674,
    championLevel: 7,
  };

  const mockChampion: ChampionCardData = {
    championData: mockChampionData,
    stats: mockStats,
    mastery: mockMastery,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders champion name and title', () => {
      render(<ChampionCard champion={mockChampion} />);

      expect(screen.getByText('Ahri')).toBeInTheDocument();
      expect(screen.getByText('the Nine-Tailed Fox')).toBeInTheDocument();
    });

    it('renders champion image with correct src', () => {
      render(<ChampionCard champion={mockChampion} />);

      const image = screen.getByAltText('Ahri');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/assets/champion/Ahri.png');
    });

    it('renders champion tags', () => {
      render(<ChampionCard champion={mockChampion} />);

      expect(screen.getByText('Mage')).toBeInTheDocument();
      expect(screen.getByText('Assassin')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders compact variant correctly', () => {
      render(<ChampionCard champion={mockChampion} variant='compact' />);

      expect(screen.getByText('Ahri')).toBeInTheDocument();
      expect(screen.getByText('M7')).toBeInTheDocument();
      expect(screen.getByText('125,674')).toBeInTheDocument();
    });

    it('renders default variant correctly', () => {
      render(<ChampionCard champion={mockChampion} variant='default' />);

      expect(screen.getByText('Ahri')).toBeInTheDocument();
      expect(screen.getByText('the Nine-Tailed Fox')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument(); // Games
      expect(screen.getByText('68.9%')).toBeInTheDocument(); // Win rate
      expect(screen.getByText('2.40')).toBeInTheDocument(); // KDA
    });

    it('renders detailed variant correctly', () => {
      render(<ChampionCard champion={mockChampion} variant='detailed' />);

      expect(screen.getByText('Ahri')).toBeInTheDocument();
      expect(screen.getByText('the Nine-Tailed Fox')).toBeInTheDocument();
      expect(screen.getByText('Performance Stats')).toBeInTheDocument();
      expect(screen.getByText('Mastery Info')).toBeInTheDocument();
      expect(screen.getByText('Difficulty')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('renders loading skeleton when loading is true', () => {
      render(<ChampionCard champion={mockChampion} loading={true} />);

      // Should not render actual content
      expect(screen.queryByText('Ahri')).not.toBeInTheDocument();

      // Should render skeleton
      const skeletons = document.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders different skeleton for different variants', () => {
      const { rerender } = render(
        <ChampionCard
          champion={mockChampion}
          variant='compact'
          loading={true}
        />
      );
      const compactSkeletons = document.querySelectorAll('.skeleton').length;

      rerender(
        <ChampionCard
          champion={mockChampion}
          variant='detailed'
          loading={true}
        />
      );
      const detailedSkeletons = document.querySelectorAll('.skeleton').length;

      expect(detailedSkeletons).toBeGreaterThan(compactSkeletons);
    });
  });

  describe('Stats Display', () => {
    it('calculates win rate correctly', () => {
      render(<ChampionCard champion={mockChampion} />);

      // 31 wins out of 45 games = 68.9%
      expect(screen.getByText('68.9%')).toBeInTheDocument();
    });

    it('displays KDA correctly', () => {
      render(<ChampionCard champion={mockChampion} />);

      expect(screen.getByText('2.40')).toBeInTheDocument();
    });

    it('hides stats when showStats is false', () => {
      render(<ChampionCard champion={mockChampion} showStats={false} />);

      expect(screen.queryByText('68.9%')).not.toBeInTheDocument();
      expect(screen.queryByText('2.40')).not.toBeInTheDocument();
    });
  });

  describe('Mastery Display', () => {
    it('displays mastery level and points', () => {
      render(<ChampionCard champion={mockChampion} />);

      expect(screen.getByText('M7')).toBeInTheDocument();
      expect(screen.getByText('125,674')).toBeInTheDocument();
    });

    it('hides mastery when showMastery is false', () => {
      render(<ChampionCard champion={mockChampion} showMastery={false} />);

      expect(screen.queryByText('M7')).not.toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onClick when clicked', () => {
      const mockOnClick = jest.fn();
      render(<ChampionCard champion={mockChampion} onClick={mockOnClick} />);

      const card = screen.getByText('Ahri').closest('.card');
      expect(card).toHaveClass('cursor-pointer');

      if (card) {
        fireEvent.click(card);
      }
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not have cursor pointer when onClick is not provided', () => {
      render(<ChampionCard champion={mockChampion} />);

      const card = screen.getByText('Ahri').closest('.card');
      expect(card).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Data Combinations', () => {
    it('renders with stats only', () => {
      const statsOnlyChampion: ChampionCardData = {
        championData: mockChampionData,
        stats: mockStats,
      };

      render(<ChampionCard champion={statsOnlyChampion} showMastery={false} />);

      expect(screen.getByText('Ahri')).toBeInTheDocument();
      expect(screen.getByText('68.9%')).toBeInTheDocument();
      expect(screen.queryByText('M7')).not.toBeInTheDocument();
    });

    it('renders with mastery only', () => {
      const masteryOnlyChampion: ChampionCardData = {
        championData: mockChampionData,
        mastery: mockMastery,
      };

      render(<ChampionCard champion={masteryOnlyChampion} showStats={false} />);

      expect(screen.getByText('Ahri')).toBeInTheDocument();
      expect(screen.getByText('M7')).toBeInTheDocument();
      expect(screen.queryByText('68.9%')).not.toBeInTheDocument();
    });

    it('renders with champion data only', () => {
      const basicChampion: ChampionCardData = {
        championData: mockChampionData,
      };

      render(
        <ChampionCard
          champion={basicChampion}
          showStats={false}
          showMastery={false}
        />
      );

      expect(screen.getByText('Ahri')).toBeInTheDocument();
      expect(screen.getByText('the Nine-Tailed Fox')).toBeInTheDocument();
      expect(screen.queryByText('M7')).not.toBeInTheDocument();
      expect(screen.queryByText('68.9%')).not.toBeInTheDocument();
    });
  });

  describe('Difficulty Display', () => {
    it('shows difficulty in detailed variant', () => {
      render(<ChampionCard champion={mockChampion} variant='detailed' />);

      expect(screen.getByText('Difficulty')).toBeInTheDocument();
      expect(screen.getByText('5/10')).toBeInTheDocument();
    });
  });
});
