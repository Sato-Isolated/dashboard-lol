import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { badgeVariants } from '../constants';
import { getBadgeKey } from '../utils';
import type { BadgesListProps } from '../matchCardStatsTypes';

const BadgesList: React.FC<BadgesListProps> = ({ badges }) => {
  const renderBadges = useMemo(
    () =>
      badges.map((badge, index) => (
        <motion.span
          key={getBadgeKey(badge.label, index)}
          variants={badgeVariants(index)}
          initial='initial'
          animate='animate'
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white font-bold 
                     shadow-lg bg-gradient-to-r ${badge.color} border border-white/20
                     text-xs transition-all duration-300 cursor-default`}
        >
          <span className='text-sm'>{badge.icon}</span>
          <span>{badge.label}</span>
        </motion.span>
      )),
    [badges],
  );

  return (
    <div className='flex gap-2 flex-wrap justify-center max-w-[140px]'>
      {renderBadges}
    </div>
  );
};

export default React.memo(BadgesList);
