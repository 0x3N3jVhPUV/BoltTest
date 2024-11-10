import React from 'react';
import { Home, Clock, Star, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Accueil', active: true },
    { icon: Clock, label: 'Récents' },
    { icon: Star, label: 'Favoris' },
    { icon: Settings, label: 'Paramètres' }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`
          fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden
          ${isOpen ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 bottom-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${item.active 
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}