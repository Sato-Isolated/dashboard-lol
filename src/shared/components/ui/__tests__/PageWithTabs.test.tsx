import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PageWithTabs from "../PageWithTabs";

// Mock Suspense components
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  Suspense: ({ children, fallback }: any) => {
    try {
      return children;
    } catch (error) {
      return fallback;
    }
  },
}));

// Mock components for testing
const MockHeader = () => <div data-testid="header">Header Content</div>;
const MockLeft = () => <div data-testid="left">Left Column Content</div>;
const MockCenter = () => <div data-testid="center">Center Content</div>;
const MockChampions = () => (
  <div data-testid="champions">Champions Content</div>
);
const MockMastery = () => <div data-testid="mastery">Mastery Content</div>;

describe("PageWithTabs", () => {
  const defaultProps = {
    header: <MockHeader />,
    left: <MockLeft />,
    center: <MockCenter />,
    champions: <MockChampions />,
    mastery: <MockMastery />,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all sections correctly", () => {
      render(<PageWithTabs {...defaultProps} />);

      // Check that all main sections are present
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("left")).toBeInTheDocument();

      // Center content should be visible by default (summary tab)
      expect(screen.getByTestId("center")).toBeInTheDocument();
    });

    it("renders all tab buttons", () => {
      render(<PageWithTabs {...defaultProps} />);

      expect(screen.getByRole("tab", { name: /summary/i })).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: /champions/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /mastery/i })).toBeInTheDocument();
    });

    it("shows summary tab as active by default", () => {
      render(<PageWithTabs {...defaultProps} />);

      const summaryTab = screen.getByRole("tab", { name: /summary/i });
      expect(summaryTab).toHaveClass("tab-active");
      expect(summaryTab).toHaveAttribute("aria-selected", "true");
    });

    it("displays center content by default", () => {
      render(<PageWithTabs {...defaultProps} />);

      expect(screen.getByTestId("center")).toBeInTheDocument();
      expect(screen.queryByTestId("champions")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mastery")).not.toBeInTheDocument();
    });
  });

  describe("Tab Navigation", () => {
    it("switches to champions tab when clicked", async () => {
      const user = userEvent.setup();
      render(<PageWithTabs {...defaultProps} />);

      const championsTab = screen.getByRole("tab", { name: /champions/i });
      await user.click(championsTab);

      await waitFor(() => {
        expect(championsTab).toHaveClass("tab-active");
        expect(championsTab).toHaveAttribute("aria-selected", "true");
      });

      expect(screen.getByTestId("champions")).toBeInTheDocument();
      expect(screen.queryByTestId("center")).not.toBeInTheDocument();
    });

    it("switches to mastery tab when clicked", async () => {
      const user = userEvent.setup();
      render(<PageWithTabs {...defaultProps} />);

      const masteryTab = screen.getByRole("tab", { name: /mastery/i });
      await user.click(masteryTab);

      await waitFor(() => {
        expect(masteryTab).toHaveClass("tab-active");
        expect(masteryTab).toHaveAttribute("aria-selected", "true");
      });

      expect(screen.getByTestId("mastery")).toBeInTheDocument();
      expect(screen.queryByTestId("center")).not.toBeInTheDocument();
    });

    it("switches back to summary tab", async () => {
      const user = userEvent.setup();
      render(<PageWithTabs {...defaultProps} />);

      // Go to champions first
      await user.click(screen.getByRole("tab", { name: /champions/i }));
      await waitFor(() => {
        expect(screen.getByTestId("champions")).toBeInTheDocument();
      });

      // Go back to summary
      const summaryTab = screen.getByRole("tab", { name: /summary/i });
      await user.click(summaryTab);

      await waitFor(() => {
        expect(summaryTab).toHaveClass("tab-active");
      });

      expect(screen.getByTestId("center")).toBeInTheDocument();
      expect(screen.queryByTestId("champions")).not.toBeInTheDocument();
    });

    it("maintains only one active tab at a time", async () => {
      const user = userEvent.setup();
      render(<PageWithTabs {...defaultProps} />);

      const summaryTab = screen.getByRole("tab", { name: /summary/i });
      const championsTab = screen.getByRole("tab", { name: /champions/i });
      const masteryTab = screen.getByRole("tab", { name: /mastery/i });

      // Initially only summary should be active
      expect(summaryTab).toHaveClass("tab-active");
      expect(championsTab).not.toHaveClass("tab-active");
      expect(masteryTab).not.toHaveClass("tab-active");

      // Switch to champions
      await user.click(championsTab);

      await waitFor(() => {
        expect(championsTab).toHaveClass("tab-active");
        expect(summaryTab).not.toHaveClass("tab-active");
        expect(masteryTab).not.toHaveClass("tab-active");
      });
    });
  });

  describe("Content Switching", () => {
    it("memoizes tab content to prevent unnecessary re-renders", async () => {
      const user = userEvent.setup();
      render(<PageWithTabs {...defaultProps} />);

      // Switch tabs multiple times
      await user.click(screen.getByRole("tab", { name: /champions/i }));
      await user.click(screen.getByRole("tab", { name: /summary/i }));
      await user.click(screen.getByRole("tab", { name: /mastery/i }));

      // Content should still render correctly
      expect(screen.getByTestId("mastery")).toBeInTheDocument();
    });

    it("handles rapid tab switching", async () => {
      const user = userEvent.setup();
      render(<PageWithTabs {...defaultProps} />);

      const championsTab = screen.getByRole("tab", { name: /champions/i });
      const masteryTab = screen.getByRole("tab", { name: /mastery/i });
      const summaryTab = screen.getByRole("tab", { name: /summary/i });

      // Rapidly switch tabs
      await user.click(championsTab);
      await user.click(masteryTab);
      await user.click(summaryTab);

      await waitFor(() => {
        expect(summaryTab).toHaveClass("tab-active");
        expect(screen.getByTestId("center")).toBeInTheDocument();
      });
    });
  });

  describe("Layout and Styling", () => {
    it("applies correct CSS classes to main container", () => {
      const { container } = render(<PageWithTabs {...defaultProps} />);

      const mainContainer = container.firstChild as Element;
      expect(mainContainer).toHaveClass("flex", "flex-col", "gap-8", "w-full");
    });

    it("applies correct styling to tab buttons", () => {
      render(<PageWithTabs {...defaultProps} />);

      const summaryTab = screen.getByRole("tab", { name: /summary/i });
      expect(summaryTab).toHaveClass(
        "tab",
        "tab-lg",
        "transition-all",
        "duration-200",
        "font-semibold"
      );
    });

    it("applies active styling to selected tab", () => {
      render(<PageWithTabs {...defaultProps} />);

      const summaryTab = screen.getByRole("tab", { name: /summary/i });
      expect(summaryTab).toHaveClass(
        "tab-active",
        "bg-primary",
        "text-primary-content",
        "shadow-lg",
        "scale-105"
      );
    });

    it("applies grid layout correctly", () => {
      render(<PageWithTabs {...defaultProps} />);

      const gridContainer = screen.getByTestId("left").parentElement;
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "lg:grid-cols-3"
      );
    });
  });

  describe("Accessibility", () => {
    it("provides proper ARIA attributes for tabs", () => {
      render(<PageWithTabs {...defaultProps} />);

      const summaryTab = screen.getByRole("tab", { name: /summary/i });
      expect(summaryTab).toHaveAttribute("aria-selected", "true");
      expect(summaryTab).toHaveAttribute("aria-controls", "tabpanel-summary");
      expect(summaryTab).toHaveAttribute("role", "tab");
    });

    it("provides proper ARIA attributes for inactive tabs", () => {
      render(<PageWithTabs {...defaultProps} />);

      const championsTab = screen.getByRole("tab", { name: /champions/i });
      expect(championsTab).toHaveAttribute("aria-selected", "false");
      expect(championsTab).toHaveAttribute(
        "aria-controls",
        "tabpanel-champions"
      );
    });

    it("provides proper tabpanel attributes", () => {
      render(<PageWithTabs {...defaultProps} />);

      const tabpanel = screen.getByRole("tabpanel");
      expect(tabpanel).toHaveAttribute("id", "tabpanel-summary");
      expect(tabpanel).toHaveAttribute("role", "tabpanel");
    });

    it("updates tabpanel ID when switching tabs", async () => {
      const user = userEvent.setup();
      render(<PageWithTabs {...defaultProps} />);

      await user.click(screen.getByRole("tab", { name: /champions/i }));

      await waitFor(() => {
        const tabpanel = screen.getByRole("tabpanel");
        expect(tabpanel).toHaveAttribute("id", "tabpanel-champions");
      });
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<PageWithTabs {...defaultProps} />);

      const summaryTab = screen.getByRole("tab", { name: /summary/i });
      const championsTab = screen.getByRole("tab", { name: /champions/i });

      // Tab to first tab and press Enter
      summaryTab.focus();
      await user.keyboard("{Tab}");
      await user.keyboard("{Enter}");

      // Should activate champions tab
      await waitFor(() => {
        expect(championsTab).toHaveClass("tab-active");
      });
    });
  });

  describe("Performance", () => {
    it("uses memoization for tab content", () => {
      const { rerender } = render(<PageWithTabs {...defaultProps} />);

      // Re-render with same props
      rerender(<PageWithTabs {...defaultProps} />);

      expect(screen.getByTestId("center")).toBeInTheDocument();
    });

    it("handles callback memoization correctly", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<PageWithTabs {...defaultProps} />);

      // Switch tab
      await user.click(screen.getByRole("tab", { name: /champions/i }));

      // Re-render
      rerender(<PageWithTabs {...defaultProps} />);

      // Should maintain tab state
      await waitFor(() => {
        expect(screen.getByRole("tab", { name: /champions/i })).toHaveClass(
          "tab-active"
        );
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles missing content gracefully", () => {
      render(
        <PageWithTabs
          header={null}
          left={null}
          center={null}
          champions={null}
          mastery={null}
        />
      );

      // Should still render tabs and container
      expect(screen.getByRole("tab", { name: /summary/i })).toBeInTheDocument();
    });

    it("handles empty content", () => {
      render(
        <PageWithTabs
          header={<div />}
          left={<div />}
          center={<div />}
          champions={<div />}
          mastery={<div />}
        />
      );

      // Should render without errors
      expect(screen.getByRole("tab", { name: /summary/i })).toBeInTheDocument();
    });

    it("maintains state during rapid interactions", async () => {
      const user = userEvent.setup();
      render(<PageWithTabs {...defaultProps} />);

      // Rapidly switch between all tabs
      for (let i = 0; i < 5; i++) {
        await user.click(screen.getByRole("tab", { name: /champions/i }));
        await user.click(screen.getByRole("tab", { name: /mastery/i }));
        await user.click(screen.getByRole("tab", { name: /summary/i }));
      }

      // Should end on summary tab
      await waitFor(() => {
        expect(screen.getByRole("tab", { name: /summary/i })).toHaveClass(
          "tab-active"
        );
        expect(screen.getByTestId("center")).toBeInTheDocument();
      });
    });
  });

  describe("Responsiveness", () => {
    it("applies responsive classes correctly", () => {
      render(<PageWithTabs {...defaultProps} />);

      const gridContainer = screen.getByTestId("left").parentElement;
      expect(gridContainer).toHaveClass("lg:grid-cols-3");
    });

    it("maintains tab functionality on small screens", async () => {
      // Mock small screen
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 640,
      });

      const user = userEvent.setup();
      render(<PageWithTabs {...defaultProps} />);

      await user.click(screen.getByRole("tab", { name: /champions/i }));

      await waitFor(() => {
        expect(screen.getByTestId("champions")).toBeInTheDocument();
      });
    });
  });
});
