import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto pl-72 pr-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              F.O.M.O. Killer
            </h1>
          </div>
          <ThemeToggle />
          <button onClick={onToggleSidebar} className="toggle-sidebar-button">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};