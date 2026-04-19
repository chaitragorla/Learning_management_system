import React from 'react';

const Sidebar = () => (
  <aside className="hidden md:flex flex-col w-64 h-full bg-white/80 dark:bg-gray-900/80 shadow-glass backdrop-blur-md p-6 border-r border-gray-200 dark:border-gray-800">
    <div className="font-bold text-2xl text-primary mb-8 tracking-tight">LMS</div>
    <nav className="flex flex-col gap-4">
      <a href="/dashboard" className="hover:text-primary transition">Dashboard</a>
      <a href="/courses" className="hover:text-primary transition">Courses</a>
      <a href="/assignments" className="hover:text-primary transition">Assignments</a>
      <a href="/profile" className="hover:text-primary transition">Profile</a>
    </nav>
  </aside>
);

export default Sidebar;
