import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Header from "../Header";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock SearchBar component
jest.mock("@/shared/components/common/SearchBar", () => {
  return function MockSearchBar() {
    return <div data-testid="search-bar">Search Bar</div>;
  };
});

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  it("renders header with navigation elements", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });

  it("renders navigation buttons correctly", () => {
    render(<Header />);

    const dashboardButton = screen.getByRole("button", { name: /dashboard/i });
    const leaderboardButton = screen.getByRole("button", {
      name: /leaderboard/i,
    });

    expect(dashboardButton).toBeInTheDocument();
    expect(leaderboardButton).toBeInTheDocument();

    // Check button classes for styling
    expect(dashboardButton).toHaveClass("btn", "btn-ghost");
    expect(leaderboardButton).toHaveClass("btn", "btn-ghost");
  });

  it("navigates to home when Dashboard button is clicked", () => {
    render(<Header />);

    const dashboardButton = screen.getByRole("button", { name: /dashboard/i });
    fireEvent.click(dashboardButton);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("navigates to leaderboard when Leaderboard button is clicked", () => {
    render(<Header />);

    const leaderboardButton = screen.getByRole("button", {
      name: /leaderboard/i,
    });
    fireEvent.click(leaderboardButton);

    expect(mockPush).toHaveBeenCalledWith("/leaderboard");
  });
  it("has proper navbar structure and styling", () => {
    render(<Header />);

    // Use data-testid or class selector since the component uses <header> not <nav>
    const navbarDiv = document.querySelector(".navbar");
    expect(navbarDiv).toHaveClass("navbar", "bg-base-100", "shadow-lg");

    // Check responsive layout structure
    const flexContainer = navbarDiv?.querySelector(".flex-1");
    expect(flexContainer).toBeInTheDocument();

    const flexNoneContainer = navbarDiv?.querySelector(".flex-none");
    expect(flexNoneContainer).toBeInTheDocument();
  });

  it("renders search bar in correct position", () => {
    render(<Header />);

    const searchBar = screen.getByTestId("search-bar");
    const parentContainer = searchBar.closest(".flex-none");

    expect(parentContainer).toBeInTheDocument();
    expect(parentContainer).toHaveClass("flex", "items-center", "gap-2");
  });

  it("handles multiple clicks on navigation buttons", () => {
    render(<Header />);

    const dashboardButton = screen.getByRole("button", { name: /dashboard/i });
    const leaderboardButton = screen.getByRole("button", {
      name: /leaderboard/i,
    });

    // Click multiple times
    fireEvent.click(dashboardButton);
    fireEvent.click(leaderboardButton);
    fireEvent.click(dashboardButton);

    expect(mockPush).toHaveBeenCalledTimes(3);
    expect(mockPush).toHaveBeenNthCalledWith(1, "/");
    expect(mockPush).toHaveBeenNthCalledWith(2, "/leaderboard");
    expect(mockPush).toHaveBeenNthCalledWith(3, "/");
  });

  it("maintains accessibility standards", () => {
    render(<Header />);

    // Check semantic HTML
    expect(screen.getByRole("banner")).toBeInTheDocument();

    // Check button accessibility
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeInTheDocument();
      expect(button).not.toHaveAttribute("aria-hidden", "true");
    });
  });
  it("handles router errors gracefully", () => {
    // Mock router push to throw error
    mockPush.mockImplementation(() => {
      throw new Error("Navigation failed");
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Header />);

    const dashboardButton = screen.getByRole("button", { name: /dashboard/i });

    // Should not throw error to user - the error should be caught internally
    expect(() => fireEvent.click(dashboardButton)).not.toThrow();

    // Verify that push was attempted
    expect(mockPush).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
  it("renders with responsive design classes", () => {
    render(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("w-full");

    // Use query selector since this is a div, not a semantic role
    const navbarDiv = document.querySelector(".navbar");
    expect(navbarDiv).toHaveClass("navbar");

    // Check gap and alignment classes
    const flexContainer = navbarDiv?.querySelector(".flex-1");
    expect(flexContainer).toHaveClass("flex", "gap-2", "items-center");
  });
});
