import React from 'react';
import { motion } from 'motion/react';

export const TableHeader: React.FC = () => {
  return (
    <motion.thead
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <tr className='bg-base-200/50 backdrop-blur-sm'>
        <th className='p-2 sm:p-3 pl-2 sm:pl-4 text-left text-base-content/70 font-bold'>
          <div className='flex items-center gap-1 sm:gap-2'>
            <svg
              className='w-3 h-3 sm:w-4 sm:h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
            <span className='text-xs sm:text-sm'>Summoner</span>
          </div>
        </th>
        <th className='text-left text-base-content/70 font-bold'>
          <div className='flex items-center gap-1 sm:gap-2'>
            <svg
              className='w-3 h-3 sm:w-4 sm:h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
            <span className='text-xs sm:text-sm'>KDA</span>
          </div>
        </th>
        <th className='text-left text-base-content/70 font-bold text-xs sm:text-sm'>
          CS
        </th>
        <th className='text-left text-base-content/70 font-bold'>
          <div className='flex items-center gap-1 sm:gap-2'>
            <svg
              className='w-3 h-3 sm:w-4 sm:h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 10V3L4 14h7v7l9-11h-7z'
              />
            </svg>
            <span className='text-xs sm:text-sm'>DMG</span>
          </div>
        </th>
        <th className='text-left text-base-content/70 font-bold'>
          <div className='flex items-center gap-1 sm:gap-2'>
            <svg
              className='w-3 h-3 sm:w-4 sm:h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <circle cx='12' cy='2' r='3' />
              <path d='M12 21v-6m0 0l-3-3m3 3l3-3' />
            </svg>
            <span className='text-xs sm:text-sm'>Gold</span>
          </div>
        </th>
        <th className='text-left text-base-content/70 font-bold'>
          <div className='flex items-center gap-1 sm:gap-2'>
            <svg
              className='w-3 h-3 sm:w-4 sm:h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
              />
            </svg>
            <span className='text-xs sm:text-sm'>Items</span>
          </div>
        </th>
      </tr>
    </motion.thead>
  );
};
