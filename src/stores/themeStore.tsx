'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

// DaisyUI theme list (should match tailwind.config.ts)
const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
  'caramellatte',
  'abyss',
];

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themes: string[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  themes,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with null to avoid hydration mismatch
  const [theme, setThemeState] = useState<string | null>(null);
  // Initialize theme on client side only
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // First check localStorage for immediate theme application
        const savedTheme = localStorage.getItem('theme') || 'light';
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Then try to load from database if user is authenticated
        try {
          const response = await fetch('/api/settings/preferences');
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data?.preferences?.theme) {
              const dbTheme = data.data.preferences.theme;
              if (dbTheme !== savedTheme) {
                setThemeState(dbTheme);
                document.documentElement.setAttribute('data-theme', dbTheme);
                localStorage.setItem('theme', dbTheme);
              }
            }
          }
        } catch (dbError) {
          // Ignore database errors (user might not be authenticated)
          console.log('Could not load theme from database:', dbError);
        }
      } catch (error) {
        // Fallback to default theme
        setThemeState('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };

    initializeTheme();
  }, []);
  const setTheme = useCallback((newTheme: string) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);

      // Also save to database if user is authenticated
      fetch('/api/settings/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: newTheme,
        }),
      }).catch(error => {
        // Ignore errors (user might not be authenticated)
        console.log('Could not save theme to database:', error);
      });
    }
  }, []);

  // Don't render until theme is loaded to avoid hydration mismatch
  if (theme === null) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', setTheme, themes }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
