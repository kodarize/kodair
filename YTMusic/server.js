// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

// Serve static files
app.use(express.static('public'));

// Endpoint to search for songs
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: 1,
        q: query,
        key: YOUTUBE_API_KEY,
        type: 'video'
      }
    });
    res.json(response.data.items);
  } catch (error) {
    res.status(500).send('Error fetching search results');
  }
});

// Endpoint to get related songs
app.get('/api/related', async (req, res) => {
  const { videoId } = req.query;
  try {
    const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: 1,
        relatedToVideoId: videoId,
        type: 'video',
        key: YOUTUBE_API_KEY
      }
    });
    res.json(response.data.items);
  } catch (error) {
    res.status(500).send('Error fetching related videos');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});