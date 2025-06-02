import React from 'react';

export interface Tab {
  label: string;
  key: string;
}

interface TabsSectionProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

const TabsSection: React.FC<TabsSectionProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => (
  <div className='flex gap-2 w-full border-b border-base-300 pb-2'>
    {tabs.map(tab => (
      <button
        key={tab.key}
        className={`tabs${activeTab === tab.key ? ' tabs-active' : ''}`}
        onClick={() => onTabChange(tab.key)}
        type='button'
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default TabsSection;
