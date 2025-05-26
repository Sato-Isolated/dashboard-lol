import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SummonerSearch from "../SummonerSearch";
import { PlatformRegion } from "@/shared/types/api/platformregion.types";
import { act } from "@testing-library/react";

// Mock the Button component
jest.mock("@/shared/components/ui/Button", () => {
  return {
    Button: ({ children, onClick, disabled, isLoading, ...props }: any) => (
      <button onClick={onClick} disabled={disabled || isLoading} {...props}>
        {isLoading ? "Loading..." : children}
      </button>
    ),
  };
});

// Mock lucide-react
jest.mock("lucide-react", () => ({
  Search: () => <span data-testid="search-icon">🔍</span>,
}));

// Mock fetch for suggestions
global.fetch = jest.fn();

describe("SummonerSearch", () => {
  const mockOnSearch = jest.fn();

  const defaultProps = {
    onSearch: mockOnSearch,
    initialSummonerName: "",
    initialTagline: "",
    initialRegion: PlatformRegion.EUW1,
    placeholder: "Summoner Name",
    compact: false,
    showRegionSelect: true,
  };
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
    // Provide a default mock implementation to prevent TypeError
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  describe("Component Rendering", () => {
    it("renders search form with all inputs", () => {
      render(<SummonerSearch {...defaultProps} />);

      expect(screen.getByPlaceholderText("Summoner Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Tag")).toBeInTheDocument();
      expect(screen.getByDisplayValue("euw1")).toBeInTheDocument();
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    it("renders with initial values", () => {
      render(
        <SummonerSearch
          {...defaultProps}
          initialSummonerName="TestPlayer"
          initialTagline="EUW1"
          initialRegion={PlatformRegion.NA1}
        />
      );

      expect(screen.getByDisplayValue("TestPlayer")).toBeInTheDocument();
      expect(screen.getByDisplayValue("EUW1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("na1")).toBeInTheDocument();
    });

    it("renders compact variant", () => {
      render(<SummonerSearch {...defaultProps} compact={true} />);

      const form = screen.getByTestId("summoner-search-form");
      expect(form).toHaveClass("compact");
    });

    it("hides region select when showRegionSelect is false", () => {
      render(<SummonerSearch {...defaultProps} showRegionSelect={false} />);

      expect(screen.queryByDisplayValue("euw1")).not.toBeInTheDocument();
    });

    it("uses custom placeholder", () => {
      render(
        <SummonerSearch {...defaultProps} placeholder="Enter player name" />
      );

      expect(
        screen.getByPlaceholderText("Enter player name")
      ).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("updates summoner name on input change", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "TestPlayer");

      expect(nameInput).toHaveValue("TestPlayer");
    });

    it("updates tagline on input change", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const taglineInput = screen.getByPlaceholderText("Tag");
      await user.type(taglineInput, "EUW1");

      expect(taglineInput).toHaveValue("EUW1");
    });

    it("updates region on select change", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const regionSelect = screen.getByDisplayValue("euw1");
      await user.selectOptions(regionSelect, "na1");

      expect(regionSelect).toHaveValue("na1");
    });

    it("trims leading whitespace from inputs", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "  TestPlayer");

      expect(nameInput).toHaveValue("TestPlayer");
    });
  });

  describe("Form Submission", () => {
    it("calls onSearch with valid inputs", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      const taglineInput = screen.getByPlaceholderText("Tag");
      const submitButton = screen.getByRole("button");

      await user.type(nameInput, "TestPlayer");
      await user.type(taglineInput, "EUW1");
      await user.click(submitButton);

      expect(mockOnSearch).toHaveBeenCalledWith(
        "TestPlayer",
        "EUW1",
        PlatformRegion.EUW1
      );
    });

    it("shows error when summoner name is empty", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const taglineInput = screen.getByPlaceholderText("Tag");
      const submitButton = screen.getByRole("button");

      await user.type(taglineInput, "EUW1");
      await user.click(submitButton);

      expect(
        screen.getByText("Please fill in both summoner name and tagline.")
      ).toBeInTheDocument();
      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it("shows error when tagline is empty", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      const submitButton = screen.getByRole("button");

      await user.type(nameInput, "TestPlayer");
      await user.click(submitButton);

      expect(
        screen.getByText("Please fill in both summoner name and tagline.")
      ).toBeInTheDocument();
      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it("clears error state when user starts typing", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const submitButton = screen.getByRole("button");
      await user.click(submitButton);

      expect(
        screen.getByText("Please fill in both summoner name and tagline.")
      ).toBeInTheDocument();

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "T");

      expect(
        screen.queryByText("Please fill in both summoner name and tagline.")
      ).not.toBeInTheDocument();
    });

    it("handles form submission via Enter key", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      const taglineInput = screen.getByPlaceholderText("Tag");

      await user.type(nameInput, "TestPlayer");
      await user.type(taglineInput, "EUW1");
      await user.keyboard("{Enter}");

      expect(mockOnSearch).toHaveBeenCalledWith(
        "TestPlayer",
        "EUW1",
        PlatformRegion.EUW1
      );
    });
  });

  describe("Suggestions Functionality", () => {
    const mockSuggestions = [
      { name: "TestPlayer1", tagline: "EUW1", region: "euw1" },
      { name: "TestPlayer2", tagline: "NA1", region: "na1" },
    ];

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSuggestions),
      });
    });

    it("fetches suggestions when typing 2+ characters", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "Te");

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/summoner/search?q=Te",
          expect.any(Object)
        );
      });
    }, 10000);

    it("does not fetch suggestions for less than 2 characters", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "T");

      expect(global.fetch).not.toHaveBeenCalled();
    }, 10000);

    it("displays suggestions when available", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "Test");
      await user.click(nameInput); // Focus to show suggestions

      await waitFor(() => {
        expect(screen.getByText("TestPlayer1")).toBeInTheDocument();
        expect(screen.getByText("TestPlayer2")).toBeInTheDocument();
      });
    }, 10000);

    it("selects suggestion on click", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} disableClickOutside />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "Test");
      await user.click(nameInput);

      // Log la valeur de l'input avant la suggestion
      console.log(
        "Avant la suggestion, input:",
        (nameInput as HTMLInputElement).value
      );

      const suggestion = await screen.findByText("TestPlayer1");
      // Log la présence de la suggestion
      console.log("Suggestion trouvée:", !!suggestion);

      await user.click(suggestion);

      // Log la valeur de l'input juste après le clic
      console.log(
        "Après clic suggestion, input:",
        (nameInput as HTMLInputElement).value
      );

      await Promise.resolve();
      await Promise.resolve();

      // Log la valeur juste avant l'assertion
      console.log(
        "Avant assertion, input:",
        (nameInput as HTMLInputElement).value
      );

      await waitFor(() => expect(nameInput).toHaveValue("TestPlayer1"));
      await waitFor(() =>
        expect(screen.getByPlaceholderText("Tag")).toHaveValue("EUW1")
      );
      await waitFor(() =>
        expect(screen.getByDisplayValue("euw1")).toBeInTheDocument()
      );
    }, 10000);

    it("navigates suggestions with keyboard", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "Test");

      await waitFor(() => {
        expect(screen.getByText("TestPlayer1")).toBeInTheDocument();
      });

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(nameInput).toHaveValue("TestPlayer2");
    }, 10000);

    it("handles suggestion fetch errors gracefully", async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "Test");

      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    }, 10000);

    it("closes suggestions when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <SummonerSearch {...defaultProps} />
          <div data-testid="outside">Outside</div>
        </div>
      );

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "Test");

      await waitFor(() => {
        expect(screen.getByText("TestPlayer1")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("outside"));

      await waitFor(() => {
        expect(screen.queryByText("TestPlayer1")).not.toBeInTheDocument();
      });
    }, 10000);

    it("debounces suggestion requests", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SummonerSearch {...defaultProps} />);
      const nameInput = screen.getByPlaceholderText("Summoner Name");

      // Saisie rapide, sans attendre entre chaque frappe
      await user.type(nameInput, "Test");

      // Avance le timer de 300ms (déclenche le fetch pour "Test" uniquement)
      await act(async () => {
        jest.advanceTimersByTime(300);
        await Promise.resolve();
        await Promise.resolve();
      });

      // On attend que le fetch soit appelé pour "Test"
      await waitFor(() => {
        expect(
          (global.fetch as jest.Mock).mock.calls.some(([url]) =>
            url.includes("Test")
          )
        ).toBe(true);
      });

      // On vérifie qu'il n'y a qu'un seul fetch (pour "Test")
      expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);

      jest.useRealTimers();
    }, 10000);
  });

  describe("Loading States", () => {
    it("disables inputs and button during loading", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      const taglineInput = screen.getByPlaceholderText("Tag");
      const regionSelect = screen.getByDisplayValue("euw1");
      const submitButton = screen.getByRole("button");

      await user.type(nameInput, "TestPlayer");
      await user.type(taglineInput, "EUW1");

      // Mock loading state
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise(() => {})
      );

      await user.click(submitButton);

      expect(nameInput).toBeDisabled();
      expect(taglineInput).toBeDisabled();
      expect(regionSelect).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it("shows loading state in button", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      const taglineInput = screen.getByPlaceholderText("Tag");
      const submitButton = screen.getByRole("button");

      await user.type(nameInput, "TestPlayer");
      await user.type(taglineInput, "EUW1");

      // Mock loading state
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise(() => {})
      );

      await user.click(submitButton);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper labels and ARIA attributes", () => {
      render(<SummonerSearch {...defaultProps} />);

      expect(screen.getByLabelText("Summoner Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Tagline")).toBeInTheDocument();
      expect(screen.getByLabelText("Region")).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");

      await user.tab();
      expect(nameInput).toHaveFocus();

      await user.tab();
      expect(screen.getByPlaceholderText("Tag")).toHaveFocus();

      await user.tab();
      expect(screen.getByDisplayValue("euw1")).toHaveFocus();
    });

    it("announces errors to screen readers", async () => {
      const user = userEvent.setup();
      render(<SummonerSearch {...defaultProps} />);

      const submitButton = screen.getByRole("button");
      await user.click(submitButton);

      const errorMessage = screen.getByText(
        "Please fill in both summoner name and tagline."
      );
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute("role", "alert");
    });
  });

  describe("Performance", () => {
    it("debounces suggestion requests", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SummonerSearch {...defaultProps} />);
      const nameInput = screen.getByPlaceholderText("Summoner Name");

      // Saisie rapide, sans attendre entre chaque frappe
      await user.type(nameInput, "Test");

      // Avance le timer de 300ms (déclenche le fetch pour "Test" uniquement)
      await act(async () => {
        jest.advanceTimersByTime(300);
        await Promise.resolve();
        await Promise.resolve();
      });

      // On attend que le fetch soit appelé pour "Test"
      await waitFor(() => {
        expect(
          (global.fetch as jest.Mock).mock.calls.some(([url]) =>
            url.includes("Test")
          )
        ).toBe(true);
      });

      // On vérifie qu'il n'y a qu'un seul fetch (pour "Test")
      expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);

      jest.useRealTimers();
    }, 10000);

    it("cancels previous requests when new ones are made", async () => {
      const user = userEvent.setup();
      const abortMock = jest.fn();
      const mockController = {
        abort: abortMock,
        signal: { aborted: false },
      };

      global.AbortController = jest.fn(() => mockController) as any;

      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");

      await user.type(nameInput, "Te");
      await user.type(nameInput, "st");

      expect(abortMock).toHaveBeenCalled();
    }, 10000);

    it("debounce minimal test", async () => {
      jest.useFakeTimers();
      console.log("Début du test debounce minimal");
      render(<SummonerSearch {...defaultProps} />);
      console.log("Après render");
    }, 10000);
  });

  describe("Edge Cases", () => {
    it("handles empty suggestion response", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "NonExistent");

      await act(async () => {
        jest.advanceTimersByTime(300);
        await Promise.resolve();
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Should not show any suggestions
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

      jest.useRealTimers();
    }, 10000);

    it("handles malformed suggestion data", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ invalid: "data" }),
      });

      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "Test");

      await act(async () => {
        jest.advanceTimersByTime(300);
        await Promise.resolve();
        await Promise.resolve();
      });

      // Should handle gracefully without crashing
      expect(nameInput).toBeInTheDocument();

      jest.useRealTimers();
    }, 10000);

    it("resets highlighted index when suggestions change", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SummonerSearch {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Summoner Name");
      await user.type(nameInput, "Test");

      await act(async () => {
        jest.advanceTimersByTime(300);
        await Promise.resolve();
        await Promise.resolve();
      });

      await user.keyboard("{ArrowDown}"); // Highlight first suggestion

      await user.clear(nameInput);
      await user.type(nameInput, "Other");

      await act(async () => {
        jest.advanceTimersByTime(300);
        await Promise.resolve();
        await Promise.resolve();
      });

      // Highlighted index should reset
      expect(screen.queryByText("TestPlayer1")).not.toBeInTheDocument();

      jest.useRealTimers();
    }, 10000);
  });

  describe("Region Variants", () => {
    it("includes all available regions in select", () => {
      render(<SummonerSearch {...defaultProps} />);

      const regionSelect = screen.getByDisplayValue("euw1");
      const options = Array.from(regionSelect.querySelectorAll("option"));

      expect(options.length).toBeGreaterThan(1);
      expect(options.some((option) => option.value === "na1")).toBe(true);
      expect(options.some((option) => option.value === "kr")).toBe(true);
    });

    it("formats region display names correctly", () => {
      render(<SummonerSearch {...defaultProps} />);

      const regionSelect = screen.getByDisplayValue("euw1");
      const options = Array.from(regionSelect.querySelectorAll("option"));

      options.forEach((option) => {
        expect(option.textContent).toBe(option.value);
      });
    });
  });
});
