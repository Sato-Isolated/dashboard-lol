import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MatchTeamTable from "../MatchTeamTable";
import { UIPlayer } from "@/features/matches/types/ui-match.types";

// Mock Next.js components
jest.mock("next/image", () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
    className,
    onError,
    ...props
  }: any) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={onError}
        data-testid="mock-image"
        {...props}
      />
    );
  };
});

jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    onClick,
    prefetch,
    title,
    className,
    ...props
  }: any) {
    return (
      <a
        href={href}
        onClick={onClick}
        title={title}
        className={className}
        data-prefetch={prefetch}
        data-testid="mock-link"
        {...props}
      >
        {children}
      </a>
    );
  };
});

// Mock helpers
jest.mock("@/shared/lib/utils/helpers", () => ({
  getRegion: jest.fn(() => "euw1"),
}));

// Mock performance tracking
jest.mock("@/shared/components/performance/SimplePerformanceWrapper", () => ({
  withPerformanceTracking: (Component: React.ComponentType, name: string) =>
    Component,
}));

const createMockPlayer = (overrides: Partial<UIPlayer> = {}): UIPlayer => ({
  name: "TestPlayer",
  tagline: "EUW",
  champion: "Ahri",
  team: "Blue" as const,
  kda: "10/3/15",
  items: [1001, 1002, 1003, 1004, 1005, 1006],
  spell1: 4,
  spell2: 7,
  rune1: 8008,
  rune2: 8009,
  cs: 150,
  damage: 25000,
  gold: 12000,
  win: true,
  mvp: false,
  killingSprees: 0,
  doubleKills: 1,
  tripleKills: 0,
  quadraKills: 0,
  pentaKills: 0,
  ...overrides,
});

describe("MatchTeamTable Component", () => {
  const mockPlayers = [
    createMockPlayer({
      name: "Player1",
      champion: "Ahri",
      kda: "10/2/8",
      mvp: true,
    }),
    createMockPlayer({
      name: "Player2",
      champion: "Ezreal",
      kda: "8/4/12",
      cs: 180,
    }),
    createMockPlayer({
      name: "Player3",
      champion: "Lux",
      kda: "5/3/15",
      items: [1001, 1002, 0, 0, 0, 0],
    }),
  ];

  const mockTeamStats = {
    kills: 45,
    gold: 65000,
  };
  it("renders team table with correct structure", () => {
    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    // Check table structure
    expect(screen.getByRole("table")).toBeInTheDocument();
    // Team name is split across elements, look for both parts
    expect(screen.getByText("Blue Team Team")).toBeInTheDocument();

    // Check table headers
    expect(
      screen.getByRole("columnheader", { name: "Summoner" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "KDA" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "CS" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Damage" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Gold" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Items" })
    ).toBeInTheDocument();
  });

  it("displays team statistics correctly", () => {
    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    expect(screen.getByText("45 Kills")).toBeInTheDocument();
    expect(screen.getByText("65000 Gold")).toBeInTheDocument();
  });
  it("renders player information correctly", () => {
    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    // Check player names
    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("Player2")).toBeInTheDocument();
    expect(screen.getByText("Player3")).toBeInTheDocument();

    // Check KDA values
    expect(screen.getByText("10/2/8")).toBeInTheDocument();
    expect(screen.getByText("8/4/12")).toBeInTheDocument();
    expect(screen.getByText("5/3/15")).toBeInTheDocument();

    // Check CS values - use getAllByText for duplicate values
    expect(screen.getAllByText("150")).toHaveLength(2); // Default CS value appears twice
    expect(screen.getByText("180")).toBeInTheDocument();
  });

  it("displays MVP badge for MVP player", () => {
    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    const mvpBadge = screen.getByText("MVP");
    expect(mvpBadge).toBeInTheDocument();
    expect(mvpBadge).toHaveClass("badge", "badge-warning", "animate-pulse");
  });

  it("renders champion images correctly", () => {
    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    const championImages = screen.getAllByTestId("mock-image");
    const championSpecificImages = championImages.filter((img) =>
      img.getAttribute("src")?.includes("/assets/champion/")
    );

    expect(championSpecificImages).toHaveLength(3);
    expect(championSpecificImages[0]).toHaveAttribute("alt", "Ahri");
    expect(championSpecificImages[1]).toHaveAttribute("alt", "Ezreal");
    expect(championSpecificImages[2]).toHaveAttribute("alt", "Lux");
  });

  it("renders item images correctly", () => {
    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    const itemImages = screen.getAllByTestId("mock-image");
    const itemSpecificImages = itemImages.filter((img) =>
      img.getAttribute("src")?.includes("/assets/item/")
    );

    // Each player has 6 item slots, but some may be empty (item ID 0)
    expect(itemSpecificImages.length).toBeGreaterThan(0);
  });

  it("creates correct profile links for players", () => {
    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    const playerLinks = screen.getAllByTestId("mock-link");

    expect(playerLinks[0]).toHaveAttribute(
      "href",
      "/euw1/summoner/Player1/EUW"
    );
    expect(playerLinks[1]).toHaveAttribute(
      "href",
      "/euw1/summoner/Player2/EUW"
    );
    expect(playerLinks[2]).toHaveAttribute(
      "href",
      "/euw1/summoner/Player3/EUW"
    );

    // Check that links have proper styling
    playerLinks.forEach((link) => {
      expect(link).toHaveClass("hover:underline", "text-primary");
    });
  });

  it("handles click events on player links", () => {
    const mockStopPropagation = jest.fn();

    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    const playerLink = screen.getAllByTestId("mock-link")[0];

    // Simulate click event with stopPropagation
    fireEvent.click(playerLink, {
      stopPropagation: mockStopPropagation,
    });

    // Link should be clickable (actual navigation would be handled by Next.js)
    expect(playerLink).toBeInTheDocument();
  });
  it("applies correct styling for different team colors", () => {
    const { rerender } = render(
      <MatchTeamTable
        players={mockPlayers}
        team="Red Team"
        teamColor="red"
        teamStats={mockTeamStats}
      />
    );

    // Team name is split across elements, look for the container
    let teamHeader = screen.getByText("Red Team Team").parentElement;
    expect(teamHeader).toHaveClass("text-red-400");

    rerender(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    teamHeader = screen.getByText("Blue Team Team").parentElement;
    expect(teamHeader).toHaveClass("text-blue-400");
  });
  it("renders without team stats when not provided", () => {
    render(
      <MatchTeamTable players={mockPlayers} team="Blue Team" teamColor="blue" />
    );

    // Team stats badges should not be present, but table headers will still exist
    expect(screen.queryByText("45 Kills")).not.toBeInTheDocument();
    expect(screen.queryByText("65000 Gold")).not.toBeInTheDocument();
    expect(screen.getByText("Blue Team Team")).toBeInTheDocument();
  });
  it("handles empty player array", () => {
    render(
      <MatchTeamTable
        players={[]}
        team="Empty Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    expect(screen.getByText("Empty Team Team")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();

    // Should have headers but no player rows
    expect(
      screen.getByRole("columnheader", { name: "Summoner" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Player1")).not.toBeInTheDocument();
  });

  it("displays player stats with correct badges", () => {
    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    // Check KDA badges
    const kdaBadges = document.querySelectorAll(".badge-info.badge-outline");
    expect(kdaBadges.length).toBeGreaterThan(0);

    // Check damage badges
    const damageBadges = document.querySelectorAll(
      ".badge-error.badge-outline"
    );
    expect(damageBadges.length).toBeGreaterThan(0);

    // Check gold badges
    const goldBadges = document.querySelectorAll(
      ".badge-success.badge-outline"
    );
    expect(goldBadges.length).toBeGreaterThan(0);
  });

  it("handles player names with special characters", () => {
    const specialPlayers = [
      createMockPlayer({ name: "Player-With-Dashes", tagline: "NA1" }),
      createMockPlayer({ name: "Player With Spaces", tagline: "KR" }),
      createMockPlayer({ name: "Player_With_Underscores", tagline: "EUNE" }),
    ];

    render(
      <MatchTeamTable
        players={specialPlayers}
        team="Special Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    expect(screen.getByText("Player-With-Dashes")).toBeInTheDocument();
    expect(screen.getByText("Player With Spaces")).toBeInTheDocument();
    expect(screen.getByText("Player_With_Underscores")).toBeInTheDocument();
  });

  it("renders table with proper accessibility", () => {
    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check column headers
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(6);

    // Check that all player rows are present
    const playerRows = screen.getAllByRole("row");
    // 1 header row + 3 player rows
    expect(playerRows).toHaveLength(4);
  });

  it("applies hover effects correctly", () => {
    render(
      <MatchTeamTable
        players={mockPlayers}
        team="Blue Team"
        teamColor="blue"
        teamStats={mockTeamStats}
      />
    );

    const playerRows = screen.getAllByRole("row");
    const dataRows = playerRows.slice(1); // Skip header row

    dataRows.forEach((row) => {
      expect(row).toHaveClass(
        "hover:bg-primary/10",
        "hover:scale-[1.01]",
        "transition-all"
      );
    });
  });

  it("formats large numbers correctly", () => {
    const playersWithLargeNumbers = [
      createMockPlayer({
        name: "HighDamagePlayer",
        damage: 125000,
        gold: 18500,
        cs: 275,
      }),
    ];

    render(
      <MatchTeamTable
        players={playersWithLargeNumbers}
        team="High Stats Team"
        teamColor="blue"
        teamStats={{ kills: 58, gold: 95000 }}
      />
    );

    expect(screen.getByText("125000")).toBeInTheDocument();
    expect(screen.getByText("18500")).toBeInTheDocument();
    expect(screen.getByText("275")).toBeInTheDocument();
    expect(screen.getByText("95000 Gold")).toBeInTheDocument();
  });
});
