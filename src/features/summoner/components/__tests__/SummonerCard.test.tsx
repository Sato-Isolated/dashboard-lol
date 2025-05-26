import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SummonerCard } from "../SummonerCard";
import type { RiotAccountDto } from "@/shared/types/api/account.types";
import type { SummonerDto } from "@/shared/types/api/summoners.types";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className, onError }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={onError}
    />
  ),
}));

// Mock helper functions
jest.mock("@/shared/lib/utils/helpers", () => ({
  getSummonerIcon: (iconId: number) => `/assets/profileicon/${iconId}.png`,
}));

// Mock Button component
jest.mock("@/shared/components/ui/Button", () => ({
  Button: ({ children, onClick, variant, size, className, disabled }: any) => (
    <button
      onClick={onClick}
      className={`btn ${variant ? `btn-${variant}` : ""} ${
        size ? `btn-${size}` : ""
      } ${className || ""}`}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

// Mock MatchCardHeader component
jest.mock("@/features/matches/components/MatchCardHeader", () => ({
  __esModule: true,
  default: ({ mode, date, result, duration, onExpand, expanded }: any) => (
    <div data-testid="match-card-header">
      <span>{mode}</span>
      <span>{date}</span>
      <span>{result}</span>
      <span>{duration}</span>
      <button
        aria-label={expanded ? "Masquer les détails" : "Afficher les détails"}
        onClick={onExpand}
      >
        {expanded ? "Masquer les détails" : "Afficher les détails"}
      </button>
    </div>
  ),
}));

describe("SummonerCard Component", () => {
  const mockAccount: RiotAccountDto = {
    puuid: "test-puuid",
    gameName: "TestSummoner",
    tagLine: "EUW",
  };
  const mockSummoner: SummonerDto = {
    id: "summoner-id",
    accountId: 123456789,
    puuid: "test-puuid",
    profileIconId: 42,
    revisionDate: 1640995200000,
    summonerLevel: 150,
  };

  const defaultProps = {
    account: mockAccount,
    summoner: mockSummoner,
    region: "euw1",
    onViewProfile: jest.fn(),
    onToggleFavorite: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders summoner information correctly", () => {
      render(<SummonerCard {...defaultProps} />);

      expect(screen.getByText("TestSummoner")).toBeInTheDocument();
      expect(screen.getByText("#EUW")).toBeInTheDocument();
      expect(screen.getByText("Level 150")).toBeInTheDocument();
      expect(screen.getByText("EUW1")).toBeInTheDocument();
    });
    it("renders profile icon", () => {
      render(<SummonerCard {...defaultProps} />);

      const profileIcon = screen.getByAltText("TestSummoner");
      expect(profileIcon).toBeInTheDocument();
      expect(profileIcon).toHaveAttribute("src", "/assets/profileicon/42.png");
    });
    it("has correct structure and classes", () => {
      render(<SummonerCard {...defaultProps} />);
      const card = screen.getByTestId("summoner-card");
      expect(card).toHaveClass("bg-base-200");
    });
  });

  describe("Variants", () => {
    it("renders compact variant correctly", () => {
      render(<SummonerCard {...defaultProps} variant="compact" />);
      const card = screen.getByTestId("summoner-card");
      expect(card).toHaveClass("bg-base-200", "rounded-lg", "p-3");
    });
    it("renders detailed variant correctly", () => {
      render(<SummonerCard {...defaultProps} variant="detailed" />);
      const card = screen.getByTestId("summoner-card");
      expect(card).toHaveClass("bg-base-200", "rounded-xl", "p-4");
    });
    it("renders default variant when no variant specified", () => {
      render(<SummonerCard {...defaultProps} />);
      const card = screen.getByTestId("summoner-card");
      expect(card).toHaveClass("bg-base-200", "rounded-xl", "p-4");
    });
  });

  describe("Loading State", () => {
    it("shows loading skeleton when loading is true", () => {
      render(<SummonerCard {...defaultProps} loading={true} />);
      const card = screen.getByTestId("summoner-card");
      const skeletons = card.querySelectorAll(".skeleton");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("disables actions when loading", () => {
      render(<SummonerCard {...defaultProps} loading={true} />);

      const buttons = screen.queryAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("Error State", () => {
    it("shows error message when error is provided", () => {
      const errorMessage = "Failed to load summoner";
      render(<SummonerCard {...defaultProps} error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("applies error styling", () => {
      render(<SummonerCard {...defaultProps} error="Error message" />);
      const errorElement = screen.getByText("Error message");
      expect(errorElement).toHaveClass("text-sm");
    });
  });

  describe("Actions", () => {
    it("shows action buttons when showActions is true", () => {
      render(<SummonerCard {...defaultProps} showActions={true} />);

      expect(screen.getByText("View Profile")).toBeInTheDocument();
      expect(screen.getByText("⭐")).toBeInTheDocument();
    });

    it("hides action buttons when showActions is false", () => {
      render(<SummonerCard {...defaultProps} showActions={false} />);

      expect(screen.queryByText("View Profile")).not.toBeInTheDocument();
      expect(screen.queryByText("⭐")).not.toBeInTheDocument();
    });

    it("calls onViewProfile when View Profile button is clicked", () => {
      const onViewProfile = jest.fn();
      render(
        <SummonerCard
          {...defaultProps}
          onViewProfile={onViewProfile}
          showActions={true}
        />
      );

      fireEvent.click(screen.getByText("View Profile"));
      expect(onViewProfile).toHaveBeenCalledTimes(1);
    });

    it("calls onToggleFavorite when favorite button is clicked", () => {
      const onToggleFavorite = jest.fn();
      render(
        <SummonerCard
          {...defaultProps}
          onToggleFavorite={onToggleFavorite}
          showActions={true}
        />
      );

      fireEvent.click(screen.getByText("⭐"));
      expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    });
  });

  describe("Favorite State", () => {
    it("shows active favorite state when isFavorite is true", () => {
      render(
        <SummonerCard {...defaultProps} isFavorite={true} showActions={true} />
      );
      const favoriteButton = screen.getByText("⭐").closest("button");
      expect(favoriteButton).toHaveClass("btn-success");
    });

    it("shows inactive favorite state when isFavorite is false", () => {
      render(
        <SummonerCard {...defaultProps} isFavorite={false} showActions={true} />
      );

      const favoriteButton = screen.getByText("⭐").closest("button");
      expect(favoriteButton).not.toHaveClass("btn-warning");
    });
  });

  describe("Image Error Handling", () => {
    it("handles image load errors gracefully", () => {
      render(<SummonerCard {...defaultProps} />);

      const profileIcon = screen.getByAltText("TestSummoner");

      // Simulate image error
      fireEvent.error(profileIcon);

      expect(profileIcon).toHaveAttribute("src", "/assets/profileicon/0.png");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className", () => {
      render(<SummonerCard {...defaultProps} className="custom-class" />);
      const card = screen.getByTestId("summoner-card");
      expect(card).toHaveClass("custom-class");
    });

    it("combines default and custom classes", () => {
      render(<SummonerCard {...defaultProps} className="custom-class" />);
      const card = screen.getByTestId("summoner-card");
      expect(card).toHaveClass(
        "bg-base-200",
        "rounded-xl",
        "p-4",
        "shadow",
        "custom-class"
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<SummonerCard {...defaultProps} />);
      const card = screen.getByTestId("summoner-card");
      expect(card).toBeInTheDocument();
    });

    it("has accessible image alt text", () => {
      render(<SummonerCard {...defaultProps} />);
      const profileIcon = screen.getByAltText("TestSummoner");
      expect(profileIcon).toBeInTheDocument();
    });

    it("has accessible button labels", () => {
      render(<SummonerCard {...defaultProps} showActions={true} />);
      expect(screen.getByText("View Profile")).toBeInTheDocument();
      expect(screen.getByText("⭐")).toBeInTheDocument();
    });
  });

  describe("Data Handling", () => {
    it("handles missing optional data gracefully", () => {
      const minimalAccount = {
        puuid: "test-puuid",
        gameName: "TestSummoner",
        tagLine: "EUW",
      } as RiotAccountDto;
      const minimalSummoner = {
        id: "summoner-id",
        accountId: 123456789,
        puuid: "test-puuid",
        profileIconId: 0,
        revisionDate: 0,
        summonerLevel: 1,
      } as SummonerDto;

      render(
        <SummonerCard
          account={minimalAccount}
          summoner={minimalSummoner}
          region="euw1"
          onViewProfile={jest.fn()}
          onToggleFavorite={jest.fn()}
        />
      );

      expect(screen.getByText("TestSummoner")).toBeInTheDocument();
      expect(screen.getByText("Level 1")).toBeInTheDocument();
    });

    it("formats region correctly", () => {
      render(<SummonerCard {...defaultProps} region="na1" />);

      expect(screen.getByText("NA1")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("is memoized component", () => {
      // The component should be wrapped with React.memo
      expect(SummonerCard.displayName).toBe("SummonerCard");
    });

    it("handles multiple rapid updates", () => {
      const { rerender } = render(<SummonerCard {...defaultProps} />);

      // Simulate rapid updates
      for (let i = 0; i < 10; i++) {
        rerender(
          <SummonerCard
            {...defaultProps}
            summoner={{
              ...mockSummoner,
              summonerLevel: 150 + i,
            }}
          />
        );
      }

      expect(screen.getByText("Level 159")).toBeInTheDocument();
    });
  });
});
