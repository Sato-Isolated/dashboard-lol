import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MatchCardTabs from "../MatchCardTabs";
import { UIMatch, UIPlayer } from "@/features/matches/types/ui-match.types";

// Mock the MatchTeamTable component
jest.mock("../MatchTeamTable", () => {
  return function MockMatchTeamTable({
    players,
    team,
    teamColor,
    teamStats,
  }: {
    players: UIPlayer[];
    team: string;
    teamColor: string;
    teamStats?: { kills: number; gold: number };
  }) {
    return (
      <div data-testid={`team-table-${teamColor}`}>
        <h3>{team}</h3>
        <div>Players: {players.length}</div>
        {teamStats && (
          <div>
            <span>Kills: {teamStats.kills}</span>
            <span>Gold: {teamStats.gold}</span>
          </div>
        )}
      </div>
    );
  };
});

// Mock performance tracking wrapper
jest.mock("@/shared/components/performance/SimplePerformanceWrapper", () => ({
  withPerformanceTracking: (Component: React.ComponentType, name: string) =>
    Component,
}));

const createMockMatch = (): UIMatch => ({
  champion: "Ahri",
  gameId: "test-game-123",
  result: "Win" as const,
  kda: "10/3/15",
  date: "2025-01-15",
  mode: "ARAM",
  duration: "25:30",
  team: "Blue" as const,
  teamKills: 45,
  teamGold: 65000,
  enemyKills: 32,
  enemyGold: 58000,
  players: [],
  details: {
    duration: "25:30",
    gold: {
      red: 58000,
      blue: 65000,
    },
    kills: {
      red: 32,
      blue: 45,
    },
    towers: {
      red: 2,
      blue: 4,
    },
    dragons: {
      red: 1,
      blue: 3,
    },
  },
});

const createMockPlayer = (overrides: Partial<UIPlayer> = {}): UIPlayer => ({
  name: "TestPlayer",
  tagline: "EUW",
  champion: "Ahri",
  team: "Blue" as const,
  kda: "10/3/15",
  items: [1001, 1002, 1003, 0, 0, 0],
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

describe("MatchCardTabs Component", () => {
  const mockSetTab = jest.fn();
  const mockMatch = createMockMatch();
  const mockRedTeam = [
    createMockPlayer({ name: "RedPlayer1", team: "Red", win: false }),
    createMockPlayer({ name: "RedPlayer2", team: "Red", win: false }),
  ];
  const mockBlueTeam = [
    createMockPlayer({ name: "BluePlayer1", team: "Blue", win: true }),
    createMockPlayer({ name: "BluePlayer2", team: "Blue", win: true }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders tab interface correctly", () => {
    render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    // Check for tabs container
    const tabsContainer = document.querySelector(".tabs");
    expect(tabsContainer).toBeInTheDocument();

    // Check for tab inputs
    expect(screen.getByRole("radio", { name: "Overview" })).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Team analysis" })
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Build" })).toBeInTheDocument();
  });

  it("displays overview tab content correctly", () => {
    render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    // Check for team tables
    expect(screen.getByTestId("team-table-red")).toBeInTheDocument();
    expect(screen.getByTestId("team-table-blue")).toBeInTheDocument();

    // Check team names
    expect(screen.getByText("Victory (Red)")).toBeInTheDocument();
    expect(screen.getByText("Defeat (Blue)")).toBeInTheDocument();
  });

  it("switches tabs correctly", () => {
    render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    const teamAnalysisTab = screen.getByRole("radio", {
      name: "Team analysis",
    });
    fireEvent.click(teamAnalysisTab);

    expect(mockSetTab).toHaveBeenCalledWith("team");
  });

  it("displays team analysis content correctly", () => {
    render(
      <MatchCardTabs
        tab="team"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    // Check for team analysis content
    expect(screen.getByText("Duration:")).toBeInTheDocument();
    expect(screen.getByText("Gold:")).toBeInTheDocument();
    expect(screen.getByText("Kills:")).toBeInTheDocument();
    expect(screen.getByText("Towers:")).toBeInTheDocument();
    expect(screen.getByText("Dragons:")).toBeInTheDocument();

    // Check specific values
    expect(screen.getByText("25:30")).toBeInTheDocument();
    expect(screen.getByText("Red 58000")).toBeInTheDocument();
    expect(screen.getByText("Blue 65000")).toBeInTheDocument();
    expect(screen.getByText("Red 32")).toBeInTheDocument();
    expect(screen.getByText("Blue 45")).toBeInTheDocument();
  });

  it("displays build tab content", () => {
    render(
      <MatchCardTabs
        tab="build"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    // Check for build tab placeholder content
    expect(
      screen.getByText(/Build, runes, spells, etc. \(à venir\)/)
    ).toBeInTheDocument();
  });

  it("handles tab changes correctly", () => {
    render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    const buildTab = screen.getByRole("radio", { name: "Build" });
    fireEvent.click(buildTab);

    expect(mockSetTab).toHaveBeenCalledWith("build");
  });

  it("generates unique group ID for each match", () => {
    const { rerender } = render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    const firstTabInput = screen.getByRole("radio", { name: "Overview" });
    const firstGroupName = firstTabInput.getAttribute("name");

    // Rerender with different match
    const differentMatch = { ...mockMatch, gameId: "different-game-456" };
    rerender(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={differentMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    const secondTabInput = screen.getByRole("radio", { name: "Overview" });
    const secondGroupName = secondTabInput.getAttribute("name");

    expect(firstGroupName).not.toBe(secondGroupName);
    expect(firstGroupName).toBe("match_tabs_test-game-123");
    expect(secondGroupName).toBe("match_tabs_different-game-456");
  });

  it("passes correct team stats to team tables", () => {
    render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    const redTeamTable = screen.getByTestId("team-table-red");
    const blueTeamTable = screen.getByTestId("team-table-blue");

    // Check red team stats
    expect(redTeamTable).toHaveTextContent("Kills: 32");
    expect(redTeamTable).toHaveTextContent("Gold: 58000");

    // Check blue team stats
    expect(blueTeamTable).toHaveTextContent("Kills: 45");
    expect(blueTeamTable).toHaveTextContent("Gold: 65000");
  });

  it("displays correct player counts in team tables", () => {
    render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    const redTeamTable = screen.getByTestId("team-table-red");
    const blueTeamTable = screen.getByTestId("team-table-blue");

    expect(redTeamTable).toHaveTextContent("Players: 2");
    expect(blueTeamTable).toHaveTextContent("Players: 2");
  });

  it("has proper tab accessibility attributes", () => {
    render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    const overviewTab = screen.getByRole("radio", { name: "Overview" });
    const teamTab = screen.getByRole("radio", { name: "Team analysis" });
    const buildTab = screen.getByRole("radio", { name: "Build" });

    expect(overviewTab).toHaveAttribute("aria-label", "Overview");
    expect(teamTab).toHaveAttribute("aria-label", "Team analysis");
    expect(buildTab).toHaveAttribute("aria-label", "Build");

    // Check checked state
    expect(overviewTab).toBeChecked();
    expect(teamTab).not.toBeChecked();
    expect(buildTab).not.toBeChecked();
  });

  it("renders correct tab content styling", () => {
    render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach((content) => {
      expect(content).toHaveClass("bg-base-100", "border-base-300", "p-6");
    });
  });

  it("handles empty teams gracefully", () => {
    render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={[]}
        blueTeam={[]}
      />
    );

    const redTeamTable = screen.getByTestId("team-table-red");
    const blueTeamTable = screen.getByTestId("team-table-blue");

    expect(redTeamTable).toHaveTextContent("Players: 0");
    expect(blueTeamTable).toHaveTextContent("Players: 0");
  });

  it("memoizes team stats correctly", () => {
    const { rerender } = render(
      <MatchCardTabs
        tab="overview"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    // Rerender with same match details
    rerender(
      <MatchCardTabs
        tab="team"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    // Component should still display correct team stats
    expect(screen.getByText("Red 32")).toBeInTheDocument();
    expect(screen.getByText("Blue 45")).toBeInTheDocument();
  });

  it("displays towers and dragons stats correctly", () => {
    render(
      <MatchCardTabs
        tab="team"
        setTab={mockSetTab}
        match={mockMatch}
        redTeam={mockRedTeam}
        blueTeam={mockBlueTeam}
      />
    );

    // Check towers
    expect(screen.getByText("Red 2")).toBeInTheDocument();
    expect(screen.getByText("Blue 4")).toBeInTheDocument();

    // Check dragons
    expect(screen.getByText("Red 1")).toBeInTheDocument();
    expect(screen.getByText("Blue 3")).toBeInTheDocument();
  });
});
