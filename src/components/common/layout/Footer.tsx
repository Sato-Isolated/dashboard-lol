'use client';
import React from 'react';
import { motion } from 'motion/react';
import { FooterStats, FooterContent } from './footer/index';

interface FooterProps {
  playersCount: number;
  matchesCount: number;
}

const Footer: React.FC<FooterProps> = ({ playersCount, matchesCount }) => {
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
      </div>      <div className='relative bg-base-200/80 backdrop-blur-sm rounded-t-2xl border-t border-primary/20 mt-16'>
        {/* Main footer content */}
        <div className='container mx-auto px-4 sm:px-6 py-6 sm:py-8'>
          {/* Stats section */}
          <FooterStats playersCount={playersCount} matchesCount={matchesCount} />
          
          {/* Footer content */}
          <FooterContent />
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
