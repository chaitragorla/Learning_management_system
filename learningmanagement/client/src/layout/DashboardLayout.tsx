import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Topbar />
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  </div>
);

export default DashboardLayout;
