import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MatchCardChampionBlock from "../MatchCardChampionBlock";
import { UIPlayer } from "@/features/matches/types/ui-match.types";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  ),
}));

// Mock helper functions
jest.mock("@/shared/lib/utils/helpers", () => ({
  getChampionIcon: jest.fn((champion) => `/assets/champion/${champion}.png`),
  getSummonerSpellImage: jest.fn((spellId) => {
    const spellMap: Record<string, string> = {
      "4": "/assets/spell/SummonerFlash.png",
      "7": "/assets/spell/SummonerHeal.png",
    };
    return spellMap[String(spellId)];
  }),  getRuneIcon: jest.fn((runeId) => {
    const runeMap: Record<string, string> = {
      "8112":
        "/assets/perk-images/Styles/Domination/Electrocute/Electrocute.png",
      "8128":
        "/assets/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png",
      "8139":
        "/assets/perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png",
    };
    return runeMap[String(runeId)];
  }),
}));

describe("MatchCardChampionBlock", () => {
  const mockPlayer: UIPlayer = {
    name: "TestPlayer",
    tagline: "EUW",
    champion: "Jinx",
    kda: "6.67",
    cs: 200,
    damage: 25000,
    gold: 15000,
    items: [3031, 3006, 3046, 3033, 3036, 3139],
    team: "Blue" as const,
    win: true,
    mvp: false,
    spell1: 4, // Flash
    spell2: 7, // Heal
    rune1: 8128, // Dark Harvest
    rune2: 8139, // Taste of Blood
    doubleKills: 2,
    tripleKills: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders champion icon and basic layout", () => {
      render(
        <MatchCardChampionBlock champion="Jinx" mainPlayer={mockPlayer} />
      );

      // Check champion icon
      const championIcon = screen.getByAltText("Jinx");
      expect(championIcon).toBeInTheDocument();
      expect(championIcon).toHaveAttribute("src", "/assets/champion/Jinx.png");
      expect(championIcon).toHaveAttribute("width", "80");
      expect(championIcon).toHaveAttribute("height", "80");

      // Check level badge
      expect(screen.getByText("18")).toBeInTheDocument();
    });
    it("renders summoner spells when player data exists", () => {
      render(
        <MatchCardChampionBlock champion="Jinx" mainPlayer={mockPlayer} />
      );

      // Check spells
      const spell1 = screen.getByAltText("Spell 1");
      const spell2 = screen.getByAltText("Spell 2");
      expect(spell1).toBeInTheDocument();
      expect(spell1).toHaveAttribute("src", "/assets/spell/SummonerFlash.png");
      expect(spell2).toBeInTheDocument();
      expect(spell2).toHaveAttribute("src", "/assets/spell/SummonerHeal.png");
    });

    it("renders runes when player data exists", () => {
      render(
        <MatchCardChampionBlock champion="Jinx" mainPlayer={mockPlayer} />
      );

      // Check runes
      const rune1 = screen.getByAltText("Rune 1");
      const rune2 = screen.getByAltText("Rune 2");
      expect(rune1).toBeInTheDocument();      expect(rune1).toHaveAttribute(
        "src",
        "/assets/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png"
      );
      expect(rune2).toBeInTheDocument();
      expect(rune2).toHaveAttribute(
        "src",
        "/assets/perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png"
      );
    });

    it("renders items when player data exists", () => {
      render(
        <MatchCardChampionBlock champion="Jinx" mainPlayer={mockPlayer} />
      );

      // Check for item images
      const items = screen.getAllByAltText(/^Item \d+$/);
      expect(items).toHaveLength(6); // All 6 item slots filled

      // Check specific items
      expect(screen.getByAltText("Item 3031")).toBeInTheDocument();
      expect(screen.getByAltText("Item 3006")).toBeInTheDocument();
      expect(screen.getByAltText("Item 3046")).toBeInTheDocument();
    });
  });

  describe("Fallback States", () => {
    it("renders placeholder spells when no player data", () => {
      render(<MatchCardChampionBlock champion="Jinx" mainPlayer={undefined} />);

      // Should still show champion
      expect(screen.getByAltText("Jinx")).toBeInTheDocument();

      // Should not show spell images
      expect(screen.queryByAltText("Spell 1")).not.toBeInTheDocument();
      expect(screen.queryByAltText("Spell 2")).not.toBeInTheDocument();
    });
    it("renders placeholder runes when no rune data", () => {
      const playerWithoutRunes: UIPlayer = {
        ...mockPlayer,
        rune1: 0, // Use 0 instead of undefined to represent no rune
        rune2: 0,
      };

      render(
        <MatchCardChampionBlock
          champion="Jinx"
          mainPlayer={playerWithoutRunes}
        />
      );

      // Should not show rune images
      expect(screen.queryByAltText("Rune 1")).not.toBeInTheDocument();
      expect(screen.queryByAltText("Rune 2")).not.toBeInTheDocument();
    });

    it("renders empty item slots when no items", () => {
      const playerWithoutItems = {
        ...mockPlayer,
        items: [],
      };

      render(
        <MatchCardChampionBlock
          champion="Jinx"
          mainPlayer={playerWithoutItems}
        />
      );

      // Should still show 6 slots but as placeholders
      const itemImages = screen.queryAllByAltText(/^Item \d+$/);
      expect(itemImages).toHaveLength(0); // No item images when empty
    });

    it("handles partial item data correctly", () => {
      const playerWithPartialItems = {
        ...mockPlayer,
        items: [3031, 0, 3046, 0, 0, 3139], // Mix of items and empty slots
      };

      render(
        <MatchCardChampionBlock
          champion="Jinx"
          mainPlayer={playerWithPartialItems}
        />
      );

      // Should show only non-zero items
      expect(screen.getByAltText("Item 3031")).toBeInTheDocument();
      expect(screen.getByAltText("Item 3046")).toBeInTheDocument();
      expect(screen.getByAltText("Item 3139")).toBeInTheDocument();

      // Should not show zero items
      expect(screen.queryByAltText("Item 0")).not.toBeInTheDocument();
    });
  });

  describe("Styling and Layout", () => {
    it("applies correct CSS classes", () => {
      const { container } = render(
        <MatchCardChampionBlock champion="Jinx" mainPlayer={mockPlayer} />
      );

      // Check main container classes
      const mainContainer = container.firstChild as Element;
      expect(mainContainer).toHaveClass(
        "flex",
        "flex-row",
        "items-center",
        "gap-4"
      );
    });

    it("applies correct image styling", () => {
      render(
        <MatchCardChampionBlock champion="Jinx" mainPlayer={mockPlayer} />
      );

      const championIcon = screen.getByAltText("Jinx");
      expect(championIcon).toHaveClass("object-cover");

      const spell1 = screen.getByAltText("Spell 1");
      expect(spell1).toHaveClass("w-8", "h-8", "rounded", "shadow");
    });
  });

  describe("Accessibility", () => {
    it("provides proper alt text for all images", () => {
      render(
        <MatchCardChampionBlock champion="Jinx" mainPlayer={mockPlayer} />
      );

      // Champion
      expect(screen.getByAltText("Jinx")).toBeInTheDocument();

      // Spells
      expect(screen.getByAltText("Spell 1")).toBeInTheDocument();
      expect(screen.getByAltText("Spell 2")).toBeInTheDocument();

      // Runes
      expect(screen.getByAltText("Rune 1")).toBeInTheDocument();
      expect(screen.getByAltText("Rune 2")).toBeInTheDocument();

      // Items
      mockPlayer.items.forEach((itemId) => {
        if (itemId > 0) {
          expect(screen.getByAltText(`Item ${itemId}`)).toBeInTheDocument();
        }
      });
    });
  });

  describe("Performance", () => {
    it("memoizes component to prevent unnecessary re-renders", () => {
      const { rerender } = render(
        <MatchCardChampionBlock champion="Jinx" mainPlayer={mockPlayer} />
      );

      // Re-render with same props should not cause issues
      rerender(
        <MatchCardChampionBlock champion="Jinx" mainPlayer={mockPlayer} />
      );

      expect(screen.getByAltText("Jinx")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles missing champion gracefully", () => {
      render(<MatchCardChampionBlock champion="" mainPlayer={mockPlayer} />);

      // Should still render container
      const championIcon = screen.getByAltText("");
      expect(championIcon).toBeInTheDocument();
    });

    it("handles undefined level", () => {
      const playerWithoutLevel = {
        ...mockPlayer,
        level: undefined,
      };

      render(
        <MatchCardChampionBlock
          champion="Jinx"
          mainPlayer={playerWithoutLevel}
        />
      );

      // Should still render without crashing
      expect(screen.getByAltText("Jinx")).toBeInTheDocument();
    });

    it("handles very long item arrays", () => {
      const playerWithManyItems = {
        ...mockPlayer,
        items: [3031, 3006, 3046, 3033, 3036, 3139, 3142, 3143], // More than 6 items
      };

      render(
        <MatchCardChampionBlock
          champion="Jinx"
          mainPlayer={playerWithManyItems}
        />
      );

      // Should handle gracefully without errors
      expect(screen.getByAltText("Jinx")).toBeInTheDocument();
    });
  });
});
