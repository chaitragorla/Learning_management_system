import React from 'react';

const LandingPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div className="backdrop-blur-md bg-glass shadow-glass rounded-2xl p-10 max-w-2xl w-full text-center">
      <h1 className="text-5xl font-extrabold text-primary mb-4 drop-shadow-lg">Welcome to LMS</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">A modern, enterprise-grade Learning Management System for instructors and students.</p>
      <div className="flex justify-center gap-4">
        <a href="/login" className="px-8 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:bg-indigo-600 transition">Login</a>
        <a href="/register" className="px-8 py-3 rounded-lg bg-white/80 text-primary font-semibold shadow hover:bg-white/60 border border-primary transition">Register</a>
      </div>
    </div>
  </div>
);

export default LandingPage;
