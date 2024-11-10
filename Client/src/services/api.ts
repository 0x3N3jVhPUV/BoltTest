import axios from 'axios';
import { Video } from '../types/video';

const API_URL = 'http://localhost:5000/api';

export const videoService = {
  getVideos: async () => {
    const response = await axios.get<Video[]>(`${API_URL}/videos`);
    return response.data;
  },

  addVideo: async (video: Video) => {
    const response = await axios.post(`${API_URL}/videos`, video);
    return response.data;
  }
};