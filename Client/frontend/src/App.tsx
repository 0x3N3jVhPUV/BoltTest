import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { VideoList } from './components/VideoList';
import { Video } from './types/video';

//Should be in .env
//REACT_APP_API_BASE_URL="http://localhost:5000" 

// Get the API base URL from environment variables
const API_BASE_URL ="http://0.0.0.0:5000/api/videos" || '';

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [favoriteThemes, setFavoriteThemes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/videos`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Video[] = await response.json();
        const sortedVideos = data.sort((a, b) => parseInt(b.publish_date) - parseInt(a.publish_date));
        setVideos(sortedVideos);
      } catch (error) {
        console.error('Erreur lors de la récupération des vidéos :', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

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

  return (
    <Layout
      videos={videos}
      selectedCategory={selectedCategory}
      onCategorySelect={setSelectedCategory}
    >
      <VideoList
        videos={videos}
        favoriteThemes={favoriteThemes}
        onAddToFavorites={handleAddToFavorites}
        onAddFavoriteTheme={handleAddFavoriteTheme}
        selectedCategory={selectedCategory}
      />
    </Layout>
  );
}

export default App;