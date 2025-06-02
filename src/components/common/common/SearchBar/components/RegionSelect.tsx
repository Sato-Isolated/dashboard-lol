import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { PlatformRegion } from '@/lib/api/api/riot/types';
import { inputVariants } from '../utils/animations';
import type { RegionSelectProps } from '../types';

export const RegionSelect: React.FC<RegionSelectProps> = ({
  value,
  onChange,
}) => {
  // Memoize platform region options
  const platformRegionOptions = useMemo(
    () =>
      Object.entries(PlatformRegion).map(([key, value]) => (
        <option key={key} value={value} className='text-lg'>
          {value}
        </option>
      )),
    [],
  );

  return (
    <div className='flex-shrink-0'>
      <label htmlFor='region' className='sr-only'>
        Region
      </label>
      <motion.select
        initial={inputVariants.initial}
        animate={inputVariants.animate}
        transition={{ delay: 0.6 }}
        name='region'
        id='region'
        className='select select-ghost bg-transparent border-0 outline-none text-sm sm:text-lg font-bold 
               cursor-pointer text-primary transition-colors duration-300 w-16 sm:w-24'
        value={value}
        onChange={e => onChange(e.target.value as PlatformRegion)}
      >
        {platformRegionOptions}
      </motion.select>
    </div>
  );
};
