import React, { useState, useEffect } from 'react';
import { VideoCard } from './components/VideoCard';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { VideoSummary, Category } from './types';
import { ThemeProvider } from './context/ThemeContext';

export function App() {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'All', videos: [] },
    { id: '2', name: 'Crypto', videos: [] },
    { id: '3', name: 'Africa', videos: [] },
    { id: '4', name: 'AI', videos: [] },
    { id: '5', name: 'Edu', videos: [] },
    { id: '6', name: 'Gabon', videos: [] },
    // Add other categories as needed
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('1'); // Default to 'Crypto'
  const [loading, setLoading] = useState(true);

  const [durationFilter, setDurationFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [authorFilter, setAuthorFilter] = useState<string>('');

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      fetch('http://localhost:5000/api/videos')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: VideoSummary[]) => {
          console.log('Vidéos récupérées :', data);
          console.log('Fetched data:', data);
          // Map videos to their categories
          const updatedCategories = categories.map((category) => ({
            ...category,
            videos: data.filter((video) =>
              category.name.toLowerCase() === 'all' ||
              video.category.toLowerCase() === category.name.toLowerCase()
            ),
          }));
          setCategories(updatedCategories);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching video data:', error);
          setLoading(false);
        });
    };

    // Call fetchData initially
    fetchData();

    // Set up an interval to call fetchData every 30 seconds (30000 milliseconds)
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // The dependency array remains empty

  const handleCategoryAdd = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleCategoryDelete = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory('1'); // Switch to 'All' if the selected category is deleted
    }
  };

  // Fonction pour filtrer les vidéos en fonction des critères
  const filterVideos = (videos: VideoSummary[]) => {
    return videos.filter((video) => {
      let matchesDuration = true;
      let matchesDate = true;
      let matchesAuthor = true;

      // Filtre sur la durée
      if (durationFilter) {
        if (durationFilter === 'short') {
          matchesDuration = video.duration < 240; // moins de 4 minutes
        } else if (durationFilter === 'medium') {
          matchesDuration = video.duration >= 240 && video.duration <= 1200; // entre 4 et 20 minutes
        } else if (durationFilter === 'long') {
          matchesDuration = video.duration > 1200; // plus de 20 minutes
        }
      }

      // Filtre sur la date de publication
      if (dateFilter) {
        const videoDate = new Date(video.publish_date);
        const selectedDate = new Date(dateFilter);
        matchesDate =
          videoDate.getFullYear() === selectedDate.getFullYear() &&
          videoDate.getMonth() === selectedDate.getMonth() &&
          videoDate.getDate() === selectedDate.getDate();
      }

      // Filtre sur l'auteur
      if (authorFilter) {
        matchesAuthor = video.author
          .toLowerCase()
          .includes(authorFilter.toLowerCase());
      }

      return matchesDuration && matchesDate && matchesAuthor;
    });
  };

  // Get videos for the selected category
  const currentCategory = categories.find((cat) => cat.id === selectedCategory);
  const currentVideos = currentCategory ? currentCategory.videos : [];

  // Appliquer le filtrage
  const filteredVideos = filterVideos(currentVideos);

  // Trier les vidéos par date de publication descendante
  const sortedVideos = filteredVideos.sort(
    (a, b) =>
      new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
        <Header />
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onCategoryAdd={handleCategoryAdd}
          onCategoryDelete={handleCategoryDelete}
        />
        <main className="pl-64 pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <FilterBar
              onDurationChange={setDurationFilter}
              onDateChange={setDateFilter}
              onAuthorChange={setAuthorFilter}
            />
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-white"></div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-6">
                {sortedVideos.map((video) => (
                  <VideoCard key={video.video_id} video={video} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}