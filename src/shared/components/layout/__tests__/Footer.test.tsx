import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../Footer';

// Mock the theme store
const mockSetTheme = jest.fn();
const mockUseTheme = {
  theme: 'light',
  setTheme: mockSetTheme,
  themes: ['light', 'dark', 'cupcake', 'bumblebee', 'emerald'],
};

jest.mock('@/shared/store/themeStore', () => ({
  useTheme: () => mockUseTheme,
}));

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders footer with copyright information', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(
      new RegExp(`© ${currentYear} Dashboard - League of Legends Aram`)
    );
    expect(copyrightText).toBeInTheDocument();
  });

  it('renders theme switcher with all available themes', () => {
    render(<Footer />);

    const themeSelect = screen.getByRole('combobox', {
      name: /changer de thème/i,
    });
    expect(themeSelect).toBeInTheDocument();

    // Check all themes are available as options
    mockUseTheme.themes.forEach(theme => {
      const capitalizedTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
      expect(
        screen.getByRole('option', { name: capitalizedTheme })
      ).toBeInTheDocument();
    });
  });

  it('displays current theme as selected', () => {
    render(<Footer />);

    const themeSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(themeSelect.value).toBe('light');
  });

  it('calls setTheme when theme is changed', () => {
    render(<Footer />);

    const themeSelect = screen.getByRole('combobox');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('has proper footer structure and styling', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass(
      'footer',
      'footer-center',
      'p-4',
      'bg-base-200',
      'text-base-content',
      'rounded-t-xl',
      'mt-8'
    );
  });

  it('theme switcher has correct styling classes', () => {
    render(<Footer />);

    const themeSelect = screen.getByRole('combobox');
    expect(themeSelect).toHaveClass(
      'select',
      'select-bordered',
      'select-sm',
      'ml-2'
    );
  });

  it('maintains accessibility with proper labeling', () => {
    render(<Footer />);

    const themeSelect = screen.getByRole('combobox');
    expect(themeSelect).toHaveAttribute('aria-label', 'Changer de thème');
  });
  it('handles all theme options correctly', () => {
    const themes = ['light', 'dark', 'cupcake', 'bumblebee', 'emerald'];

    themes.forEach(theme => {
      mockUseTheme.theme = theme;
      const { unmount } = render(<Footer />);

      const themeSelect = screen.getByRole('combobox') as HTMLSelectElement;
      expect(themeSelect.value).toBe(theme);

      // Cleanup for next iteration
      unmount();
    });
  });

  it('renders theme options with correct capitalization', () => {
    render(<Footer />);

    const expectedLabels = ['Light', 'Dark', 'Cupcake', 'Bumblebee', 'Emerald'];

    expectedLabels.forEach(label => {
      expect(screen.getByRole('option', { name: label })).toBeInTheDocument();
    });
  });

  it('renders consistent copyright year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyrightElement = screen.getByText(new RegExp(`© ${currentYear}`));
    expect(copyrightElement).toHaveClass('text-sm');
  });

  it('has proper layout structure', () => {
    render(<Footer />);

    const aside = screen.getByRole('complementary');
    expect(aside).toBeInTheDocument();

    // Check if theme switcher container exists
    const themeContainer = aside.querySelector('div.mt-2');
    expect(themeContainer).toBeInTheDocument();
  });

  it('handles theme change events properly', () => {
    render(<Footer />);

    const themeSelect = screen.getByRole('combobox');

    // Test multiple theme changes
    fireEvent.change(themeSelect, { target: { value: 'dark' } });
    fireEvent.change(themeSelect, { target: { value: 'cupcake' } });
    fireEvent.change(themeSelect, { target: { value: 'light' } });

    expect(mockSetTheme).toHaveBeenCalledTimes(3);
    expect(mockSetTheme).toHaveBeenNthCalledWith(1, 'dark');
    expect(mockSetTheme).toHaveBeenNthCalledWith(2, 'cupcake');
    expect(mockSetTheme).toHaveBeenNthCalledWith(3, 'light');
  });
  it('renders without errors when themes array is empty', () => {
    const emptyThemesUseTheme = {
      ...mockUseTheme,
      themes: [],
    };

    // Temporarily mock the useTheme hook to return empty themes
    const originalMock = jest.requireMock('@/shared/store/themeStore').useTheme;
    jest.requireMock('@/shared/store/themeStore').useTheme = jest.fn(
      () => emptyThemesUseTheme
    );

    expect(() => render(<Footer />)).not.toThrow();

    // Restore original mock
    jest.requireMock('@/shared/store/themeStore').useTheme = originalMock;
  });

  it('maintains responsive design', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('footer-center');

    // Check if content is properly centered
    const aside = screen.getByRole('complementary');
    expect(aside).toBeInTheDocument();
  });
});
