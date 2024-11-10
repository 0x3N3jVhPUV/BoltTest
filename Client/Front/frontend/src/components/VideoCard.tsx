import { format } from 'date-fns';
import { useState } from 'react';
import { VideoSummary } from '../types';
import { VideoModal } from './VideoModal';
import { TTSButton } from './TTSButton';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface VideoCardProps {
  video: VideoSummary;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(
      parseInt(dateString.substring(0, 4)),
      parseInt(dateString.substring(4, 6)) - 1,
      parseInt(dateString.substring(6, 8))
    );
    return format(date, 'MMM d, yyyy');
  };

  const thumbnailUrl = `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackThumbnailUrl;
  };

  return (
    <>
      <article className="bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-colors">
        <div 
          className="aspect-video relative overflow-hidden bg-zinc-200 dark:bg-zinc-800"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="block w-full h-full focus:outline-none"
          >
            <img
              src={thumbnailUrl}
              onError={handleImageError}
              alt={video.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 filter hover:brightness-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 backdrop-blur-sm text-white px-2 py-1 rounded text-xs sm:text-sm">
              {formatDuration(video.duration)}
            </div>
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white group">
              <a 
                href={video.video_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-zinc-600 dark:hover:text-zinc-300 inline-flex items-center gap-2"
              >
                {video.title}
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
              </a>
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <span>{video.channel_name}</span>
              <span>•</span>
              <span>{formatDate(video.publish_date)}</span>
            </div>
          </div>

          <div className="relative">
            <div 
              className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-zinc dark:prose-invert text-zinc-600 dark:text-zinc-300 transition-all duration-500 ease-in-out ${
                isExpanded ? 'max-h-[5000px]' : 'max-h-32'
              }`}
              style={{
                maskImage: isExpanded ? 'none' : 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: isExpanded ? 'none' : 'linear-gradient(to bottom, black 60%, transparent 100%)'
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: video.summary }} />
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors mt-2 bg-gradient-to-t from-zinc-100 via-zinc-100 dark:from-zinc-900 dark:via-zinc-900 text-sm sm:text-base"
            >
              {isExpanded ? (
                <>
                  Show Less
                  <ChevronUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              ) : (
                <>
                  Read More
                  <ChevronDownIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md shadow-sm text-white bg-zinc-900 hover:bg-zinc-800 dark:text-black dark:bg-white dark:hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 w-full sm:w-auto transition-colors"
            >
              Watch Preview
            </button>
            <a
              href={video.video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-zinc-300 dark:border-zinc-700 text-sm sm:text-base font-medium rounded-md shadow-sm text-zinc-900 dark:text-white bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 w-full sm:w-auto transition-colors"
            >
              Watch on YouTube
              <svg 
                className="ml-2 w-3 h-3 sm:w-4 sm:h-4" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
              </svg>
            </a>
            <TTSButton text={video.summary} />
          </div>
        </div>
      </article>

      <VideoModal
        videoId={video.video_id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}