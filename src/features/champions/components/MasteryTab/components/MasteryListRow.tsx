import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Target } from 'lucide-react';
import { getChampionIcon } from '@/lib/utils/helpers';
import { getMasteryLevelStyle } from '../utils/masteryLevelStyle';
import { itemVariants } from '../utils/animations';
import type { MasteryWithChampion } from '../masteryTabTypes';

interface MasteryListRowProps {
  mastery: MasteryWithChampion;
  index: number;
}

export const MasteryListRow: React.FC<MasteryListRowProps> = React.memo(
  ({ mastery, index }) => {
    const masteryStyle = getMasteryLevelStyle(mastery.championLevel);
    const Icon = masteryStyle.icon;

    return (
      <motion.tr
        variants={itemVariants}
        className='group border-b border-base-300/50 transition-all duration-300'
      >
        {/* Champion */}
        <td className='py-4 px-6'>
          <div className='flex items-center gap-4'>
            <motion.div className='relative' transition={{ duration: 0.2 }}>
              <Image
                src={getChampionIcon(
                  mastery.champ ? mastery.champ.id : String(mastery.championId),
                )}
                alt={
                  mastery.champ
                    ? mastery.champ.name
                    : String(mastery.championId)
                }
                width={48}
                height={48}
                className='w-12 h-12 rounded-xl border-2 border-primary/30 transition-colors duration-300 shadow-lg'
              />
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br ${masteryStyle.gradient} rounded-full flex items-center justify-center text-white text-xs font-bold`}
              >
                {mastery.championLevel}
              </div>
            </motion.div>
            <span className='font-semibold text-base-content transition-colors duration-300'>
              {mastery.champ
                ? mastery.champ.name
                : `Champion ${mastery.championId}`}
            </span>
          </div>
        </td>

        {/* Level */}
        <td className='py-4 px-6 text-center'>
          <motion.div transition={{ duration: 0.2 }}>
            <span
              className={`badge badge-lg ${masteryStyle.badge} text-white font-bold px-4 py-2 shadow-lg`}
            >
              <Icon size={14} className='mr-1' />
              {mastery.championLevel}
            </span>
          </motion.div>
        </td>

        {/* Points */}
        <td className='py-4 px-6 text-center'>
          <div className='flex flex-col items-center gap-1'>
            <span className='text-lg font-bold text-base-content'>
              {mastery.championPoints.toLocaleString('en-US')}
            </span>
            <span className='text-xs text-base-content/50 flex items-center gap-1'>
              <Target size={12} />
              points
            </span>
          </div>
        </td>
      </motion.tr>
    );
  },
);

MasteryListRow.displayName = 'MasteryListRow';
