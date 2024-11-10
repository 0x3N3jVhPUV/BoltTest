import React from 'react';
import { Layout } from './components/layout/Layout';
import { VideoList } from './components/VideoList';
import { mockVideos } from './data/mockData';

function App() {
  return (
    <Layout>
      <VideoList videos={mockVideos} />
    </Layout>
  );
}

export default App;