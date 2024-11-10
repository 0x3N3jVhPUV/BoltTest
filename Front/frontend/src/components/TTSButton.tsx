import { useState, useEffect } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

interface TTSButtonProps {
  text: string;
}

export function TTSButton({ text }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Clean text by removing HTML tags and converting HTML entities
    const cleanText = text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    const newUtterance = new SpeechSynthesisUtterance(cleanText);
    
    // Get available voices and set to English
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith('en-'));
    if (englishVoice) {
      newUtterance.voice = englishVoice;
    }

    newUtterance.rate = 1;
    newUtterance.pitch = 1;

    newUtterance.onend = () => {
      setIsPlaying(false);
    };

    newUtterance.onerror = () => {
      setIsPlaying(false);
    };

    setUtterance(newUtterance);
    setIsPlaying(true);
    window.speechSynthesis.speak(newUtterance);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (utterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, [utterance]);

  return (
    <button
      onClick={handlePlay}
      className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-zinc-300 dark:border-zinc-700 text-sm sm:text-base font-medium rounded-md shadow-sm text-zinc-900 dark:text-white bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 w-full sm:w-auto transition-colors"
      aria-label={isPlaying ? 'Stop reading' : 'Read summary'}
    >
      {isPlaying ? (
        <>
          <SpeakerXMarkIcon className="w-5 h-5 mr-2" />
          Stop Reading
        </>
      ) : (
        <>
          <SpeakerWaveIcon className="w-5 h-5 mr-2" />
          Read Summary
        </>
      )}
    </button>
  );
}