import React, { useState, useRef } from 'react';
import { Video } from '../types/video';
import { Play, Clock, Calendar, Subtitles, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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

  React.useEffect(() => {
    return () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <a
          href={video.video_link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
        >
          <Play className="w-16 h-16 text-white" />
        </a>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{video.title}</h3>
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
        </div>
        <p className="text-blue-600 dark:text-blue-400 text-base mb-4">{video.channel_name}</p>
        
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
  );
}