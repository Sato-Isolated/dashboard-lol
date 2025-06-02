'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Code, Heart } from 'lucide-react';
import SocialLinks from './SocialLinks';
import ThemeSwitcher from './ThemeSwitcher';

const FooterContent: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
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
          <SocialLinks />
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
          <span>&copy; {currentYear} Dashboard - League of Legends ARAM</span>
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
          </motion.a>        </div>
      </motion.div>
    </>
  );
};

export default FooterContent;
