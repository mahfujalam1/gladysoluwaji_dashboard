import React from 'react';
import Sidebar from './Sidebar';
import AppHeader from './Header';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 pt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
