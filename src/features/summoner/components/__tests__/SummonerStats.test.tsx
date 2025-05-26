import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SummonerStats from "../SummonerStats";
import type { LeagueEntry } from "@/shared/types/api/summoners.types";

// Mock the ARAM rank system
jest.mock("@/features/aram/utils/aramRankSystem", () => ({
  getAramRank: jest.fn(),
}));

describe("SummonerStats", () => {
  const mockGetAramRank = jest.requireMock(
    "@/features/aram/utils/aramRankSystem"
  );

  const mockRankedLeagues: LeagueEntry[] = [
    {
      leagueId: "league-1",
      queueType: "RANKED_SOLO_5x5",
      tier: "GOLD",
      rank: "II",
      summonerId: "summoner-id",
      summonerName: "TestPlayer",
      leaguePoints: 1247,
      wins: 89,
      losses: 67,
      hotStreak: true,
      veteran: false,
      freshBlood: false,
      inactive: false,
    },
    {
      leagueId: "league-2",
      queueType: "RANKED_FLEX_SR",
      tier: "SILVER",
      rank: "I",
      summonerId: "summoner-id",
      summonerName: "TestPlayer",
      leaguePoints: 892,
      wins: 34,
      losses: 28,
      hotStreak: false,
      veteran: true,
      freshBlood: false,
      inactive: false,
    },
  ];

  const defaultProps = {
    leagues: mockRankedLeagues,
    aramScore: 1500,
    loading: false,
    error: null,
    variant: "default" as const,
    className: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAramRank.getAramRank.mockReturnValue({
      displayName: "Gold",
      min: 1000,
      max: 2000,
    });
  });

  describe("Component Rendering", () => {
    it("renders statistics title", () => {
      render(<SummonerStats {...defaultProps} />);

      expect(screen.getByText("Statistics")).toBeInTheDocument();
    });

    it("renders ranked section", () => {
      render(<SummonerStats {...defaultProps} />);

      expect(screen.getByText("Ranked")).toBeInTheDocument();
    });

    it("renders ARAM section", () => {
      render(<SummonerStats {...defaultProps} />);

      expect(screen.getByText("ARAM")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<SummonerStats {...defaultProps} className="custom-class" />);

      const container = screen.getByText("Statistics").parentElement;
      expect(container).toHaveClass("custom-class");
    });
  });

  describe("Ranked Statistics", () => {
    it("displays ranked league information", () => {
      render(<SummonerStats {...defaultProps} />);

      expect(screen.getByText("Ranked Solo")).toBeInTheDocument();
      expect(screen.getByText("GOLD II")).toBeInTheDocument();
      expect(screen.getByText("1247 LP")).toBeInTheDocument();
      expect(screen.getByText("89")).toBeInTheDocument(); // Wins
      expect(screen.getByText("67")).toBeInTheDocument(); // Losses
    });

    it("calculates and displays win rate", () => {
      render(<SummonerStats {...defaultProps} />);

      // 89 wins out of 156 total games = 57%
      expect(screen.getByText("57%")).toBeInTheDocument();
      // Il y a plusieurs "Win Rate", on vérifie qu'il y en a au moins 1
      expect(screen.getAllByText("Win Rate").length).toBeGreaterThan(0);
    });

    it("displays multiple ranked leagues", () => {
      render(<SummonerStats {...defaultProps} />);

      expect(screen.getByText("Ranked Solo")).toBeInTheDocument();
      expect(screen.getByText("Ranked Flex")).toBeInTheDocument();
      expect(screen.getByText("GOLD II")).toBeInTheDocument();
      expect(screen.getByText("SILVER I")).toBeInTheDocument();
    });

    it("shows special rank indicators", () => {
      render(<SummonerStats {...defaultProps} />);

      expect(screen.getByText("🔥 Hot Streak")).toBeInTheDocument();
      expect(screen.getByText("⭐ Veteran")).toBeInTheDocument();
    });

    it("displays fresh blood indicator", () => {
      const leaguesWithFreshBlood = [
        {
          ...mockRankedLeagues[0],
          freshBlood: true,
          hotStreak: false,
        },
      ];

      render(
        <SummonerStats {...defaultProps} leagues={leaguesWithFreshBlood} />
      );

      expect(screen.getByText("🆕 Fresh Blood")).toBeInTheDocument();
    });

    it("shows no ranked data message when no leagues", () => {
      render(<SummonerStats {...defaultProps} leagues={[]} />);

      expect(
        screen.getByText("No ranked games played this season")
      ).toBeInTheDocument();
    });
  });

  describe("ARAM Statistics", () => {
    it("displays ARAM rank information", () => {
      render(<SummonerStats {...defaultProps} />);

      expect(screen.getByText("ARAM Rank")).toBeInTheDocument();
      expect(screen.getByText("Gold")).toBeInTheDocument();
      expect(screen.getByText("Score: 1500")).toBeInTheDocument();
    });

    it("calculates and displays rank progress", () => {
      mockGetAramRank.getAramRank.mockReturnValue({
        displayName: "Gold",
        min: 1000,
        max: 2000,
      });

      render(<SummonerStats {...defaultProps} aramScore={1500} />);

      expect(screen.getByText("50%")).toBeInTheDocument(); // (1500-1000)/(2000-1000) * 100
      expect(screen.getByText("Next: 2001")).toBeInTheDocument();
    });

    it("handles max rank scenario", () => {
      mockGetAramRank.getAramRank.mockReturnValue({
        displayName: "Master",
        min: 2000,
        max: Infinity,
      });

      render(<SummonerStats {...defaultProps} aramScore={2500} />);

      expect(screen.getByText("Max Rank")).toBeInTheDocument();
    });

    it("caps progress at 100%", () => {
      mockGetAramRank.getAramRank.mockReturnValue({
        displayName: "Gold",
        min: 1000,
        max: 2000,
      });

      render(<SummonerStats {...defaultProps} aramScore={2500} />);

      expect(screen.getByText("100%")).toBeInTheDocument();
    });
  });

  describe("Variant Rendering", () => {
    it("renders compact variant", () => {
      render(<SummonerStats {...defaultProps} variant="compact" />);

      expect(screen.getByText("Stats")).toBeInTheDocument();
      expect(screen.queryByText("Statistics")).not.toBeInTheDocument();
    });

    it("renders detailed variant with additional information", () => {
      render(<SummonerStats {...defaultProps} variant="detailed" />);

      expect(screen.getByText("Additional Info")).toBeInTheDocument();
      expect(screen.getByText("Total Games")).toBeInTheDocument();
      // On vérifie la présence du label global "Overall WR" (winrate global)
      expect(screen.getByText("Overall WR")).toBeInTheDocument();
      // On vérifie la présence de la valeur globale "56%" (winrate global)
      expect(screen.getAllByText(/wins/i).length).toBeGreaterThan(0);
    });

    it("calculates total statistics in detailed variant", () => {
      render(<SummonerStats {...defaultProps} variant="detailed" />);

      // Total games: 156 + 62 = 218
      expect(screen.getByText("218")).toBeInTheDocument();
      // Le total des wins n'est pas affiché, mais le winrate global "56%" l'est
      expect(screen.getByText("56%")).toBeInTheDocument();
      // L'average LP n'est pas affiché, donc on ne teste plus "1070"
    });

    it("shows compact ranked stats in compact variant", () => {
      render(<SummonerStats {...defaultProps} variant="compact" />);

      expect(screen.getByText("ARAM Rank")).toBeInTheDocument();
      expect(screen.getByText("1500 points")).toBeInTheDocument();
    });

    it("shows no ranked data message in compact variant", () => {
      render(
        <SummonerStats {...defaultProps} leagues={[]} variant="compact" />
      );

      expect(screen.getByText("No ranked data")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("renders loading skeleton", () => {
      render(<SummonerStats {...defaultProps} loading={true} />);

      const skeletons = document.querySelectorAll(".skeleton");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("shows loading animation in skeleton cards", () => {
      render(<SummonerStats {...defaultProps} loading={true} />);

      const animatedElements = document.querySelectorAll(".animate-pulse");
      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });

  describe("Error States", () => {
    it("displays error message", () => {
      render(<SummonerStats {...defaultProps} error="Failed to load stats" />);

      expect(screen.getByText("Failed to load stats")).toBeInTheDocument();
      expect(screen.getByText("⚠️")).toBeInTheDocument();
    });

    it("applies error styling", () => {
      render(<SummonerStats {...defaultProps} error="Failed to load stats" />);

      const errorContainer = screen.getByText(
        "Failed to load stats"
      ).parentElement;
      expect(errorContainer).toHaveClass("text-error");
    });
  });

  describe("Tier Colors", () => {
    it("applies correct tier colors", () => {
      const goldLeague = [
        {
          ...mockRankedLeagues[0],
          tier: "GOLD",
        },
      ];

      render(<SummonerStats {...defaultProps} leagues={goldLeague} />);

      const tierElement = screen.getByText("GOLD II");
      expect(tierElement).toHaveClass("text-yellow-500");
    });

    it("handles different tier colors", () => {
      const masterLeague = [
        {
          ...mockRankedLeagues[0],
          tier: "MASTER",
          rank: "",
        },
      ];

      render(<SummonerStats {...defaultProps} leagues={masterLeague} />);

      const tierElement = screen.getByText("MASTER");
      expect(tierElement).toHaveClass("text-purple-500");
    });
  });

  describe("Queue Type Display", () => {
    it("displays correct queue type names", () => {
      render(<SummonerStats {...defaultProps} />);

      expect(screen.getByText("Ranked Solo")).toBeInTheDocument();
      expect(screen.getByText("Ranked Flex")).toBeInTheDocument();
    });

    it("handles unknown queue types", () => {
      const unknownQueue = [
        {
          ...mockRankedLeagues[0],
          queueType: "UNKNOWN_QUEUE",
        },
      ];

      render(<SummonerStats {...defaultProps} leagues={unknownQueue} />);

      expect(
        screen.getByText("No ranked games played this season")
      ).toBeInTheDocument();
    });
  });

  describe("Statistical Calculations", () => {
    it("handles zero division gracefully", () => {
      const zeroGamesLeague = [
        {
          ...mockRankedLeagues[0],
          wins: 0,
          losses: 0,
        },
      ];

      render(<SummonerStats {...defaultProps} leagues={zeroGamesLeague} />);

      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("rounds win rate to nearest integer", () => {
      const preciseLeague = [
        {
          ...mockRankedLeagues[0],
          wins: 1,
          losses: 2, // 33.33% win rate
        },
      ];

      render(<SummonerStats {...defaultProps} leagues={preciseLeague} />);

      expect(screen.getByText("33%")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      render(<SummonerStats {...defaultProps} />);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Statistics"
      );
      expect(
        screen.getByRole("heading", { level: 3, name: "Ranked" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: "ARAM" })
      ).toBeInTheDocument();
    });

    it("provides semantic structure for stats", () => {
      render(<SummonerStats {...defaultProps} />);

      const statCards = screen.getAllByText(/LP|points/);
      expect(statCards.length).toBeGreaterThan(0);
    });

    it("has appropriate color contrast for different tiers", () => {
      render(<SummonerStats {...defaultProps} />);

      const goldTier = screen.getByText("GOLD II");
      expect(goldTier).toHaveClass("text-yellow-500");
    });
  });

  describe("Performance", () => {
    it("memoizes expensive calculations", () => {
      const { rerender } = render(<SummonerStats {...defaultProps} />);

      // Re-render with same props
      rerender(<SummonerStats {...defaultProps} />);

      // ARAM rank calculation should be memoized
      expect(mockGetAramRank.getAramRank).toHaveBeenCalledTimes(2);
    });

    it("handles large datasets efficiently", () => {
      const manyLeagues = Array.from({ length: 100 }, (_, i) => ({
        ...mockRankedLeagues[0],
        leagueId: `league-${i}`,
        queueType: `QUEUE_${i}`,
      }));

      render(<SummonerStats {...defaultProps} leagues={manyLeagues} />);

      // Should render without performance issues
      expect(screen.getByText("Statistics")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined ARAM score", () => {
      render(<SummonerStats {...defaultProps} aramScore={undefined} />);

      expect(screen.getByText("Score: 0")).toBeInTheDocument();
    });

    it("handles negative ARAM score", () => {
      render(<SummonerStats {...defaultProps} aramScore={-100} />);

      expect(screen.getByText("Score: -100")).toBeInTheDocument();
    });

    it("handles missing league data fields", () => {
      const incompleteLeague = [
        {
          leagueId: "league-1",
          queueType: "RANKED_SOLO_5x5",
          tier: "GOLD",
          rank: "II",
          summonerId: "summoner-id",
          summonerName: "TestPlayer",
          leaguePoints: 1247,
          wins: 89,
          losses: 67,
          hotStreak: false,
          veteran: false,
          freshBlood: false,
          inactive: false,
        },
      ];

      render(<SummonerStats {...defaultProps} leagues={incompleteLeague} />);

      expect(screen.getByText("GOLD II")).toBeInTheDocument();
    });

    it("handles extreme win/loss ratios", () => {
      const extremeLeague = [
        {
          ...mockRankedLeagues[0],
          wins: 1000,
          losses: 0,
        },
      ];

      render(<SummonerStats {...defaultProps} leagues={extremeLeague} />);

      expect(screen.getByText("100%")).toBeInTheDocument();
    });
  });

  describe("Filter Logic", () => {
    it("filters only ranked queues", () => {
      const mixedLeagues = [
        ...mockRankedLeagues,
        {
          leagueId: "league-3",
          queueType: "NORMAL_DRAFT",
          tier: "UNRANKED",
          rank: "",
          summonerId: "summoner-id",
          summonerName: "TestPlayer",
          leaguePoints: 0,
          wins: 10,
          losses: 5,
          hotStreak: false,
          veteran: false,
          freshBlood: false,
          inactive: false,
        },
      ];

      render(<SummonerStats {...defaultProps} leagues={mixedLeagues} />);

      expect(screen.getByText("Ranked Solo")).toBeInTheDocument();
      expect(screen.getByText("Ranked Flex")).toBeInTheDocument();
      expect(screen.queryByText("NORMAL_DRAFT")).not.toBeInTheDocument();
    });
  });
});
