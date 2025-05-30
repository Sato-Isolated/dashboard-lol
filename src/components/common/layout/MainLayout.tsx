import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className='min-h-screen flex flex-col px-4 py-8 bg-base-200'>
    <div className='flex-1 card bg-base-100 rounded-2xl shadow-xl p-6 flex flex-col border border-primary/10'>
      {children}
    </div>
  </div>
);

export default MainLayout;
