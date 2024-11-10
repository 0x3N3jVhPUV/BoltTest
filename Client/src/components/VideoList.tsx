import React, { useState, useMemo } from 'react';
import { Video } from '../types/video';
import { VideoCard } from './VideoCard';
import { TopBar } from './TopBar';
import { Pagination } from './Pagination';

interface VideoListProps {
  videos: Video[];
}

export function VideoList({ videos }: VideoListProps) {
  const [durationFilter, setDurationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      let passesFilters = true;

      // Duration filter
      if (durationFilter) {
        const [min, max] = durationFilter.split('-').map(Number);
        if (max) {
          passesFilters = passesFilters && video.duration >= min && video.duration < max;
        } else {
          // For "3600+" case
          passesFilters = passesFilters && video.duration >= min;
        }
      }

      // Date filter
      if (dateFilter) {
        const publishDate = new Date(
          video.publish_date.substring(0, 4),
          parseInt(video.publish_date.substring(4, 6)) - 1,
          video.publish_date.substring(6, 8)
        );
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            passesFilters = passesFilters && publishDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            passesFilters = passesFilters && publishDate >= weekAgo;
            break;
          case 'month':
            passesFilters = passesFilters && 
              publishDate.getMonth() === now.getMonth() &&
              publishDate.getFullYear() === now.getFullYear();
            break;
          case 'year':
            passesFilters = passesFilters && publishDate.getFullYear() === now.getFullYear();
            break;
        }
      }

      return passesFilters;
    });
  }, [videos, durationFilter, dateFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  // Reset to first page when filters or items per page change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [durationFilter, dateFilter, itemsPerPage]);

  return (
    <div className="space-y-8">
      <TopBar
        onDurationFilter={setDurationFilter}
        onDateFilter={setDateFilter}
      />
      
      {currentVideos.map((video, index) => (
        <VideoCard key={video.id || index} video={video} />
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