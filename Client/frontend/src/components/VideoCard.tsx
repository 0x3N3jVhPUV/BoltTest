import React, { useState, useRef } from 'react';
import { Video } from '../types/video';
import { Play, Clock, Calendar, Subtitles, ChevronDown, ChevronUp, Volume2, VolumeX, Maximize2, Minimize2, Star } from 'lucide-react';
import { ShareButtons } from './ShareButtons';
import { FavoriteModal } from './FavoriteModal';

interface VideoCardProps {
  video: Video;
  onAddToFavorites: (videoId: string, theme: string) => void;
  favoriteThemes: string[];
  onAddFavoriteTheme: (theme: string) => void;
}

export function VideoCard({ video, onAddToFavorites, favoriteThemes, onAddFavoriteTheme }: VideoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWatchingVideo, setIsWatchingVideo] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const detectLanguage = (text: string): 'fr-FR' | 'en-US' => {
    const frenchWords = ['et', 'est', 'sont', 'dans', 'pour', 'avec', 'sur', 'les', 'des'];
    const textWords = text.toLowerCase().split(/\s+/);
    const frenchWordCount = textWords.filter(word => frenchWords.includes(word)).length;
    return frenchWordCount > 2 ? 'fr-FR' : 'en-US';
  };

  const handleTTS = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const cleanText = stripHtml(video.summary);
    const language = detectLanguage(cleanText);

    speechSynthRef.current = new SpeechSynthesisUtterance(cleanText);
    speechSynthRef.current.lang = language;
    speechSynthRef.current.onend = () => setIsPlaying(false);
    speechSynthRef.current.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(speechSynthRef.current);
    setIsPlaying(true);
  };

  const toggleVideo = () => {
    setIsWatchingVideo(!isWatchingVideo);
    if (isPlaying) {
      handleTTS();
    }
  };

  const getChannelUrl = () => {
    const videoUrl = new URL(video.video_link);
    return `https://www.youtube.com/channel/${videoUrl.searchParams.get('v')}`;
  };

  React.useEffect(() => {
    return () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="relative aspect-video">
          {isWatchingVideo ? (
            <div className="relative w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${video.video_id}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
              <button
                onClick={toggleVideo}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-lg text-white transition-colors z-10"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <img
                src={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={toggleVideo}
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 group"
              >
                <div className="transform transition-transform duration-200 group-hover:scale-110">
                  <Play className="w-16 h-16 text-white" />
                </div>
              </button>
            </>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start gap-4 mb-3">
            <a
              href={video.video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {video.title}
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTTS}
                className={`flex-shrink-0 p-2 rounded-lg transition-colors duration-200 ${
                  isPlaying 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                aria-label={isPlaying ? 'Stop reading' : 'Read summary'}
              >
                {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowFavoriteModal(true)}
                className="flex-shrink-0 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                aria-label="Add to favorites"
              >
                <Star className={`w-5 h-5 ${video.favorite_themes?.length ? 'text-yellow-500 fill-yellow-500' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <a
              href={getChannelUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-base hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {video.channel_name}
            </a>
            
            <ShareButtons url={video.video_link} title={video.title} />
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(video.publish_date)}</span>
            </div>
            {video.has_subtitles && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Subtitles className="w-4 h-4" />
                <span>Sous-titres disponibles</span>
              </div>
            )}
          </div>

          <div className={`prose prose-sm dark:prose-invert max-w-none overflow-hidden transition-[max-height] duration-300 ease-in-out ${isExpanded ? 'max-h-[5000px]' : 'max-h-[150px]'}`}>
            <div dangerouslySetInnerHTML={{ __html: video.summary }} />
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            {isExpanded ? (
              <>
                Voir moins
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Voir plus
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <FavoriteModal
        isOpen={showFavoriteModal}
        onClose={() => setShowFavoriteModal(false)}
        onSave={(theme) => {
          onAddToFavorites(video.video_id, theme);
          setShowFavoriteModal(false);
        }}
        favoriteThemes={favoriteThemes}
        onAddTheme={onAddFavoriteTheme}
      />
    </>
  );
}