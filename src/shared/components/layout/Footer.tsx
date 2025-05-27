'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Twitter,
  Heart,
  Palette,
  Code,
  Users,
  Star,
  ChevronUp,
  Coffee,
  Shield,
} from 'lucide-react';
import { useTheme } from '@/shared/store/themeStore';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <motion.button
        whileTap={{ scale: 0.95 }}
        className='btn btn-outline btn-sm flex items-center gap-1 sm:gap-2'
        onClick={() => setIsOpen(!isOpen)}
      >
        <Palette className='w-3 h-3 sm:w-4 sm:h-4' />
        <span className='hidden sm:inline text-xs sm:text-sm'>Theme</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp className='w-3 h-3' />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-base-100 rounded-lg shadow-xl border border-base-300 p-2 z-50 min-w-[180px] sm:min-w-[200px] max-h-60 overflow-y-auto'
          >
            <div className='grid grid-cols-2 gap-1'>
              {themes.map((t, index) => (
                <motion.button
                  key={t}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`btn btn-sm btn-ghost justify-start text-left ${
                    theme === t ? 'btn-active' : ''
                  }`}
                  onClick={() => {
                    setTheme(t);
                    setIsOpen(false);
                  }}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 theme-${t}`} />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SocialLink = ({
  href,
  icon: Icon,
  label,
  color,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  color: string;
}) => (
  <motion.a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className={`btn btn-circle btn-ghost btn-sm ${color} transition-all duration-300 group`}
    whileTap={{ scale: 0.9 }}
    aria-label={label}
  >
    <Icon className='w-4 h-4' />
  </motion.a>
);

const StatsCard = ({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className='flex flex-col items-center p-2 sm:p-3 bg-base-100/50 rounded-lg backdrop-blur-sm border border-base-300/50 min-h-[80px] sm:min-h-[90px]'
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color} mb-1`} />
    <span className='text-base sm:text-lg font-bold text-base-content'>
      {value}
    </span>
    <span className='text-xs text-base-content/60 text-center'>{label}</span>
  </motion.div>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerStats = [
    {
      icon: Users,
      value: '1.2K+',
      label: 'Active Users',
      color: 'text-primary',
    },
    { icon: Star, value: '4.8', label: 'Rating', color: 'text-warning' },
    { icon: Shield, value: '99.9%', label: 'Uptime', color: 'text-success' },
    { icon: Code, value: 'Open', label: 'Source', color: 'text-info' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='relative overflow-hidden'
    >
      {/* Animated background */}
      <div className='absolute inset-0 bg-gradient-to-br from-base-200 via-base-300 to-base-200 opacity-50'></div>
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-0 right-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
      </div>

      <div className='relative bg-base-200/80 backdrop-blur-sm rounded-t-2xl border-t border-primary/20 mt-16'>
        {/* Main footer content */}
        <div className='container mx-auto px-4 sm:px-6 py-6 sm:py-8'>
          {/* Stats section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8'
          >
            {footerStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}
          </motion.div>

          {/* Main footer info */}
          <div className='flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6'>
            {/* Logo and description */}
            <motion.div
              className='flex flex-col items-center md:items-start text-center md:text-left'
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className='flex items-center gap-2 mb-2'>
                <div className='w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
                  <Code className='w-3 h-3 sm:w-5 sm:h-5 text-white' />
                </div>
                <span className='text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                  ARAM Dashboard
                </span>
              </div>
              <p className='text-xs sm:text-sm text-base-content/70 max-w-md px-2 sm:px-0'>
                Track your League of Legends ARAM performance with detailed
                analytics and community rankings
              </p>
            </motion.div>

            {/* Social links and theme switcher */}
            <motion.div
              className='flex flex-col items-center gap-3 sm:gap-4'
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className='flex items-center gap-1 sm:gap-2'>
                <SocialLink
                  href='https://github.com'
                  icon={Github}
                  label='GitHub'
                  color='text-base-content'
                />
                <SocialLink
                  href='https://twitter.com'
                  icon={Twitter}
                  label='Twitter'
                  color='text-info'
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className='btn btn-circle btn-ghost btn-sm text-error transition-all duration-300'
                  onClick={() => {
                    // Trigger a fun animation or easter egg
                  }}
                  aria-label='Buy us a coffee'
                >
                  <Coffee className='w-4 h-4' />
                </motion.button>
              </div>

              <ThemeSwitcher />
            </motion.div>
          </div>

          {/* Bottom bar */}
          <motion.div
            className='border-t border-base-300/50 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className='flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm text-base-content/60 text-center sm:text-left'>
              <span>
                &copy; {currentYear} Dashboard - League of Legends ARAM
              </span>
              <div className='flex items-center gap-1'>
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className='w-3 h-3 sm:w-4 sm:h-4 text-error fill-current' />
                </motion.div>
                <span>by the community</span>
              </div>
            </div>

            <div className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-base-content/50'>
              <motion.a
                href='#privacy'
                className='text-base-content/80 transition-colors hover:text-primary touch-manipulation'
                whileTap={{ scale: 0.95 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href='#terms'
                className='text-base-content/80 transition-colors hover:text-primary touch-manipulation'
                whileTap={{ scale: 0.95 }}
              >
                Terms of Service
              </motion.a>
              <motion.a
                href='#api'
                className='text-base-content/80 transition-colors hover:text-primary touch-manipulation'
                whileTap={{ scale: 0.95 }}
              >
                API Docs
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
