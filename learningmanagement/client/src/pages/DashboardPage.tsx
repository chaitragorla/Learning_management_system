import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';

const DashboardPage = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-glass p-6">
        <h2 className="text-xl font-semibold mb-2">Enrolled Courses</h2>
        <div className="h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg"></div>
      </div>
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-glass p-6">
        <h2 className="text-xl font-semibold mb-2">Assignments</h2>
        <div className="h-24 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg"></div>
      </div>
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-glass p-6">
        <h2 className="text-xl font-semibold mb-2">Progress</h2>
        <div className="h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg"></div>
      </div>
    </div>
  </DashboardLayout>
);

export default DashboardPage;
