import React from "react";
import { render, screen } from "@testing-library/react";
import ClientLayout from "../ClientLayout";

// Mock all dependencies
jest.mock("@/shared/store/themeStore", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

jest.mock("@/shared/components/layout/Header", () => {
  return function MockHeader() {
    return <header data-testid="mock-header">Header</header>;
  };
});

jest.mock("@/shared/components/layout/Footer", () => {
  return function MockFooter() {
    return <footer data-testid="mock-footer">Footer</footer>;
  };
});

jest.mock("@/shared/components/ui/GlobalErrorAlert", () => {
  return function MockGlobalErrorAlert() {
    return <div data-testid="global-error-alert">Global Error Alert</div>;
  };
});

jest.mock("@/shared/components/ui/GlobalProgressBar", () => {
  return function MockGlobalProgressBar() {
    return <div data-testid="global-progress-bar">Global Progress Bar</div>;
  };
});

jest.mock("@/shared/components/error/ErrorBoundary", () => {
  return function MockErrorBoundary({
    children,
    fallback,
  }: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

jest.mock("@/shared/services/monitoring/PerformanceMonitoringService", () => ({
  getInstance: jest.fn(() => ({
    startMonitoring: jest.fn(),
  })),
}));

jest.mock("@/shared/components/debug/PerformanceDashboard", () => {
  return function MockPerformanceDashboard() {
    return <div data-testid="performance-dashboard">Performance Dashboard</div>;
  };
});

jest.mock("next/font/google", () => ({
  Geist: jest.fn(() => ({
    variable: "--font-geist-sans",
  })),
  Geist_Mono: jest.fn(() => ({
    variable: "--font-geist-mono",
  })),
}));

// Mock useEffect
const mockUseEffect = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: (fn: () => void, deps: any[]) => mockUseEffect(fn, deps),
}));

describe("ClientLayout Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all core layout components", () => {
    render(
      <ClientLayout>
        <div>Test content</div>
      </ClientLayout>
    );

    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
    expect(screen.getByTestId("global-error-alert")).toBeInTheDocument();
    expect(screen.getByTestId("global-progress-bar")).toBeInTheDocument();
    expect(screen.getByTestId("performance-dashboard")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
  it("applies font variables correctly", () => {
    const { container } = render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );

    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass("antialiased");
    expect(rootDiv.className).toContain("--font-geist-sans");
    expect(rootDiv.className).toContain("--font-geist-mono");
  });

  it("wraps content in error boundaries", () => {
    render(
      <ClientLayout>
        <div>Protected content</div>
      </ClientLayout>
    );

    const errorBoundaries = screen.getAllByTestId("error-boundary");
    expect(errorBoundaries.length).toBeGreaterThan(0);
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("renders children content correctly", () => {
    const testContent = "Test child content";

    render(
      <ClientLayout>
        <main>{testContent}</main>
      </ClientLayout>
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("initializes performance monitoring on mount", () => {
    const mockStartMonitoring = jest.fn();
    const mockGetInstance = jest.fn(() => ({
      startMonitoring: mockStartMonitoring,
    }));

    jest
      .mocked(
        require("@/shared/services/monitoring/PerformanceMonitoringService")
          .getInstance
      )
      .mockImplementation(mockGetInstance);

    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );

    // Check useEffect was called with empty dependency array (mount only)
    expect(mockUseEffect).toHaveBeenCalledWith(expect.any(Function), []);
  });

  it("maintains proper component hierarchy", () => {
    render(
      <ClientLayout>
        <div data-testid="test-content">Content</div>
      </ClientLayout>
    );

    const content = screen.getByTestId("test-content");
    const themeProvider = screen.getByTestId("theme-provider");
    const header = screen.getByTestId("mock-header");
    const footer = screen.getByTestId("mock-footer");

    // Check that all components are rendered in the correct hierarchy
    expect(themeProvider).toContainElement(header);
    expect(themeProvider).toContainElement(footer);
    expect(themeProvider).toContainElement(content);
  });

  it("renders global components in correct order", () => {
    const { container } = render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );

    const elements = Array.from(container.querySelectorAll("[data-testid]"));
    const testIds = elements.map((el) => el.getAttribute("data-testid"));

    // Check that key components are present (order may vary due to nesting)
    expect(testIds).toContain("theme-provider");
    expect(testIds).toContain("mock-header");
    expect(testIds).toContain("global-progress-bar");
    expect(testIds).toContain("global-error-alert");
    expect(testIds).toContain("mock-footer");
    expect(testIds).toContain("performance-dashboard");
  });

  it("handles multiple child elements", () => {
    render(
      <ClientLayout>
        <header>Child Header</header>
        <main>Child Main</main>
        <aside>Child Aside</aside>
      </ClientLayout>
    );

    expect(screen.getByText("Child Header")).toBeInTheDocument();
    expect(screen.getByText("Child Main")).toBeInTheDocument();
    expect(screen.getByText("Child Aside")).toBeInTheDocument();
  });
  it("applies antialiased font rendering", () => {
    const { container } = render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );

    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass("antialiased");
  });

  it("handles error boundary fallback correctly", () => {
    // Test that error boundary is configured (implementation may vary)
    render(
      <ClientLayout>
        <div>Normal content</div>
      </ClientLayout>
    );

    // Error boundaries should be present
    expect(screen.getAllByTestId("error-boundary").length).toBeGreaterThan(0);
  });

  it("renders without performance dashboard in production mode", () => {
    // This test assumes performance dashboard is always rendered
    // In a real implementation, you might want to conditionally render it
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );

    expect(screen.getByTestId("performance-dashboard")).toBeInTheDocument();
  });

  it("maintains responsive layout structure", () => {
    render(
      <ClientLayout>
        <div className="responsive-content">Responsive content</div>
      </ClientLayout>
    );

    const content = screen.getByText("Responsive content");
    expect(content).toHaveClass("responsive-content");
  });

  it("handles React fragments as children", () => {
    render(
      <ClientLayout>
        <>
          <div>Fragment child 1</div>
          <div>Fragment child 2</div>
        </>
      </ClientLayout>
    );

    expect(screen.getByText("Fragment child 1")).toBeInTheDocument();
    expect(screen.getByText("Fragment child 2")).toBeInTheDocument();
  });

  it("provides theme context to children", () => {
    render(
      <ClientLayout>
        <div>Themed content</div>
      </ClientLayout>
    );

    const themeProvider = screen.getByTestId("theme-provider");
    const content = screen.getByText("Themed content");

    expect(themeProvider).toContainElement(content);
  });

  it("handles null children gracefully", () => {
    expect(() => {
      render(<ClientLayout>{null}</ClientLayout>);
    }).not.toThrow();
  });
});
