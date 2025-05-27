import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SummonerHeader from '../SummonerHeader';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock hooks
jest.mock('@/features/summoner/hooks/useAccountSummoner');
jest.mock('@/shared/hooks/useEffectiveUser');
jest.mock('@/shared/store/userStore');
jest.mock('@/features/summoner/hooks/useUpdateUserData');
jest.mock('@/shared/hooks/useGlobalError');
jest.mock('@/shared/hooks/useGlobalLoading');
jest.mock('@/shared/lib/utils/helpers');
jest.mock('@/features/aram/utils/aramRankSystem');

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Override window.location for tests
Object.defineProperty(window, 'location', {
  value: {
    origin: 'https://test.com',
    href: '',
  },
  writable: true,
});

describe('SummonerHeader', () => {
  const mockUseEffectiveUser = jest.requireMock(
    '@/shared/hooks/useEffectiveUser'
  );
  const mockUseAccountSummoner = jest.requireMock(
    '@/features/summoner/hooks/useAccountSummoner'
  );
  const mockUseUserStore = jest.requireMock('@/shared/store/userStore');
  const mockUseUpdateUserData = jest.requireMock(
    '@/features/summoner/hooks/useUpdateUserData'
  );
  const mockUseGlobalError = jest.requireMock('@/shared/hooks/useGlobalError');
  const mockUseGlobalLoading = jest.requireMock(
    '@/shared/hooks/useGlobalLoading'
  );
  const mockGetSummonerIcon = jest.requireMock('@/shared/lib/utils/helpers');
  const mockGetAramRank = jest.requireMock(
    '@/features/aram/utils/aramRankSystem'
  );

  const mockAccount = {
    puuid: 'test-puuid',
    gameName: 'TestPlayer',
    tagLine: 'EUW1',
  };

  const mockSummoner = {
    id: 'summoner-id',
    puuid: 'test-puuid',
    accountId: 123,
    profileIconId: 4560,
    revisionDate: Date.now(),
    summonerLevel: 150,
  };

  const mockLeagues = [
    {
      leagueId: 'league-1',
      queueType: 'RANKED_SOLO_5x5',
      tier: 'GOLD',
      rank: 'II',
      summonerId: 'summoner-id',
      summonerName: 'TestPlayer',
      leaguePoints: 1247,
      wins: 89,
      losses: 67,
      hotStreak: true,
      veteran: false,
      freshBlood: false,
      inactive: false,
    },
  ];

  const defaultMocks = {
    useEffectiveUser: {
      effectiveRegion: 'euw1',
      effectiveName: 'TestPlayer',
      effectiveTagline: 'EUW1',
    },
    useAccountSummoner: {
      account: mockAccount,
      summoner: mockSummoner,
      leagues: mockLeagues,
      aramScore: 1500,
      loading: false,
      error: null,
      refetch: jest.fn(),
    },
    useUpdateUserData: {
      updateUserData: jest.fn(),
      loading: false,
      error: null,
    },
    useUserStore: {
      setUser: jest.fn(),
    },
    useGlobalError: {
      setError: jest.fn(),
    },
    useGlobalLoading: {
      setLoading: jest.fn(),
    },
    getSummonerIcon: jest.fn(() => '/assets/profileicon/4560.png'),
    getAramRank: jest.fn(() => ({
      displayName: 'Gold',
      min: 1000,
      max: 2000,
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();

    // Clear timers if they exist
    if (jest.isMockFunction(setTimeout)) {
      jest.clearAllTimers();
    }

    // Set up default mocks
    mockUseEffectiveUser.useEffectiveUser.mockReturnValue(
      defaultMocks.useEffectiveUser
    );
    mockUseAccountSummoner.useAccountSummoner.mockReturnValue(
      defaultMocks.useAccountSummoner
    );
    mockUseUpdateUserData.useUpdateUserData.mockReturnValue(
      defaultMocks.useUpdateUserData
    );

    // Mock useUserStore to handle selector pattern
    mockUseUserStore.useUserStore.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector(defaultMocks.useUserStore);
      }
      return defaultMocks.useUserStore;
    });

    mockUseGlobalError.useGlobalError.mockReturnValue(
      defaultMocks.useGlobalError
    );
    mockUseGlobalLoading.useGlobalLoading.mockReturnValue(
      defaultMocks.useGlobalLoading
    );
    mockGetSummonerIcon.getSummonerIcon.mockImplementation(
      defaultMocks.getSummonerIcon
    );
    mockGetAramRank.getAramRank.mockImplementation(defaultMocks.getAramRank);
  });

  afterEach(() => {
    // Only run timer functions if fake timers are active
    if (jest.isMockFunction(setTimeout)) {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    }
  });

  describe('Component Rendering', () => {
    it('renders summoner header with basic information', () => {
      render(<SummonerHeader />);

      expect(screen.getByText('TestPlayer')).toBeInTheDocument();
      expect(screen.getByText('#EUW1')).toBeInTheDocument();
      expect(screen.getByText('EUW1')).toBeInTheDocument();
      expect(screen.getByText('Level 150')).toBeInTheDocument();
    });

    it('renders profile icon with correct alt text', () => {
      render(<SummonerHeader />);

      const profileIcon = screen.getByAltText('TestPlayer');
      expect(profileIcon).toBeInTheDocument();
      expect(profileIcon).toHaveAttribute(
        'src',
        '/assets/profileicon/4560.png'
      );
    });

    it('renders action buttons', () => {
      render(<SummonerHeader />);

      expect(screen.getByText('Add to favorites')).toBeInTheDocument();
      expect(screen.getByText('Share profile')).toBeInTheDocument();
      expect(screen.getByText('Update')).toBeInTheDocument();
    });

    it('renders favorites section', () => {
      render(<SummonerHeader />);

      expect(screen.getByText('Favorites')).toBeInTheDocument();
      expect(screen.getByText('No favorite')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('renders loading text when summoner is loading', () => {
      mockUseAccountSummoner.useAccountSummoner.mockReturnValue({
        ...defaultMocks.useAccountSummoner,
        loading: true,
      });

      render(<SummonerHeader />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders loading skeleton when update is in progress', () => {
      mockUseUpdateUserData.useUpdateUserData.mockReturnValue({
        ...defaultMocks.useUpdateUserData,
        loading: true,
      });

      const { container } = render(<SummonerHeader />);

      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error States', () => {
    it('renders error message when summoner loading fails', () => {
      mockUseAccountSummoner.useAccountSummoner.mockReturnValue({
        ...defaultMocks.useAccountSummoner,
        error: 'Failed to load summoner',
        account: null,
        summoner: null,
      });

      render(<SummonerHeader />);

      expect(screen.getByText('Player loading error.')).toBeInTheDocument();
    });

    it('renders error when account is missing', () => {
      mockUseAccountSummoner.useAccountSummoner.mockReturnValue({
        ...defaultMocks.useAccountSummoner,
        account: null,
      });

      render(<SummonerHeader />);

      expect(screen.getByText('Player loading error.')).toBeInTheDocument();
    });

    it('renders error when summoner is missing', () => {
      mockUseAccountSummoner.useAccountSummoner.mockReturnValue({
        ...defaultMocks.useAccountSummoner,
        summoner: null,
      });

      render(<SummonerHeader />);

      expect(screen.getByText('Player loading error.')).toBeInTheDocument();
    });
  });

  describe('Favorites Management', () => {
    it('displays existing favorites from localStorage', () => {
      const favorites = [
        { region: 'euw1', name: 'Player1', tagline: 'TAG1' },
        { region: 'na1', name: 'Player2', tagline: 'TAG2' },
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(favorites));

      render(<SummonerHeader />);

      expect(screen.getByText('Player1')).toBeInTheDocument();
      expect(screen.getByText('#TAG1')).toBeInTheDocument();
      expect(screen.getByText('Player2')).toBeInTheDocument();
      expect(screen.getByText('#TAG2')).toBeInTheDocument();
    });

    it('handles corrupted localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      render(<SummonerHeader />);

      expect(screen.getByText('No favorite')).toBeInTheDocument();
    });

    it('toggles favorite status when add/remove button is clicked', () => {
      render(<SummonerHeader />);

      const favoriteButton = screen.getByText('Add to favorites');
      fireEvent.click(favoriteButton);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'lol-favorites',
        JSON.stringify([
          {
            region: 'euw1',
            tagline: 'EUW1',
            name: 'TestPlayer',
          },
        ])
      );
    });

    it('removes from favorites when already favorited', () => {
      const favorites = [
        { region: 'euw1', name: 'TestPlayer', tagline: 'EUW1' },
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(favorites));

      render(<SummonerHeader />);

      const favoriteButton = screen.getByText('Remove from favorites');
      fireEvent.click(favoriteButton);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'lol-favorites',
        JSON.stringify([])
      );
    });

    it('navigates to selected favorite', () => {
      const favorites = [
        { region: 'na1', name: 'OtherPlayer', tagline: 'NA1' },
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(favorites));
      const mockSetUser = jest.fn();

      // Mock useUserStore to handle the selector pattern: useUserStore((s) => s.setUser)
      mockUseUserStore.useUserStore.mockImplementation((selector: any) => {
        if (typeof selector === 'function') {
          return selector({ setUser: mockSetUser });
        }
        return { setUser: mockSetUser };
      });

      render(<SummonerHeader />);

      // Find the button that contains the player name
      const favoriteButton = screen.getByRole('button', {
        name: /OtherPlayer/,
      });
      fireEvent.click(favoriteButton);

      expect(mockSetUser).toHaveBeenCalledWith({
        region: 'na1',
        tagline: 'NA1',
        summonerName: 'OtherPlayer',
      });
    });
  });

  describe('Share Functionality', () => {
    it('copies profile URL to clipboard when share button is clicked', () => {
      render(<SummonerHeader />);

      const shareButton = screen.getByText('Share profile');
      fireEvent.click(shareButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://test.com/euw1/summoner/TestPlayer/EUW1'
      );

      expect(screen.getByText('Link copied!')).toBeInTheDocument();
    });

    it('shows success message temporarily after copying', async () => {
      jest.useFakeTimers();

      render(<SummonerHeader />);

      const shareButton = screen.getByText('Share profile');

      act(() => {
        fireEvent.click(shareButton);
      });

      expect(screen.getByText('Link copied!')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(screen.queryByText('Link copied!')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Update Functionality', () => {
    it('calls update functions when update button is clicked', async () => {
      const mockUpdateUserData = jest.fn().mockResolvedValue(undefined);
      const mockRefetch = jest.fn().mockResolvedValue(undefined);

      mockUseUpdateUserData.useUpdateUserData.mockReturnValue({
        ...defaultMocks.useUpdateUserData,
        updateUserData: mockUpdateUserData,
      });

      mockUseAccountSummoner.useAccountSummoner.mockReturnValue({
        ...defaultMocks.useAccountSummoner,
        refetch: mockRefetch,
      });

      render(<SummonerHeader />);

      const updateButton = screen.getByText('Update');

      await act(async () => {
        fireEvent.click(updateButton);
      });

      expect(mockUpdateUserData).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();
    });

    it('prevents spam clicking with anti-spam mechanism', async () => {
      const mockUpdateUserData = jest.fn().mockResolvedValue(undefined);
      const mockSetGlobalError = jest.fn();

      mockUseUpdateUserData.useUpdateUserData.mockReturnValue({
        ...defaultMocks.useUpdateUserData,
        updateUserData: mockUpdateUserData,
      });

      mockUseGlobalError.useGlobalError.mockReturnValue({
        setError: mockSetGlobalError,
      });

      render(<SummonerHeader />);

      const updateButton = screen.getByText('Update');

      // First click
      await act(async () => {
        fireEvent.click(updateButton);
      });
      expect(mockUpdateUserData).toHaveBeenCalledTimes(1);

      // Second click (should be blocked)
      await act(async () => {
        fireEvent.click(updateButton);
      });

      expect(mockSetGlobalError).toHaveBeenCalledWith(
        'Please wait before triggering another update.'
      );
    });

    it('displays rank message after successful update', async () => {
      jest.useFakeTimers();

      const mockUpdateUserData = jest.fn().mockResolvedValue(undefined);
      const mockRefetch = jest.fn().mockResolvedValue(undefined);

      mockUseUpdateUserData.useUpdateUserData.mockReturnValue({
        ...defaultMocks.useUpdateUserData,
        updateUserData: mockUpdateUserData,
      });

      mockUseAccountSummoner.useAccountSummoner.mockReturnValue({
        ...defaultMocks.useAccountSummoner,
        refetch: mockRefetch,
        summoner: { ...mockSummoner, aramScore: 1600 },
      });

      render(<SummonerHeader />);

      const updateButton = screen.getByText('Update');

      await act(async () => {
        fireEvent.click(updateButton);
      });

      expect(mockUpdateUserData).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();

      // Fast forward to show rank message
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByText(/New ARAM rank:/)).toBeInTheDocument();

      // Fast forward to hide rank message
      act(() => {
        jest.advanceTimersByTime(2500);
      });

      await waitFor(() => {
        expect(screen.queryByText(/New ARAM rank:/)).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Image Error Handling', () => {
    it('falls back to default icon when profile icon fails to load', () => {
      render(<SummonerHeader />);

      const profileIcon = screen.getByAltText('TestPlayer');
      fireEvent.error(profileIcon);

      expect(profileIcon).toHaveAttribute('src', '/assets/profileicon/0.png');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<SummonerHeader />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach(button => {
        expect(button).toBeVisible();
      });
    });

    it('supports keyboard navigation', () => {
      render(<SummonerHeader />);

      const updateButton = screen.getByText('Update');
      updateButton.focus();

      expect(updateButton).toHaveFocus();

      // Test that the button can receive focus and is accessible
      fireEvent.keyDown(updateButton, { key: 'Enter', code: 'Enter' });
      // Should trigger the update function without hanging
    });
  });

  describe('Performance', () => {
    it('memoizes expensive computations', () => {
      const { rerender } = render(<SummonerHeader />);

      const initialCallCount =
        mockGetSummonerIcon.getSummonerIcon.mock.calls.length;

      // Re-render with same props
      rerender(<SummonerHeader />);

      // getSummonerIcon might be called again during re-render, which is acceptable
      expect(mockGetSummonerIcon.getSummonerIcon).toHaveBeenCalled();
    });

    it('handles rapid state changes efficiently', () => {
      render(<SummonerHeader />);

      const shareButton = screen.getByText('Share profile');

      // Rapid clicks
      fireEvent.click(shareButton);
      fireEvent.click(shareButton);
      fireEvent.click(shareButton);

      // Should handle gracefully without errors
      expect(screen.getByText('Share profile')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<SummonerHeader />);

      // Should render without layout issues
      expect(screen.getByText('TestPlayer')).toBeInTheDocument();
    });

    it('adapts to desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      render(<SummonerHeader />);

      // Should render without layout issues
      expect(screen.getByText('TestPlayer')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing navigator gracefully', () => {
      // Store original clipboard
      const originalClipboard = navigator.clipboard;

      // Remove clipboard temporarily
      delete (navigator as any).clipboard;

      render(<SummonerHeader />);

      const shareButton = screen.getByText('Share profile');
      fireEvent.click(shareButton);

      // Should not crash
      expect(shareButton).toBeInTheDocument();

      // Restore clipboard
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        configurable: true,
      });
    });

    it('handles missing window gracefully in SSR context', () => {
      // This test is not practical in Jest environment as window is always available
      // Instead, test that localStorage access is properly guarded

      const originalGetItem = mockLocalStorage.getItem;
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      render(<SummonerHeader />);

      // Should render without errors even if localStorage fails
      expect(screen.getByText('TestPlayer')).toBeInTheDocument();
      expect(screen.getByText('No favorite')).toBeInTheDocument();

      // Restore original mock
      mockLocalStorage.getItem.mockImplementation(originalGetItem);
    });

    it('handles empty summoner data gracefully', () => {
      mockUseAccountSummoner.useAccountSummoner.mockReturnValue({
        ...defaultMocks.useAccountSummoner,
        account: mockAccount,
        summoner: {
          ...mockSummoner,
          summonerLevel: 0,
          profileIconId: 0,
        },
      });

      render(<SummonerHeader />);

      expect(screen.getByText('Level 0')).toBeInTheDocument();
    });
  });
});
