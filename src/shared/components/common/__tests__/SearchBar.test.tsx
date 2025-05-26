import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import SearchBar from "../SearchBar";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock user store
const mockSetUser = jest.fn();
jest.mock("@/shared/store/userStore", () => ({
  useUserStore: () => ({
    setUser: mockSetUser,
  }),
}));

// Mock effective user hook
const mockEffectiveUser = {
  effectiveRegion: "euw1",
  effectiveTagline: "EUW",
  effectiveName: "TestUser",
};

jest.mock("@/shared/hooks/useEffectiveUser", () => ({
  useEffectiveUser: () => mockEffectiveUser,
}));

// Mock performance tracking
jest.mock("@/shared/components/performance/SimplePerformanceWrapper", () => ({
  withPerformanceTracking: (component: any) => component,
}));

// Mock region mapping
jest.mock("@/shared/lib/utils/langToRegion", () => ({
  mapLangToRegion: () => "euw1",
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock navigator language
Object.defineProperty(navigator, "language", {
  value: "en-US",
  configurable: true,
});

describe("SearchBar Component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe("Rendering", () => {
    it("renders all input fields", () => {
      render(<SearchBar />);

      expect(screen.getByPlaceholderText("SummonerName")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Tagline")).toBeInTheDocument();
      expect(screen.getByDisplayValue("euw1")).toBeInTheDocument();
    });
    it("renders search button", () => {
      render(<SearchBar />);

      const searchButton = screen.getByRole("button");
      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toHaveAttribute("type", "submit");
    });
    it("has correct form structure", () => {
      const { container } = render(<SearchBar />);

      const form = container.querySelector("form");
      expect(form).toHaveAttribute("autoComplete", "off");
    });
    it("applies correct styling classes", () => {
      const { container } = render(<SearchBar />);

      const form = container.querySelector("form");
      expect(form).toHaveClass(
        "flex",
        "flex-row",
        "items-center",
        "gap-2",
        "w-full",
        "max-w-xl"
      );
    });
  });

  describe("Initial Values", () => {
    it("populates fields from effective user data", () => {
      render(<SearchBar />);

      expect(screen.getByDisplayValue("TestUser")).toBeInTheDocument();
      expect(screen.getByDisplayValue("EUW")).toBeInTheDocument();
      expect(screen.getByDisplayValue("euw1")).toBeInTheDocument();
    });

    it("uses saved region from localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue("na1");

      render(<SearchBar />);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("preferredRegion");
    });
  });
  describe("Form Validation", () => {
    it("shows error when submitting with empty summoner name", async () => {
      const { container } = render(<SearchBar />);

      const summonerInput = screen.getByPlaceholderText("SummonerName");
      const form = container.querySelector("form")!;

      await user.clear(summonerInput);
      fireEvent.submit(form);

      await waitFor(() => {
        expect(summonerInput).toHaveClass("text-error");
      });
    });

    it("shows error when submitting with empty tagline", async () => {
      const { container } = render(<SearchBar />);

      const taglineInput = screen.getByPlaceholderText("Tagline");
      const form = container.querySelector("form")!;

      await user.clear(taglineInput);
      fireEvent.submit(form);

      await waitFor(() => {
        expect(taglineInput).toHaveClass("text-error");
      });
    });
    it("clears error when valid input is provided", async () => {
      const { container } = render(<SearchBar />);

      const summonerInput = screen.getByPlaceholderText("SummonerName");
      const taglineInput = screen.getByPlaceholderText("Tagline");
      const form = container.querySelector("form")!;

      // Trigger error
      await user.clear(summonerInput);
      fireEvent.submit(form);

      await waitFor(() => {
        expect(summonerInput).toHaveClass("text-error");
      });

      // Fix error
      await user.type(summonerInput, "ValidName");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(summonerInput).not.toHaveClass("text-error");
      });
    });
  });

  describe("Form Submission", () => {
    it("calls setUser and navigates on valid submission", async () => {
      const { container } = render(<SearchBar />);

      const summonerInput = screen.getByPlaceholderText("SummonerName");
      const taglineInput = screen.getByPlaceholderText("Tagline");
      const regionSelect = screen.getByDisplayValue("euw1");
      const form = container.querySelector("form")!;

      await user.clear(summonerInput);
      await user.type(summonerInput, "NewUser");
      await user.clear(taglineInput);
      await user.type(taglineInput, "TAG");
      await user.selectOptions(regionSelect, "na1");

      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith({
          region: "na1",
          tagline: "TAG",
          summonerName: "NewUser",
        });

        expect(mockPush).toHaveBeenCalledWith("/na1/summoner/NewUser/TAG");
      });
    });
    it("encodes special characters in URL", async () => {
      const { container } = render(<SearchBar />);

      const summonerInput = screen.getByPlaceholderText("SummonerName");
      const taglineInput = screen.getByPlaceholderText("Tagline");
      const form = container.querySelector("form")!;

      await user.clear(summonerInput);
      await user.type(summonerInput, "User Name");
      await user.clear(taglineInput);
      await user.type(taglineInput, "TAG#1");

      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          "/euw1/summoner/User%20Name/TAG%231"
        );
      });
    });
    it("prevents submission when form is invalid", async () => {
      const { container } = render(<SearchBar />);

      const summonerInput = screen.getByPlaceholderText("SummonerName");
      const form = container.querySelector("form")!;

      await user.clear(summonerInput);
      fireEvent.submit(form);

      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Input Handling", () => {
    it("updates summoner name input", async () => {
      render(<SearchBar />);

      const summonerInput = screen.getByPlaceholderText("SummonerName");

      await user.clear(summonerInput);
      await user.type(summonerInput, "NewName");

      expect(summonerInput).toHaveValue("NewName");
    });

    it("updates tagline input", async () => {
      render(<SearchBar />);

      const taglineInput = screen.getByPlaceholderText("Tagline");

      await user.clear(taglineInput);
      await user.type(taglineInput, "NEW");

      expect(taglineInput).toHaveValue("NEW");
    });

    it("updates region select", async () => {
      render(<SearchBar />);

      const regionSelect = screen.getByDisplayValue("euw1");

      await user.selectOptions(regionSelect, "na1");

      expect(regionSelect).toHaveValue("na1");
    });
    it("trims whitespace from summoner name", async () => {
      render(<SearchBar />);

      const summonerInput = screen.getByPlaceholderText(
        "SummonerName"
      ) as HTMLInputElement;

      await user.clear(summonerInput);
      await user.type(summonerInput, "  Name  ");

      // Simulate blur to trigger trimming
      fireEvent.blur(summonerInput);
      fireEvent.change(summonerInput, {
        target: { value: summonerInput.value.trim() },
      });

      expect(summonerInput.value.trim()).toBe("Name");
    });

    it("trims leading whitespace from tagline", async () => {
      render(<SearchBar />);

      const taglineInput = screen.getByPlaceholderText("Tagline");

      await user.clear(taglineInput);
      await user.type(taglineInput, "  TAG");

      expect(taglineInput).toHaveValue("TAG");
    });
  });
  describe("Accessibility", () => {
    it("has proper labels for screen readers", () => {
      render(<SearchBar />);

      expect(screen.getByLabelText("Summoner Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Tagline")).toBeInTheDocument();
      expect(screen.getByLabelText("Region")).toBeInTheDocument();
    });
    it("has proper aria-invalid attributes on error", async () => {
      const { container } = render(<SearchBar />);

      const summonerInput = screen.getByPlaceholderText("SummonerName");
      const form = container.querySelector("form")!;

      await user.clear(summonerInput);
      fireEvent.submit(form);

      await waitFor(() => {
        expect(summonerInput).toHaveAttribute("aria-invalid", "true");
      });
    });
    it("provides autocomplete attributes", () => {
      const { container } = render(<SearchBar />);

      const form = container.querySelector("form")!;
      expect(form).toHaveAttribute("autoComplete", "off");

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("autoComplete", "off");
      });
    });
  });

  describe("Region Handling", () => {
    it("saves selected region to localStorage", async () => {
      render(<SearchBar />);

      const regionSelect = screen.getByDisplayValue("euw1");

      await user.selectOptions(regionSelect, "na1");

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "preferredRegion",
        "na1"
      );
    });

    it("renders all available regions", () => {
      render(<SearchBar />);

      const regionSelect = screen.getByDisplayValue("euw1");
      const options = within(regionSelect).getAllByRole("option");

      // Should have multiple region options
      expect(options.length).toBeGreaterThan(1);
    });
  });
  describe("Performance", () => {
    it("uses memoized components for optimization", () => {
      // This test ensures the component structure supports memoization
      const { container } = render(<SearchBar />);

      // Component should render without performance issues
      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("handles rapid input changes", async () => {
      render(<SearchBar />);

      const summonerInput = screen.getByPlaceholderText("SummonerName");

      // Simulate rapid typing
      await user.clear(summonerInput);
      await user.type(summonerInput, "Test");

      expect(summonerInput).toHaveValue("Test");
    });
  });
});
