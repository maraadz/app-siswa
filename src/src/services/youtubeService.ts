import axios from 'axios';

const API_KEY = 'AIzaSyCYlF6USt9_fxh7J-qzaIPFNVZVv6Obnp0';
const CHANNEL_ID = 'UCn-e9WwKID6n6O_69X2V_yA'; 

export const getSismatvVideos = async () => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`, {
        params: {
          key: API_KEY,
          channelId: CHANNEL_ID,
          part: 'snippet,id',
          order: 'date', // Ambil yang terbaru
          maxResults: 6, // Ambil 6 video terbaru
          type: 'video'
        }
      }
    );
    return response.data.items;
  } catch (error) {
    console.error("Gagal ambil video YouTube:", error);
    return [];
  }
};