import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col px-4 py-8">
    <div className="flex-1 bg-base-200 rounded-2xl shadow-lg p-6 flex flex-col">
      {children}
    </div>
  </div>
);

export default MainLayout;
