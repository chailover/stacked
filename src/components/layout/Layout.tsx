'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoginButton from '@/components/LoginButton';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Current path:', pathname);
    if (pathname !== '/') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <header className="bg-white/95 dark:bg-gray-900/95 shadow-sm backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href="/"
                  onClick={handleHomeClick}
                  className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">📚</span>
                  Stacked
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LoginButton />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                by Abdullah Khokhar
              </span>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {children}
          </div>
        </div>
      </main>

      <footer className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Stacked. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Built by Abdullah Khokhar
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 