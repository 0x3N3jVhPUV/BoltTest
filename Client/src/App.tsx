import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { VideoList } from './components/VideoList';
import { mockVideos } from './data/mockData';
import { Video } from './types/video';

function App() {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [favoriteThemes, setFavoriteThemes] = useState<string[]>([]);

  const handleAddToFavorites = (videoId: string, theme: string) => {
    setVideos(prevVideos => 
      prevVideos.map(video => {
        if (video.video_id === videoId) {
          const currentThemes = video.favorite_themes || [];
          if (!currentThemes.includes(theme)) {
            return {
              ...video,
              favorite_themes: [...currentThemes, theme]
            };
          }
        }
        return video;
      })
    );
  };

  const handleAddFavoriteTheme = (theme: string) => {
    if (!favoriteThemes.includes(theme)) {
      setFavoriteThemes(prev => [...prev, theme]);
    }
  };

  const handleRemoveFavoriteTheme = (theme: string) => {
    setFavoriteThemes(prev => prev.filter(t => t !== theme));
    setVideos(prevVideos =>
      prevVideos.map(video => ({
        ...video,
        favorite_themes: video.favorite_themes?.filter(t => t !== theme)
      }))
    );
  };

  return (
    <Layout
      favoriteThemes={favoriteThemes}
      onAddFavoriteTheme={handleAddFavoriteTheme}
      onRemoveFavoriteTheme={handleRemoveFavoriteTheme}
    >
      <VideoList 
        videos={videos}
        favoriteThemes={favoriteThemes}
        onAddToFavorites={handleAddToFavorites}
        onAddFavoriteTheme={handleAddFavoriteTheme}
      />
    </Layout>
  );
}

export default App;