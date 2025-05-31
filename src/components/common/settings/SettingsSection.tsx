'use client';

import { motion } from 'motion/react';

interface SettingsSectionProps {
  children: React.ReactNode;
}

export default function SettingsSection({ children }: SettingsSectionProps) {
  return (
    <motion.div
      key='settings-content'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='card bg-base-100 shadow-xl'
    >
      <div className='card-body p-6'>{children}</div>
    </motion.div>
  );
}
