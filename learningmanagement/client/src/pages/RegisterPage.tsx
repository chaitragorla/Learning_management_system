import React from 'react';

const RegisterPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div className="backdrop-blur-md bg-glass shadow-glass rounded-2xl p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-primary mb-6">Register</h2>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Name" className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="email" placeholder="Email" className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="password" placeholder="Password" className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-primary" />
        <select className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-indigo-600 transition">Register</button>
      </form>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Already have an account? <a href="/login" className="text-primary font-semibold">Login</a>
      </div>
    </div>
  </div>
);

export default RegisterPage;
