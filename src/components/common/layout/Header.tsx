'use client';
import React, { useState, useCallback, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Menu, X, Zap } from 'lucide-react';
import SearchBar from '@/components/common/common/SearchBar';
import AuthButtons from '@/components/common/auth/AuthButtons';

const ReturnHomeButton = () => {
  const router = useRouter();
  const handleClick = () => {
    try {
      router.push('/');
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className='flex items-center gap-2 text-xl font-bold transition-all duration-300 hover:opacity-80'
      onClick={handleClick}
    >
      <motion.div
        className='flex items-center gap-2'
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
          <Zap className='w-5 h-5 text-white' />
        </div>
        <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
          Dashboard
        </span>
      </motion.div>
    </motion.button>
  );
};

const LeaderboardButton = () => {
  const router = useRouter();
  const handleClick = () => {
    try {
      router.push('/leaderboard');
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className='flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-base-200'
      onClick={handleClick}
    >
      <Trophy className='w-5 h-5 text-secondary' />
      <span className='text-secondary'>Leaderboard</span>
    </motion.button>
  );
};

const MobileMenu = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className='md:hidden p-2 rounded-lg hover:bg-base-200 transition-colors'
      onClick={onToggle}
    >
      <AnimatePresence mode='wait'>
        {isOpen ? (
          <motion.div
            key='close'
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className='w-6 h-6' />
          </motion.div>
        ) : (
          <motion.div
            key='menu'
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Menu className='w-6 h-6' />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    handleScroll();

    let timeoutId: number;
    const throttledHandleScroll = () => {
      if (timeoutId) cancelAnimationFrame(timeoutId);
      timeoutId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) cancelAnimationFrame(timeoutId);
    };
  }, [handleScroll]);

  return (
    <motion.header
      className='w-full sticky top-0 z-40'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`w-full bg-base-100/95 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? 'shadow-xl border-b border-primary/10' : 'shadow-lg'
        }`}
        animate={{
          paddingTop: isScrolled ? '0.75rem' : '1rem',
          paddingBottom: isScrolled ? '0.75rem' : '1rem',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className='w-full px-6 lg:px-8'>
          {/* Desktop Layout - Simple Flexbox avec 3 sections */}
          <div className='hidden md:flex items-center justify-between h-16 w-full'>
            {/* Section Gauche - Logo + Navigation */}
            <div className='flex items-center gap-6 flex-shrink-0'>
              <ReturnHomeButton />
              <div className='w-px h-6 bg-base-300'></div>
              <LeaderboardButton />

              {/* Stats indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className='hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 ml-4'
              >
                <div className='w-2 h-2 bg-success rounded-full animate-pulse'></div>
                <span className='text-xs font-medium text-success'>Live</span>
              </motion.div>
            </div>
            {/* Section Centre - Search Bar */}
            <div className='flex-1 flex justify-center px-8'>
              <motion.div
                className='w-full max-w-7xl'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <SearchBar />
              </motion.div>
            </div>
            {/* Section Droite - Auth Buttons */}
            <div className='flex items-center flex-shrink-0'>
              <AuthButtons />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className='flex md:hidden items-center justify-between h-16 w-full'>
            <div className='flex items-center gap-4'>
              <ReturnHomeButton />
            </div>

            <MobileMenu
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='md:hidden bg-base-100/95 backdrop-blur-md border-b border-primary/10 shadow-lg'
          >
            <div className='w-full px-6 py-6 space-y-6'>
              {/* Mobile Search */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <SearchBar />
              </motion.div>

              {/* Mobile Auth Buttons */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <AuthButtons />
              </motion.div>

              {/* Mobile Navigation */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='space-y-4'
              >
                <LeaderboardButton />

                <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20 w-fit'>
                  <div className='w-2 h-2 bg-success rounded-full animate-pulse'></div>
                  <span className='text-xs font-medium text-success'>
                    Live Tracking Active
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
