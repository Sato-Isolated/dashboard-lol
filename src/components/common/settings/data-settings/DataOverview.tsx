import { motion } from 'motion/react';
import { Clock, HardDrive, Database } from 'lucide-react';

export default function DataOverview() {
  const dataStats = [
    { label: 'Account Created', value: 'March 2024', icon: Clock },
    { label: 'Stored Data', value: '2.3 MB', icon: HardDrive },
    { label: 'Favorites', value: '5 summoners', icon: Database },
    { label: 'Search History', value: '127 searches', icon: Database },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-base-200/50 rounded-2xl p-6'
    >
      <h3 className='text-lg font-semibold mb-4'>Data Overview</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {dataStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className='flex items-center gap-3 p-4 bg-base-100 rounded-lg border border-base-300/50'
            >
              <div className='p-2 bg-primary/10 rounded-lg'>
                <Icon className='w-4 h-4 text-primary' />
              </div>
              <div>
                <div className='font-medium'>{stat.label}</div>
                <div className='text-sm text-base-content/60'>{stat.value}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
