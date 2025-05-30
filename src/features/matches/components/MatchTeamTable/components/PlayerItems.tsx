import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

interface PlayerItemsProps {
  items: string[];
}

export const PlayerItems: React.FC<PlayerItemsProps> = ({ items }) => {
  const itemsDisplay = useMemo(
    () => (
      <div className='flex items-center gap-1 sm:gap-1.5 flex-wrap'>
        {items.map((item, idx) => (
          <motion.div
            key={`${item}-${idx}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 500 }}
            className='relative'
          >
            <div className='w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg overflow-hidden shadow-md border border-base-content/20 bg-base-100'>
              <Image
                src={`/assets/item/${item}.png`}
                alt={`Item ${item}`}
                width={32}
                height={32}
                className='object-cover transition-transform duration-200'
              />
            </div>
          </motion.div>
        ))}
      </div>
    ),
    [items],
  );

  return (
    <td className='min-w-[100px] sm:min-w-[120px] max-w-[180px] sm:max-w-[220px]'>
      {itemsDisplay}
    </td>
  );
};
