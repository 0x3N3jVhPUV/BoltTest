import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Video } from '../types/video';

interface VideoFormProps {
  onSubmit: (video: Video) => void;
}

export function VideoForm({ onSubmit }: VideoFormProps) {
  const [video, setVideo] = useState<Video>({
    video_id: '',
    title: '',
    channel_name: '',
    video_link: '',
    duration: 0,
    publish_date: '',
    has_subtitles: false,
    summary: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(video);
    setVideo({
      video_id: '',
      title: '',
      channel_name: '',
      video_link: '',
      duration: 0,
      publish_date: '',
      has_subtitles: false,
      summary: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        <PlusCircle className="w-6 h-6" />
        Add YouTube Video
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Video ID
          </label>
          <input
            type="text"
            value={video.video_id}
            onChange={(e) => setVideo({ ...video, video_id: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Title
          </label>
          <input
            type="text"
            value={video.title}
            onChange={(e) => setVideo({ ...video, title: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Channel Name
          </label>
          <input
            type="text"
            value={video.channel_name}
            onChange={(e) => setVideo({ ...video, channel_name: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Video Link
          </label>
          <input
            type="url"
            value={video.video_link}
            onChange={(e) => setVideo({ ...video, video_link: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Duration (seconds)
            </label>
            <input
              type="number"
              value={video.duration}
              onChange={(e) => setVideo({ ...video, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Publish Date (YYYYMMDD)
            </label>
            <input
              type="text"
              value={video.publish_date}
              onChange={(e) => setVideo({ ...video, publish_date: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
              required
              pattern="\d{8}"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="has_subtitles"
            checked={video.has_subtitles}
            onChange={(e) => setVideo({ ...video, has_subtitles: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
          />
          <label htmlFor="has_subtitles" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Has Subtitles
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Summary
          </label>
          <textarea
            value={video.summary}
            onChange={(e) => setVideo({ ...video, summary: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Video
        </button>
      </div>
    </form>
  );
}