import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Video } from '../../types/video';

interface LayoutProps {
  videos: Video[];
  children: React.ReactNode;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function Layout({ videos, children, selectedCategory, onCategorySelect }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Calculate video counts for each theme
  const getThemeCount = (theme: string, isFavorite: boolean = false) => {
    if (!videos) return 0;
    
    if (theme.toLowerCase() === 'all') {
      if (isFavorite) {
        return videos.filter(video => video.favorite_themes && video.favorite_themes.length > 0).length;
      }
      return videos.length;
    }
    if (isFavorite) {
      return videos.filter(video =>
        video.favorite_themes?.some(favTheme => favTheme.toLowerCase() === theme.toLowerCase())
      ).length;
    }
    return videos.filter(video =>
      video.category && video.category.toLowerCase() === theme.toLowerCase()
    ).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        onToggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        onCategorySelect={onCategorySelect}
        selectedCategory={selectedCategory}
        onClose={() => isMobile && setIsSidebarOpen(false)}
        getThemeCount={getThemeCount}
      />
      
      <main className={`
        pt-16 transition-[padding] duration-300
        ${isSidebarOpen && !isMobile ? 'lg:pl-64' : 'lg:pl-0'}
        min-h-[calc(100vh-4rem)]
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <div className={`
        transition-[padding] duration-300
        ${isSidebarOpen && !isMobile ? 'lg:pl-64' : 'lg:pl-0'}
      `}>
        <Footer />
      </div>
    </div>
  );
}