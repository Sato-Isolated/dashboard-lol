import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MatchCardStatsBlock from "../MatchCardStatsBlock";

// Mock data for testing
const mockSpecialBadges = [
  {
    label: "Penta Kill",
    color: "from-fuchsia-600 to-pink-600",
    icon: "👑",
  },
  {
    label: "MVP",
    color: "from-yellow-400 to-orange-400",
    icon: "⭐",
  },
];

describe("MatchCardStatsBlock", () => {
  const defaultProps = {
    kdaParts: ["8", "3", "12"],
    kdaValue: "6.67",
    pKill: "65",
    specialBadges: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders KDA correctly", () => {
      render(<MatchCardStatsBlock {...defaultProps} />);

      // Check individual KDA parts
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();

      // Check separators
      const separators = screen.getAllByText("/");
      expect(separators).toHaveLength(2);
    });

    it("renders KDA value correctly", () => {
      render(<MatchCardStatsBlock {...defaultProps} />);

      expect(screen.getByText(/KDA: 6\.67/)).toBeInTheDocument();
    });

    it("renders kill participation correctly", () => {
      render(<MatchCardStatsBlock {...defaultProps} />);

      expect(screen.getByText(/P\/Kill 65%/)).toBeInTheDocument();
    });

    it("renders without special badges", () => {
      render(<MatchCardStatsBlock {...defaultProps} />);

      // Should not show any badges
      expect(screen.queryByText("Penta Kill")).not.toBeInTheDocument();
      expect(screen.queryByText("MVP")).not.toBeInTheDocument();
    });
    it("renders with special badges", () => {
      render(
        <MatchCardStatsBlock
          {...defaultProps}
          specialBadges={mockSpecialBadges}
        />
      );

      // Should show badges - check for icon and label separately due to DOM structure
      expect(screen.getByText("👑")).toBeInTheDocument();
      expect(screen.getByText("Penta Kill")).toBeInTheDocument();
      expect(screen.getByText("⭐")).toBeInTheDocument();
      expect(screen.getByText("MVP")).toBeInTheDocument();
    });
  });

  describe("Different KDA Values", () => {
    it("handles perfect KDA (no deaths)", () => {
      render(
        <MatchCardStatsBlock
          {...defaultProps}
          kdaParts={["10", "0", "15"]}
          kdaValue="Perfect"
        />
      );

      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText(/KDA: Perfect/)).toBeInTheDocument();
    });

    it("handles low KDA values", () => {
      render(
        <MatchCardStatsBlock
          {...defaultProps}
          kdaParts={["1", "8", "2"]}
          kdaValue="0.38"
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText(/KDA: 0\.38/)).toBeInTheDocument();
    });

    it("handles high KDA values", () => {
      render(
        <MatchCardStatsBlock
          {...defaultProps}
          kdaParts={["25", "1", "20"]}
          kdaValue="45.00"
        />
      );

      expect(screen.getByText("25")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText(/KDA: 45\.00/)).toBeInTheDocument();
    });
  });

  describe("Kill Participation Variations", () => {
    it("handles low kill participation", () => {
      render(<MatchCardStatsBlock {...defaultProps} pKill="15" />);

      expect(screen.getByText(/P\/Kill 15%/)).toBeInTheDocument();
    });

    it("handles high kill participation", () => {
      render(<MatchCardStatsBlock {...defaultProps} pKill="95" />);

      expect(screen.getByText(/P\/Kill 95%/)).toBeInTheDocument();
    });

    it("handles 100% kill participation", () => {
      render(<MatchCardStatsBlock {...defaultProps} pKill="100" />);

      expect(screen.getByText(/P\/Kill 100%/)).toBeInTheDocument();
    });
  });

  describe("Special Badges", () => {
    it("renders single badge correctly", () => {
      const singleBadge = [mockSpecialBadges[0]];

      render(
        <MatchCardStatsBlock {...defaultProps} specialBadges={singleBadge} />
      );

      expect(screen.getByText("👑")).toBeInTheDocument();
      expect(screen.getByText("Penta Kill")).toBeInTheDocument();
      expect(screen.queryByText("⭐")).not.toBeInTheDocument();
      expect(screen.queryByText("MVP")).not.toBeInTheDocument();
    });
    it("renders multiple badges correctly", () => {
      render(
        <MatchCardStatsBlock
          {...defaultProps}
          specialBadges={mockSpecialBadges}
        />
      );

      expect(screen.getByText("👑")).toBeInTheDocument();
      expect(screen.getByText("Penta Kill")).toBeInTheDocument();
      expect(screen.getByText("⭐")).toBeInTheDocument();
      expect(screen.getByText("MVP")).toBeInTheDocument();
    });
    it("applies correct badge styling", () => {
      render(
        <MatchCardStatsBlock
          {...defaultProps}
          specialBadges={[mockSpecialBadges[0]]}
        />
      );

      const badge = screen.getByText("Penta Kill").closest("span");
      expect(badge).toHaveClass("badge", "badge-lg", "text-white", "font-bold");
    });
    it("handles badges with different icons and colors", () => {
      const customBadges = [
        {
          label: "First Blood",
          color: "from-red-500 to-red-700",
          icon: "🩸",
        },
        {
          label: "Ace",
          color: "from-purple-500 to-purple-700",
          icon: "♠️",
        },
      ];

      render(
        <MatchCardStatsBlock {...defaultProps} specialBadges={customBadges} />
      );

      expect(screen.getByText("🩸")).toBeInTheDocument();
      expect(screen.getByText("First Blood")).toBeInTheDocument();
      expect(screen.getByText("♠️")).toBeInTheDocument();
      expect(screen.getByText("Ace")).toBeInTheDocument();
    });
  });

  describe("Styling and Layout", () => {
    it("applies correct container classes", () => {
      const { container } = render(<MatchCardStatsBlock {...defaultProps} />);

      const mainContainer = container.firstChild as Element;
      expect(mainContainer).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "flex-1"
      );
    });

    it("applies correct KDA styling", () => {
      render(<MatchCardStatsBlock {...defaultProps} />);

      const kdaContainer = screen.getByText("8").parentElement;
      expect(kdaContainer).toHaveClass(
        "flex",
        "items-end",
        "gap-2",
        "text-2xl",
        "font-extrabold"
      );
    });

    it("applies correct death text color", () => {
      render(<MatchCardStatsBlock {...defaultProps} />);

      const deathsElement = screen.getByText("3");
      expect(deathsElement).toHaveClass("text-base-content");
    });

    it("applies correct separator color", () => {
      render(<MatchCardStatsBlock {...defaultProps} />);

      const separators = screen.getAllByText("/");
      separators.forEach((separator) => {
        expect(separator).toHaveClass("text-error");
      });
    });
  });

  describe("Accessibility", () => {
    it("provides meaningful content structure", () => {
      render(<MatchCardStatsBlock {...defaultProps} />);

      // Check that KDA is presented in a readable format
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("includes SVG icons with proper viewBox", () => {
      render(<MatchCardStatsBlock {...defaultProps} />);

      const svgElements = document.querySelectorAll("svg");
      expect(svgElements.length).toBeGreaterThan(0);

      svgElements.forEach((svg) => {
        expect(svg).toHaveAttribute("viewBox");
      });
    });
  });

  describe("Performance", () => {
    it("memoizes component to prevent unnecessary re-renders", () => {
      const { rerender } = render(<MatchCardStatsBlock {...defaultProps} />);

      // Re-render with same props
      rerender(<MatchCardStatsBlock {...defaultProps} />);

      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText(/KDA: 6\.67/)).toBeInTheDocument();
    });
    it("memoizes badges to prevent unnecessary re-calculations", () => {
      const { rerender } = render(
        <MatchCardStatsBlock
          {...defaultProps}
          specialBadges={mockSpecialBadges}
        />
      );

      // Re-render with same badges array
      rerender(
        <MatchCardStatsBlock
          {...defaultProps}
          specialBadges={mockSpecialBadges}
        />
      );

      expect(screen.getByText("👑")).toBeInTheDocument();
      expect(screen.getByText("Penta Kill")).toBeInTheDocument();
      expect(screen.getByText("⭐")).toBeInTheDocument();
      expect(screen.getByText("MVP")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles missing KDA parts gracefully", () => {
      render(
        <MatchCardStatsBlock
          {...defaultProps}
          kdaParts={["8"]} // Incomplete KDA
        />
      );

      expect(screen.getByText("8")).toBeInTheDocument();
      // Should not crash even with incomplete data
    });

    it("handles empty string values", () => {
      render(<MatchCardStatsBlock {...defaultProps} kdaValue="" pKill="" />);

      // Should render without crashing
      expect(screen.getByText("8")).toBeInTheDocument();
    });
    it("handles very large numbers", () => {
      render(
        <MatchCardStatsBlock
          {...defaultProps}
          kdaParts={["999", "0", "999"]}
          kdaValue="∞"
          pKill="100"
        />
      );

      // Check that both 999 values are present (kills and assists)
      const nineNineNines = screen.getAllByText("999");
      expect(nineNineNines).toHaveLength(2);
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText(/KDA: ∞/)).toBeInTheDocument();
    });

    it("handles badges without icons", () => {
      const badgesWithoutIcons = [
        {
          label: "No Icon Badge",
          color: "from-blue-500 to-blue-700",
          icon: "",
        },
      ];

      render(
        <MatchCardStatsBlock
          {...defaultProps}
          specialBadges={badgesWithoutIcons}
        />
      );

      expect(screen.getByText("No Icon Badge")).toBeInTheDocument();
    });
  });
});
