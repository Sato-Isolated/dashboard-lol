import React from 'react';
import { motion } from 'motion/react';
import type { TabNavigationProps } from '../matchCardTabsTypes';

const TabNavigationComponent: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className='flex flex-wrap gap-2 p-2 bg-base-200/50 rounded-2xl backdrop-blur-sm border border-base-content/10'>
      {tabs.map((tabItem, index) => (
        <motion.button
          key={tabItem.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTabChange(tabItem.id)}
          className={`relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-3 min-w-[120px] justify-center
            ${
              activeTab === tabItem.id
                ? `bg-${tabItem.color} text-${tabItem.color}-content shadow-lg shadow-${tabItem.color}/30 border border-${tabItem.color}/50`
                : 'bg-base-100/70 text-base-content/70 border border-base-content/10'
            }`}
        >
          <span className='text-lg'>{tabItem.icon}</span>
          <span>{tabItem.label}</span>

          {/* Active indicator */}
          {activeTab === tabItem.id && (
            <motion.div
              layoutId='activeTab'
              className='absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/20'
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
const TabNavigation = React.memo(TabNavigationComponent);
TabNavigation.displayName = 'TabNavigation';

export default TabNavigation;
