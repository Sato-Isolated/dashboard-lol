'use client';
import React, { useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, ChevronUp } from 'lucide-react';
import { useTheme } from '@/stores/themeStore';
import { createPortal } from 'react-dom';

// Custom hook to handle client-side mounting
const useClientMounted = () => {
  const [mounted, setMounted] = useState(false);
  
  useLayoutEffect(() => {
    setMounted(true);
  }, []);
  
  return mounted;
};

// Custom hook to handle window events
const useWindowEvents = (isOpen: boolean, updatePosition: () => void, setIsOpen: (value: boolean) => void) => {
  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleResize = () => updatePosition();
    
    // Only close on scroll if it's not coming from within the theme selector
    const handleScroll = (e: Event) => {
      const target = e.target as Element;
      const themeSelectorPanel = document.querySelector('[role="listbox"][aria-label="Theme options"]');
      
      if (themeSelectorPanel && (target === themeSelectorPanel || themeSelectorPanel.contains(target))) {
        return;
      }
      
      setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, updatePosition, setIsOpen]);
};

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeItemProps {
  themeName: string;
  isActive: boolean;
  colors: ThemeColors;
  index: number;
  onClick: () => void;
  getDisplayName: (name: string) => string;
}

const ThemeItem: React.FC<ThemeItemProps> = React.memo(({ 
  themeName, 
  isActive, 
  colors, 
  index, 
  onClick, 
  getDisplayName 
}) => (
  <motion.button
    key={themeName}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.02, duration: 0.15 }}
    className={`
      relative p-3 rounded-lg border text-left transition-all duration-200 group
      ${isActive
        ? 'border-primary bg-primary/10 shadow-md'
        : 'border-base-300/50 bg-base-100 hover:border-primary/50 hover:bg-base-200/50'
      }
    `}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    role='option'
    aria-selected={isActive}
  >
    {/* Theme Preview Colors */}
    <div className='flex items-center gap-2 mb-2'>
      <div className='flex gap-1'>
        {(['primary', 'secondary', 'accent'] as const).map((colorType) => (
          <div
            key={colorType}
            className='w-3 h-3 rounded-full border border-white/20 shadow-sm'
            style={{ backgroundColor: colors[colorType] }}
          />
        ))}
      </div>
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className='ml-auto'
        >
          <div className='w-4 h-4 rounded-full bg-primary flex items-center justify-center'>
            <div className='w-2 h-2 rounded-full bg-white' />
          </div>
        </motion.div>
      )}
    </div>

    {/* Theme Name */}
    <div className='text-xs font-medium text-base-content group-hover:text-primary transition-colors'>
      {getDisplayName(themeName)}
    </div>

    {/* Active indicator */}
    {isActive && (
      <motion.div
        layoutId='activeTheme'
        className='absolute inset-0 rounded-lg border-2 border-primary'
        transition={{ type: 'spring', duration: 0.4 }}
      />
    )}
  </motion.button>
));

ThemeItem.displayName = 'ThemeItem';

interface ButtonPosition {
  top: number;
  left: number;
  width: number;
}

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useClientMounted(); // Modern custom hook
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition>({ top: 0, left: 0, width: 0 });
  // Modernized position calculation with useCallback
  const updatePosition = useCallback(() => {
    if (!isOpen || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const panelHeight = 410;
    const panelWidth = window.innerWidth >= 640 ? 380 : 320;
    const viewportWidth = window.innerWidth;

    // Calculate optimal position
    let top = rect.top - panelHeight - 10;
    let left = rect.left + rect.width / 2 - panelWidth / 2;

    // Viewport boundary adjustments
    if (top < 10) top = rect.bottom + 10;
    if (left + panelWidth > viewportWidth - 10) left = viewportWidth - panelWidth - 10;
    if (left < 10) left = 10;

    setButtonPosition({
      top: Math.max(10, top),
      left: Math.max(10, left),
      width: rect.width,
    });
  }, [isOpen]);

  // Custom hook to handle events
  useWindowEvents(isOpen, updatePosition, setIsOpen);// Memoized theme colors for performance
  const themeColors = useMemo(() => ({
    light: { primary: '#570df8', secondary: '#f000b8', accent: '#37cdbe' },
    dark: { primary: '#661ae6', secondary: '#d926aa', accent: '#1fb2a5' },
    cupcake: { primary: '#65c3c8', secondary: '#ef9fbc', accent: '#eeaf3a' },
    bumblebee: { primary: '#e0a82e', secondary: '#f9d72f', accent: '#181830' },
    emerald: { primary: '#66cc8a', secondary: '#377cfb', accent: '#ea5234' },
    corporate: { primary: '#4b6bfb', secondary: '#7b92b2', accent: '#67cba0' },
    synthwave: { primary: '#e779c1', secondary: '#58c7f3', accent: '#f3cc30' },
    retro: { primary: '#ef9995', secondary: '#a4cbb4', accent: '#dc8850' },
    cyberpunk: { primary: '#ff7598', secondary: '#75d1f0', accent: '#c07eec' },
    valentine: { primary: '#e96d7b', secondary: '#a991f7', accent: '#88dbdd' },
    halloween: { primary: '#f28c18', secondary: '#6d3a9c', accent: '#51a800' },
    garden: { primary: '#5c7f67', secondary: '#ecf4e7', accent: '#fae5e5' },
    forest: { primary: '#1eb854', secondary: '#1fd65f', accent: '#1db584' },
    aqua: { primary: '#09ecf3', secondary: '#966fb3', accent: '#ffe999' },
    lofi: { primary: '#0d0d0d', secondary: '#1a1a1a', accent: '#262626' },
    pastel: { primary: '#d1c1d7', secondary: '#f6cbd1', accent: '#b4e9d6' },
    fantasy: { primary: '#6e0b75', secondary: '#007ebd', accent: '#f18c47' },
    wireframe: { primary: '#b8b8b8', secondary: '#b8b8b8', accent: '#b8b8b8' },
    black: { primary: '#343232', secondary: '#343232', accent: '#343232' },
    luxury: { primary: '#ffffff', secondary: '#152747', accent: '#513448' },
    dracula: { primary: '#ff79c6', secondary: '#bd93f9', accent: '#ffb86c' },
    cmyk: { primary: '#0891b2', secondary: '#e11d48', accent: '#eab308' },
    autumn: { primary: '#8c0327', secondary: '#d85251', accent: '#b45309' },
    business: { primary: '#1c4ed8', secondary: '#7c2d12', accent: '#991b1b' },
    acid: { primary: '#ff00ff', secondary: '#ffff00', accent: '#00ffff' },
    lemonade: { primary: '#519903', secondary: '#e9e92f', accent: '#bf0000' },
    night: { primary: '#38bdf8', secondary: '#818cf8', accent: '#f471b5' },
    coffee: { primary: '#db924b', secondary: '#263e3f', accent: '#10576d' },
    winter: { primary: '#047aed', secondary: '#463aa2', accent: '#c149ad' },
    dim: { primary: '#9333ea', secondary: '#4ade80', accent: '#f472b6' },
    nord: { primary: '#5e81ac', secondary: '#81a1c1', accent: '#88c0d0' },
    sunset: { primary: '#ff865b', secondary: '#fd6f9c', accent: '#b387fa' },
    caramellatte: { primary: '#d2691e', secondary: '#daa520', accent: '#cd853f' },
    abyss: { primary: '#3d4451', secondary: '#2d3748', accent: '#4a5568' },
  }) as Record<string, { primary: string; secondary: string; accent: string }>, []);

  // Memoized theme display name function
  const getThemeDisplayName = useCallback((themeName: string) => {
    return themeName.charAt(0).toUpperCase() + themeName.slice(1).replace(/([A-Z])/g, ' $1');
  }, []);

  // Memoized handlers
  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const handleThemeSelect = useCallback((selectedTheme: string) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  }, [setTheme]);
  const handleBackdropClick = useCallback(() => setIsOpen(false), []);
  return (
    <div className='relative'>      <motion.button
        ref={buttonRef}
        whileTap={{ scale: 0.95 }}
        className='btn btn-outline btn-sm flex items-center gap-1 sm:gap-2 min-w-[100px] sm:min-w-[120px]'
        onClick={handleToggle}
        aria-label='Theme selector'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
      >
        <Palette className='w-3 h-3 sm:w-4 sm:h-4' />        <span className='text-xs sm:text-sm font-medium truncate'>
          {mounted ? getThemeDisplayName(theme) : 'Light'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp className='w-3 h-3 flex-shrink-0' />
        </motion.div>
      </motion.button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='fixed inset-0 z-[9998] bg-black/20'
                  onClick={handleBackdropClick}
                />                {/* Theme Selector Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}                  className='fixed bg-base-100 rounded-xl shadow-2xl border border-base-300/50 backdrop-blur-sm z-[9999] w-[320px] sm:w-[380px] max-h-[400px] overflow-hidden'
                  style={{
                    top: buttonPosition.top,
                    left: buttonPosition.left,
                  }}
                  role='listbox'
                  aria-label='Theme options'
                  onScroll={(e) => e.stopPropagation()}
                  onWheel={(e) => e.stopPropagation()}
                >
              {/* Header */}
              <div className='p-4 border-b border-base-300/50 bg-base-200/50'>
                <h3 className='text-sm font-semibold text-base-content flex items-center gap-2'>
                  <Palette className='w-4 h-4' />
                  Choose Theme
                </h3>
                <p className='text-xs text-base-content/60 mt-1'>
                  {themes.length} themes available
                </p>
              </div>              {/* Theme Grid */}
              <div 
                className='max-h-[280px] overflow-y-auto p-3'
                onScroll={(e) => e.stopPropagation()}
              >
                <div className='grid grid-cols-2 gap-2'>                  {themes.map((t, index) => (
                    <ThemeItem
                      key={t}
                      themeName={t}
                      isActive={theme === t}
                      colors={themeColors[t] || themeColors.light}
                      index={index}
                      onClick={() => handleThemeSelect(t)}
                      getDisplayName={getThemeDisplayName}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className='p-3 border-t border-base-300/50 bg-base-200/30'>
                <div className='text-xs text-base-content/50 text-center'>
                  Theme changes apply instantly
                </div>
              </div>
            </motion.div>              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default ThemeSwitcher;
