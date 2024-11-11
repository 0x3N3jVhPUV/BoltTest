import React, { useState } from 'react';
import { Menu, User, LogIn, LogOut, Settings, ChevronDown, Moon, Sun, Pill } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDark, setIsDark] = useDarkMode();

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 lg:hidden"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className={`w-6 h-6 dark:text-gray-200 transition-transform duration-200 ${isSidebarOpen ? 'rotate-90' : ''}`} />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Pill className="absolute inset-0 text-[#FF0000] animate-pulse" />
              <Pill className="absolute inset-0 text-teal-600 animate-pulse [clip-path:inset(0_50%_0_0)]" />
            </div>
            <h1 className="text-xl font-bold">
              <span className="text-[#FF0000] dark:text-[#FF3333]">F.O.M.O.</span>
              <span className="text-teal-600 dark:text-teal-400"> Cure</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <div className="relative">
            {isLoggedIn ? (
              <>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">John Doe</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => {}}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Paramètres
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                <LogIn className="w-5 h-5" />
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}