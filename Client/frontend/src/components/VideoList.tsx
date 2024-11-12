import React, { useState, useMemo, useEffect } from 'react';
import { Video } from '../types/video';
import { VideoCard } from './VideoCard';
import { TopBar } from './TopBar';
import { Pagination } from './Pagination';

interface VideoListProps {
  videos: Video[];
  selectedCategory: string;
  favoriteThemes: string[];
  onAddToFavorites: (videoId: string, theme: string) => void;
  onAddFavoriteTheme: (theme: string) => void;
}

export function VideoList({ 
  videos, 
  selectedCategory,
  favoriteThemes,
  onAddToFavorites,
  onAddFavoriteTheme 
}: VideoListProps) {
  const [durationFilter, setDurationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sortedVideos = useMemo(() => {
    // Trier les vidéos par date d'ajout ou de publication
    return [...videos].sort((a, b) => {
      // Si vous avez un champ 'added_date' (format ISO 8601)
      // return new Date(b.added_date).getTime() - new Date(a.added_date).getTime();

      // Si vous utilisez 'publish_date' au format 'YYYYMMDD'
      return parseInt(b.publish_date) - parseInt(a.publish_date);
    });
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return sortedVideos.filter(video => {
      let passesFilters = true;

      // Filtre par catégorie
      if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
        passesFilters = passesFilters && video.category?.toLowerCase() === selectedCategory.toLowerCase();
      }

      // Filtre par durée
      if (durationFilter) {
        const [min, max] = durationFilter.split('-').map(Number);
        if (max) {
          passesFilters = passesFilters && video.duration >= min && video.duration < max;
        } else {
          passesFilters = passesFilters && video.duration >= min;
        }
      }

      // Filtre par date
      if (dateFilter) {
        const days = parseInt(dateFilter, 10);
        if (!isNaN(days)) {
          const now = new Date();
          const targetDate = new Date();
          targetDate.setDate(now.getDate() - days);

          const publishDate = new Date(
            parseInt(video.publish_date.substring(0, 4)),
            parseInt(video.publish_date.substring(4, 6)) - 1,
            parseInt(video.publish_date.substring(6, 8))
          );

          passesFilters = passesFilters && publishDate >= targetDate && publishDate <= now;
        }
      }

      return passesFilters;
    });
  }, [sortedVideos, selectedCategory, durationFilter, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, durationFilter, dateFilter, itemsPerPage]);

  return (
    <div className="space-y-8">
      <TopBar
        onDurationFilter={setDurationFilter}
        onDateFilter={setDateFilter}
      />
      
      {currentVideos.map((video, index) => (
        <VideoCard 
          key={video.id || index} 
          video={video}
          onAddToFavorites={onAddToFavorites}
          favoriteThemes={favoriteThemes}
          onAddFavoriteTheme={onAddFavoriteTheme}
        />
      ))}

      {filteredVideos.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
}