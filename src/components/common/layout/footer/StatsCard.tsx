'use client';
import React from 'react';
import { motion } from 'motion/react';

interface StatsCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  value,
  label,
  color,
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

export default StatsCard;
