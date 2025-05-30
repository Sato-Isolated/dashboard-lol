'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Github, Twitter, Coffee } from 'lucide-react';

interface SocialLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
}

const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  icon: Icon,
  label,
  color,
  onClick,
}) => (
  <motion.a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className={`btn btn-circle btn-ghost btn-sm ${color} transition-all duration-300 group`}
    whileTap={{ scale: 0.9 }}
    aria-label={label}
    onClick={onClick}
  >
    <Icon className='w-4 h-4' />
  </motion.a>
);

const SocialLinks: React.FC = () => {
  const handleCoffeeClick = () => {
    // Trigger a fun animation or easter egg
    console.log('Coffee button clicked! ☕');
  };

  return (
    <div className='flex items-center gap-1 sm:gap-2'>
      <SocialLink
        href='https://github.com/Sato-Isolated/dashboard-lol'
        icon={Github}
        label='GitHub'
        color='text-base-content'
      />
      <SocialLink
        href='https://x.com/yoshinoeater'
        icon={Twitter}
        label='Twitter'
        color='text-info'
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        className='btn btn-circle btn-ghost btn-sm text-error transition-all duration-300'
        onClick={handleCoffeeClick}
        aria-label='Buy us a coffee'
      >
        <Coffee className='w-4 h-4' />
      </motion.button>
    </div>
  );
};

export default SocialLinks;
