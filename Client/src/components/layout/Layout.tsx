import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clone children and pass selectedCategory as prop
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { selectedCategory });
    }
    return child;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      
      <main className={`
        pt-16 transition-[padding] duration-300
        ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}
        min-h-[calc(100vh-4rem)]
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {childrenWithProps}
        </div>
      </main>

      <div className={`
        transition-[padding] duration-300
        ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}
      `}>
        <Footer />
      </div>
    </div>
  );
}