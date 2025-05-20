import React from "react";

const fakeTabs = [
  { label: "Summary", active: true },
  { label: "Champions", active: false },
  { label: "Mastery", active: false },
];

const TabsSection: React.FC = () => (
  <div className="flex gap-2 w-full border-b border-base-300 pb-2">
    {fakeTabs.map((tab, i) => (
      <button key={i} className={`tab${tab.active ? " tab-active" : ""}`}>
        {tab.label}
      </button>
    ))}
  </div>
);

export default TabsSection;
