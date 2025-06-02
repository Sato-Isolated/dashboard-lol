import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  itemsGridVariants,
  itemVariants,
  emptyItemVariants,
} from '../constants';
import { getItemImageSrc, getItemKey, getEmptySlotKey } from '../utils';
import type { ItemsGridProps } from '../matchCardChampionTypes';

const ItemsGrid: React.FC<ItemsGridProps> = ({ items }) => {
  return (
    <motion.div
      className='grid grid-cols-6 gap-1'
      variants={itemsGridVariants}
      initial='hidden'
      animate='show'
    >
      {items.map(item =>
        item.itemId > 0 ? (
          <motion.div
            key={getItemKey(item.itemId, item.id)}
            variants={itemVariants}
            className='relative'
          >
            <Image
              src={getItemImageSrc(item.itemId)}
              alt={`Item ${item.itemId}`}
              width={32}
              height={32}
              className='w-8 h-8 rounded-lg shadow-md border border-base-300 
                       bg-base-100 transition-all duration-300'
            />
          </motion.div>
        ) : (
          <motion.div
            key={getEmptySlotKey(item.id)}
            variants={emptyItemVariants}
            className='w-8 h-8 bg-gradient-to-br from-base-300/40 to-base-300/20 
                     rounded-lg shadow-inner border border-base-content/10'
          />
        ),
      )}
    </motion.div>
  );
};

export default React.memo(ItemsGrid);
