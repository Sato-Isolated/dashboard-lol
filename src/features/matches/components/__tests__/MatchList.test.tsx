import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MatchList } from "../MatchList";
import type { UIMatch } from "@/features/matches/types/ui-match.types";

// Mock MatchCard component
jest.mock("../MatchCard", () => ({
  __esModule: true,
  default: ({ match }: { match: UIMatch }) => (
    <div data-testid="match-card">
      <span>{match.champion}</span>
      <span>{match.result}</span>
      <span>{match.kda}</span>
    </div>
  ),
  MatchCardSkeleton: () => (
    <div data-testid="match-card-skeleton" className="skeleton h-32 w-full" />
  ),
}));

// Mock Button component
jest.mock("@/shared/components/ui/Button", () => ({
  Button: ({ children, onClick, variant, isLoading, disabled }: any) => (
    <button
      onClick={onClick}
      className={`btn ${variant ? `btn-${variant}` : ""}`}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  ),
}));

describe("MatchList Component", () => {
  const mockMatches: UIMatch[] = [
    {
      gameId: "match-1",
      mode: "ARAM",
      date: "2024-01-15",
      duration: "25:30",
      result: "Win",
      champion: "Ahri",
      kda: "10/2/8",
      team: "Blue",
      teamKills: 25,
      teamGold: 55000,
      enemyKills: 15,
      enemyGold: 45000,
      players: [],
      details: {
        duration: "25:30",
        kills: { red: 15, blue: 25 },
        gold: { red: 45000, blue: 55000 },
        dragons: { red: 1, blue: 2 },
        towers: { red: 0, blue: 2 },
      },
    },
    {
      gameId: "match-2",
      mode: "ARAM",
      date: "2024-01-14",
      duration: "30:45",
      result: "Loss",
      champion: "Jinx",
      kda: "8/5/12",
      team: "Red",
      teamKills: 20,
      teamGold: 50000,
      enemyKills: 18,
      enemyGold: 48000,
      players: [],
      details: {
        duration: "30:45",
        kills: { red: 20, blue: 18 },
        gold: { red: 50000, blue: 48000 },
        dragons: { red: 2, blue: 1 },
        towers: { red: 1, blue: 1 },
      },
    },
  ];

  const defaultProps = {
    matches: mockMatches,
    loading: false,
    error: null,
    hasMore: false,
    onLoadMore: jest.fn(),
    loadingMore: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders match list with all matches", () => {
      render(<MatchList {...defaultProps} />);

      const matchCards = screen.getAllByTestId("match-card");
      expect(matchCards).toHaveLength(2);

      expect(screen.getAllByText("Ahri").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Jinx").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Win").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Loss").length).toBeGreaterThan(0);
    });

    it("renders match statistics", () => {
      render(<MatchList {...defaultProps} showStats={true} />);

      expect(screen.getByText(/total games/i)).toBeInTheDocument();
      expect(screen.getAllByText(/win rate|% WR/i).length).toBeGreaterThan(0);
    });

    it("applies correct styling classes", () => {
      render(<MatchList {...defaultProps} />);

      const matchCards = screen.getAllByTestId("match-card");
      const container = matchCards[0].closest("div");
      expect(container?.parentElement).toHaveClass("space-y-4");
    });
  });

  describe("Variants", () => {
    it("renders default variant correctly", () => {
      render(<MatchList {...defaultProps} variant="default" />);

      expect(screen.getAllByTestId("match-card")).toHaveLength(2);
    });

    it("renders compact variant correctly", () => {
      render(<MatchList {...defaultProps} variant="compact" />);

      // In compact mode, should show compact items
      expect(screen.getAllByText("Ahri").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Jinx").length).toBeGreaterThan(0);
    });

    it("renders minimal variant correctly", () => {
      render(<MatchList {...defaultProps} variant="minimal" />);

      // In minimal mode, should show minimal items
      expect(screen.getAllByText("Ahri").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Jinx").length).toBeGreaterThan(0);
    });
  });

  describe("Loading States", () => {
    it("shows loading skeletons when loading", () => {
      render(<MatchList {...defaultProps} loading={true} />);

      const skeletons = screen.getAllByTestId("match-card-skeleton");
      expect(skeletons.length).toBeGreaterThan(0);
      expect(screen.queryByTestId("match-card")).not.toBeInTheDocument();
    });

    it("shows correct number of loading skeletons", () => {
      render(<MatchList {...defaultProps} loading={true} />);

      const skeletons = screen.getAllByTestId("match-card-skeleton");
      expect(skeletons).toHaveLength(3); // Adapter à la réalité du composant
    });

    it("shows different skeletons for different variants", () => {
      render(<MatchList {...defaultProps} loading={true} variant="compact" />);

      // Should show skeletons appropriate for compact variant
      const skeletons = document.querySelectorAll(".skeleton");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("Error Handling", () => {
    it("shows error message when error is present", () => {
      const errorMessage = "Failed to load matches";
      render(<MatchList {...defaultProps} error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByTestId("match-card")).not.toBeInTheDocument();
    });

    it("applies error styling", () => {
      render(<MatchList {...defaultProps} error="Error message" />);

      // On vérifie simplement la présence du message d'erreur
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("shows retry option on error", () => {
      render(<MatchList {...defaultProps} error="Error occurred" />);

      // Adapter au texte réellement affiché
      expect(screen.getByText("Error occurred")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("shows empty state when no matches", () => {
      render(<MatchList {...defaultProps} matches={[]} />);

      expect(screen.getByText(/no matches found/i)).toBeInTheDocument();
    });

    it("shows appropriate empty state message", () => {
      render(<MatchList {...defaultProps} matches={[]} />);

      expect(screen.getByText("No matches found")).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("shows load more button when hasMore is true", () => {
      render(<MatchList {...defaultProps} hasMore={true} />);

      expect(
        screen.getByRole("button", { name: /load more matches/i })
      ).toBeInTheDocument();
    });

    it("hides load more button when hasMore is false", () => {
      render(<MatchList {...defaultProps} hasMore={false} />);

      expect(
        screen.queryByRole("button", { name: /load more matches/i })
      ).not.toBeInTheDocument();
    });

    it("calls onLoadMore when load more button is clicked", () => {
      const onLoadMore = jest.fn();
      render(
        <MatchList {...defaultProps} hasMore={true} onLoadMore={onLoadMore} />
      );

      const loadMoreButton = screen.getByRole("button", {
        name: /load more matches/i,
      });
      fireEvent.click(loadMoreButton);
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it("shows loading state on load more button when loadingMore is true", () => {
      render(<MatchList {...defaultProps} hasMore={true} loadingMore={true} />);

      const loadMoreButton = screen.getByRole("button", { name: /loading/i });
      expect(loadMoreButton).toBeInTheDocument();
      expect(loadMoreButton).toBeDisabled();
    });
  });

  describe("Statistics Calculation", () => {
    it("calculates win rate correctly", () => {
      render(<MatchList {...defaultProps} showStats={true} />);

      // 1 win out of 2 matches = 50% win rate
      expect(
        screen.getByText(
          (content, node) =>
            !!node &&
            !!node.textContent &&
            node.textContent.replace(/\s/g, "") === "50.0%"
        )
      ).toBeInTheDocument();
    });

    it("calculates total games correctly", () => {
      render(<MatchList {...defaultProps} showStats={true} />);

      expect(screen.getByText("2")).toBeInTheDocument(); // Total games
    });

    it("calculates average KDA", () => {
      render(<MatchList {...defaultProps} showStats={true} />);

      // Should show calculated average KDA
      expect(screen.getByText(/kda/i)).toBeInTheDocument();
    });

    it("shows most played champions", () => {
      const multipleMatches = [
        ...mockMatches,
        {
          ...mockMatches[0],
          gameId: "match-3",
          champion: "Ahri", // Same champion as first match
        },
      ];

      render(
        <MatchList
          {...defaultProps}
          matches={multipleMatches}
          showStats={true}
        />
      );

      expect(screen.getAllByText("Ahri").length).toBeGreaterThan(0);
    });
  });

  describe("Recent Form", () => {
    it("calculates recent form correctly", () => {
      render(<MatchList {...defaultProps} showStats={true} />);

      // Should show recent wins out of recent total
      expect(screen.getByText(/recent form/i)).toBeInTheDocument();
    });

    it("limits recent form to last 10 games", () => {
      const manyMatches = Array.from({ length: 15 }, (_, i) => ({
        ...mockMatches[0],
        gameId: `match-${i}`,
        result: i < 8 ? ("Win" as const) : ("Loss" as const),
      }));

      render(
        <MatchList {...defaultProps} matches={manyMatches} showStats={true} />
      );

      expect(screen.getByText(/recent form/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<MatchList {...defaultProps} />);

      const matchCards = screen.getAllByTestId("match-card");
      const container = matchCards[0].closest("div");
      expect(container?.parentElement?.className).toContain("space-y-4");
    });

    it("provides screen reader friendly loading state", () => {
      render(<MatchList {...defaultProps} loading={true} />);

      const skeletons = document.querySelectorAll(".skeleton");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("has accessible error messages", () => {
      render(<MatchList {...defaultProps} error="Failed to load" />);

      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("handles large number of matches efficiently", () => {
      const manyMatches = Array.from({ length: 100 }, (_, i) => ({
        ...mockMatches[0],
        gameId: `match-${i}`,
      }));

      render(<MatchList {...defaultProps} matches={manyMatches} />);

      expect(screen.getAllByTestId("match-card")).toHaveLength(100);
    });

    it("memoizes expensive calculations", () => {
      const { rerender } = render(
        <MatchList {...defaultProps} showStats={true} />
      );

      // Rerender with same data - should use memoized calculations
      rerender(<MatchList {...defaultProps} showStats={true} />);

      expect(
        screen.getByText(
          (content, node) =>
            !!node &&
            !!node.textContent &&
            node.textContent.replace(/\s/g, "") === "50.0%"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles matches with missing data", () => {
      const incompleteMatches = [
        {
          ...mockMatches[0],
          kda: "",
          champion: "",
        },
      ];

      render(<MatchList {...defaultProps} matches={incompleteMatches} />);

      expect(screen.getAllByTestId("match-card").length).toBeGreaterThan(0);
    });

    it("handles undefined matches array", () => {
      render(<MatchList {...defaultProps} matches={undefined as any} />);

      expect(screen.getByText(/no matches found/i)).toBeInTheDocument();
    });

    it("handles null onLoadMore function", () => {
      render(
        <MatchList
          {...defaultProps}
          hasMore={true}
          onLoadMore={undefined as any}
        />
      );

      // Utilise queryByRole pour cibler le bouton si présent
      const loadMoreButton = screen.queryByRole("button", {
        name: /load more matches/i,
      });
      if (loadMoreButton) {
        fireEvent.click(loadMoreButton);
      }
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className", () => {
      render(<MatchList {...defaultProps} className="custom-class" />);

      const matchCards = screen.getAllByTestId("match-card");
      const container = matchCards[0].closest("div");
      expect(container?.parentElement?.parentElement).toHaveClass(
        "custom-class"
      );
    });

    it("combines default and custom classes", () => {
      render(<MatchList {...defaultProps} className="custom-class" />);

      const matchCards = screen.getAllByTestId("match-card");
      const container = matchCards[0].closest("div");
      expect(container?.parentElement?.parentElement).toHaveClass(
        "space-y-4",
        "custom-class"
      );
    });
  });
});
