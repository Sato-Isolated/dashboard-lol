'use client';
import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Activity } from 'lucide-react';

const tabs = [
  {
    label: 'Summary',
    key: 'summary',
    icon: Activity,
    color: 'text-primary',
    description: 'Overall performance',
  },
  {
    label: 'Champions',
    key: 'champions',
    icon: Trophy,
    color: 'text-secondary',
    description: 'Champion statistics',
  },
  {
    label: 'Mastery',
    key: 'mastery',
    icon: Star,
    color: 'text-accent',
    description: 'Mastery progress',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const tabContentVariants = {
  hidden: {
    opacity: 0,
    x: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function PageWithTabs({
  header,
  left,
  center,
  champions,
  mastery,
}: {
  header: React.ReactNode;
  left: React.ReactNode;
  center: React.ReactNode;
  champions: React.ReactNode;
  mastery: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);

  // Memoized tab change handler for performance
  const handleTabChange = useCallback((tabKey: string) => {
    setActiveTab(tabKey);
  }, []);

  // Memoized tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'summary':
        return center;
      case 'champions':
        return (
          <Suspense
            fallback={
              <div className='space-y-4'>
                <div className='skeleton h-20 w-full rounded-xl'></div>
                <div className='skeleton h-16 w-full rounded-xl'></div>
                <div className='skeleton h-32 w-full rounded-xl'></div>
              </div>
            }
          >
            {champions}
          </Suspense>
        );
      case 'mastery':
        return (
          <Suspense
            fallback={
              <div className='space-y-4'>
                <div className='skeleton h-20 w-full rounded-xl'></div>
                <div className='skeleton h-16 w-full rounded-xl'></div>
                <div className='skeleton h-32 w-full rounded-xl'></div>
              </div>
            }
          >
            {mastery}
          </Suspense>
        );
      default:
        return center;
    }
  }, [activeTab, center, champions, mastery]);

  const activeTabData = tabs.find(tab => tab.key === activeTab);

  return (
    <motion.div
      className='flex flex-col gap-8 w-full px-2 sm:px-4 md:px-8'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.div variants={itemVariants}>{header}</motion.div>

      {/* Enhanced Tab Navigation */}
      <motion.div
        className='w-full flex justify-center'
        variants={itemVariants}
      >
        <div className='relative'>
          {/* Background glow effect */}
          <div className='absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-xl rounded-2xl opacity-60'></div>

          <div className='relative bg-base-100/80 backdrop-blur-sm border border-base-300/50 rounded-2xl p-2 shadow-2xl'>
            <div className='flex gap-1'>
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <motion.button
                    key={tab.key}
                    className={`relative group flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 min-w-[140px] ${
                      isActive
                        ? 'text-base-content shadow-lg'
                        : 'text-base-content/60'
                    }`}
                    onClick={() => handleTabChange(tab.key)}
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${tab.key}`}
                    role='tab'
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Active tab background */}
                    {isActive && (
                      <motion.div
                        className='absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl border border-primary/20'
                        layoutId='activeTab'
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Icon with color animation */}
                    <motion.div
                      className={`relative z-10 ${
                        isActive ? tab.color : 'text-base-content/40'
                      }`}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        rotate: isActive ? 360 : 0,
                      }}
                      transition={{
                        scale: { duration: 0.3 },
                        rotate: { duration: 0.6, ease: 'easeInOut' },
                      }}
                    >
                      <Icon size={18} />
                    </motion.div>

                    {/* Tab label */}
                    <div className='relative z-10 flex flex-col items-start'>
                      <span className='font-bold'>{tab.label}</span>
                      <span className='text-xs opacity-60 font-normal'>
                        {tab.description}
                      </span>
                    </div>
                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        className={`absolute -top-1 left-1/2 w-2 h-2 rounded-full ${tab.color.replace(
                          'text-',
                          'bg-',
                        )}`}
                        initial={{ scale: 0, x: '-50%' }}
                        animate={{ scale: 1, x: '-50%' }}
                        transition={{ delay: 0.1 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <motion.div
        className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full'
        variants={itemVariants}
      >
        {/* Left Sidebar */}
        <motion.div
          className='space-y-6'
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {left}
        </motion.div>

        {/* Main Content Area */}
        <div className='lg:col-span-2'>
          <div className='relative'>
            {/* Background effects */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl'></div>
            <div className='absolute inset-0 backdrop-blur-3xl rounded-2xl'></div>

            {/* Content container */}
            <div className='relative bg-base-100/90 backdrop-blur-sm border border-base-300/50 rounded-2xl shadow-2xl overflow-hidden'>
              {/* Tab content header */}
              <div className='bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 px-6 py-4 border-b border-base-300/30'>
                <div className='flex items-center gap-3'>
                  {activeTabData && (
                    <>
                      <motion.div
                        className={activeTabData.color}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        key={activeTab}
                        transition={{ duration: 0.5, ease: 'backOut' }}
                      >
                        <activeTabData.icon size={20} />
                      </motion.div>
                      <div>
                        <h3 className='font-bold text-lg text-base-content'>
                          {activeTabData.label}
                        </h3>
                        <p className='text-sm text-base-content/60'>
                          {activeTabData.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Tab content with animations */}
              <div className='p-6 min-h-[400px]'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={activeTab}
                    id={`tabpanel-${activeTab}`}
                    role='tabpanel'
                    variants={tabContentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    className='h-full'
                  >
                    {tabContent}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
