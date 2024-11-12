import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { VideoList } from './components/VideoList';
import { Video } from './types/video';

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [favoriteThemes, setFavoriteThemes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Fonction pour récupérer les vidéos du serveur
    const fetchData = () => {
      fetch('/api/videos', { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
          // Trier les vidéos par date d'ajout ou de publication
          const sortedVideos = data.sort((a: Video, b: Video) => {
            // Si vous avez un champ 'added_date' (format ISO 8601)
            // return new Date(b.added_date).getTime() - new Date(a.added_date).getTime();

            // Si vous utilisez 'publish_date' au format 'YYYYMMDD'
            return parseInt(b.publish_date) - parseInt(a.publish_date);
          });
          setVideos(sortedVideos);
        })
        .catch(error => console.error('Erreur lors de la récupération des vidéos :', error));
    };

    // Récupérer les données immédiatement au montage du composant
    fetchData();

    // Mettre en place un intervalle pour récupérer les données toutes les 10 secondes
    const intervalId = setInterval(fetchData, 10000);

    // Nettoyer l'intervalle lors du démontage du composant
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