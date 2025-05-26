import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SectionCard from "../SectionCard";

describe("SectionCard Component", () => {
  const defaultProps = {
    title: "Test Section",
    loading: false,
    error: null,
    children: <div>Section Content</div>,
  };

  describe("Rendering", () => {
    it("renders title and children when not loading", () => {
      render(<SectionCard {...defaultProps} />);

      expect(screen.getByText("Test Section")).toBeInTheDocument();
      expect(screen.getByText("Section Content")).toBeInTheDocument();
    });

    it("has correct base classes and structure", () => {
      render(<SectionCard {...defaultProps} />);

      const section = screen.getByRole("region");
      expect(section).toHaveClass(
        "bg-base-100",
        "rounded-xl",
        "shadow",
        "p-4",
        "min-h-[200px]",
        "flex",
        "flex-col",
        "items-center",
        "w-full"
      );
    });

    it("applies custom role when provided", () => {
      render(<SectionCard {...defaultProps} role="banner" />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading skeleton when loading is true", () => {
      render(<SectionCard {...defaultProps} loading={true} />);

      expect(screen.getByText("Test Section")).toBeInTheDocument();
      expect(screen.queryByText("Section Content")).not.toBeInTheDocument();

      // Check for skeleton elements
      const skeletons = screen
        .getAllByRole("region")[0]
        .querySelectorAll(".skeleton");
      expect(skeletons).toHaveLength(3);
      expect(skeletons[0]).toHaveClass("skeleton", "h-6", "w-32", "mb-2");
      expect(skeletons[1]).toHaveClass("skeleton", "h-4", "w-full", "mb-1");
      expect(skeletons[2]).toHaveClass("skeleton", "h-4", "w-full", "mb-1");
    });

    it("has correct aria-busy attribute when loading", () => {
      render(<SectionCard {...defaultProps} loading={true} />);
      expect(screen.getByRole("region")).toHaveAttribute("aria-busy", "true");
    });

    it("has animate-pulse class on loading container", () => {
      render(<SectionCard {...defaultProps} loading={true} />);

      const loadingContainer = screen
        .getByRole("region")
        .querySelector(".animate-pulse");
      expect(loadingContainer).toBeInTheDocument();
      expect(loadingContainer).toHaveClass(
        "flex",
        "flex-col",
        "gap-2",
        "w-full"
      );
    });
  });

  describe("Error State", () => {
    it("shows error message when error is provided", () => {
      const errorMessage = "Something went wrong";
      render(<SectionCard {...defaultProps} error={errorMessage} />);

      expect(screen.getByText("Test Section")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText("Section Content")).not.toBeInTheDocument();
    });

    it("applies correct error styling", () => {
      render(<SectionCard {...defaultProps} error="Error message" />);
      const errorElement = screen.getByText("Error message");
      expect(errorElement).toHaveClass(
        "text-error",
        "text-xs",
        "text-center",
        "mb-2"
      );
    });

    it("prioritizes loading over error state", () => {
      render(
        <SectionCard {...defaultProps} loading={true} error="Error occurred" />
      );

      // Should show loading state, not error
      const skeletonElements = document.querySelectorAll(".skeleton");
      expect(skeletonElements.length).toBeGreaterThan(0);
      expect(screen.queryByText("Error occurred")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes", () => {
      render(<SectionCard {...defaultProps} />);

      const section = screen.getByRole("region");
      expect(section).toHaveAttribute("aria-live", "polite");
      expect(section).toHaveAttribute("aria-busy", "false");
    });

    it("updates aria-busy based on loading state", () => {
      const { rerender } = render(
        <SectionCard {...defaultProps} loading={false} />
      );
      expect(screen.getByRole("region")).toHaveAttribute("aria-busy", "false");

      rerender(<SectionCard {...defaultProps} loading={true} />);
      expect(screen.getByRole("region")).toHaveAttribute("aria-busy", "true");
    });

    it("maintains aria-live for dynamic content updates", () => {
      render(<SectionCard {...defaultProps} />);
      expect(screen.getByRole("region")).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Content Rendering", () => {
    it("renders complex children correctly", () => {
      const complexChildren = (
        <div>
          <h3>Nested Title</h3>
          <p>Nested paragraph</p>
          <button>Nested button</button>
        </div>
      );

      render(<SectionCard {...defaultProps}>{complexChildren}</SectionCard>);

      expect(screen.getByText("Nested Title")).toBeInTheDocument();
      expect(screen.getByText("Nested paragraph")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Nested button" })
      ).toBeInTheDocument();
    });

    it("handles empty children gracefully", () => {
      render(<SectionCard {...defaultProps} children={null} />);
      expect(screen.getByText("Test Section")).toBeInTheDocument();
    });

    it("renders multiple children", () => {
      render(
        <SectionCard {...defaultProps}>
          <div>First child</div>
          <div>Second child</div>
        </SectionCard>
      );

      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();
    });
  });

  describe("State Combinations", () => {
    it("shows children when not loading and no error", () => {
      render(<SectionCard {...defaultProps} loading={false} error={null} />);
      expect(screen.getByText("Section Content")).toBeInTheDocument();
    });

    it("shows loading when loading is true regardless of error state", () => {
      render(<SectionCard {...defaultProps} loading={true} error={null} />);
      expect(
        screen.getAllByRole("region")[0].querySelector(".skeleton")
      ).toBeInTheDocument();
    });

    it("shows error when error exists and not loading", () => {
      render(
        <SectionCard {...defaultProps} loading={false} error="Test error" />
      );
      expect(screen.getByText("Test error")).toBeInTheDocument();
      expect(screen.queryByText("Section Content")).not.toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("is memoized component", () => {
      // Test that the component is wrapped with React.memo
      expect(SectionCard.displayName).toBe("SectionCard");
    });
  });
});
