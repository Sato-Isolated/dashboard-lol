"use client";
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeaderSection from "@/components/layout/HeaderSection";
import TabsSection, { Tab } from "@/components/match/TabsSection";
import LeftColumn from "@/components/layout/LeftColumn";
import CenterColumn from "@/components/layout/CenterColumn";
import ChampionsTab from "@/components/match/ChampionsTab";
import MasteryTab from "@/components/match/MasteryTab";

const tabs: Tab[] = [
  { label: "Summary", key: "summary" },
  { label: "Champions", key: "champions" },
  { label: "Mastery", key: "mastery" },
];

export default function PageWithTabs({ data }: { data: any }) {
  const [activeTab, setActiveTab] = React.useState<string>(tabs[0].key);

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 w-full">
        <HeaderSection />
        <TabsSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <LeftColumn />
          <div className="lg:col-span-2">
            {activeTab === "summary" && <CenterColumn />}
            {activeTab === "champions" && <ChampionsTab />}
            {activeTab === "mastery" && <MasteryTab />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 