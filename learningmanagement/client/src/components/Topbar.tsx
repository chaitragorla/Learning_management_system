import React from 'react';

const Topbar = () => (
  <header className="w-full h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-gray-900/80 shadow-glass backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <div className="font-bold text-xl text-primary">LMS</div>
    <div className="flex items-center gap-4">
      <button className="rounded-full w-10 h-10 bg-primary text-white flex items-center justify-center font-bold">U</button>
    </div>
  </header>
);

export default Topbar;
