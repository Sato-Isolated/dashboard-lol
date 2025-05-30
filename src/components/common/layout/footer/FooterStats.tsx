'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Users, GamepadIcon, Shield, Code } from 'lucide-react';
import { formatCount } from '@/lib/utils/formatUtils';
import StatsCard from './StatsCard';

interface FooterStatsProps {
  playersCount: number;
  matchesCount: number;
}

const FooterStats: React.FC<FooterStatsProps> = ({
  playersCount,
  matchesCount,
}) => {
  const footerStats = [
    {
      icon: Users,
      value: formatCount(playersCount),
      label: 'Players Tracked',
      color: 'text-primary',
    },
    {
      icon: GamepadIcon,
      value: formatCount(matchesCount),
      label: 'ARAM Matches',
      color: 'text-warning',
    },
    { icon: Shield, value: '99.9%', label: 'Uptime', color: 'text-success' },
    { icon: Code, value: 'Open', label: 'Source', color: 'text-info' },
  ];

  return (
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
  );
};

export default FooterStats;
