"use client";
import React from "react";
import TabsSection, { Tab } from "@/components/match/TabsSection";

const tabs: Tab[] = [
  { label: "Summary", key: "summary" },
  { label: "Champions", key: "champions" },
  { label: "Mastery", key: "mastery" },
];

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
  const [activeTab, setActiveTab] = React.useState<string>(tabs[0].key);

  return (
    <div className="flex flex-col gap-8 w-full px-2 sm:px-4 md:px-8">
      {header}
      <div className="w-full flex justify-center">
        <div className="tabs tabs-boxed bg-base-200 rounded-xl shadow mb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab tab-lg transition-all duration-200 font-semibold px-6 py-2 text-base ${
                activeTab === tab.key
                  ? "tab-active bg-primary text-primary-content shadow-lg scale-105"
                  : "hover:bg-base-300 text-base-content/80"
              }`}
              onClick={() => setActiveTab(tab.key)}
              aria-selected={activeTab === tab.key}
              aria-controls={`tabpanel-${tab.key}`}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {left}
        <div className="lg:col-span-2">
          <div
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            className="bg-base-100 rounded-xl shadow p-4 min-h-[300px] animate-fadein"
          >
            {activeTab === "summary" && center}
            {activeTab === "champions" && champions}
            {activeTab === "mastery" && mastery}
          </div>
        </div>
      </div>
    </div>
  );
}
