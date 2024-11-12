const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const host = '0.0.0.0'; // Replit uses 0.0.0.0 to listen on all interfaces

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Replace '*' with your frontend's domain in production
}));

// Serve static files from the frontend build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Array to store video data
let videoData = [];

// Endpoint to receive video details
app.post('/api/videos', (req, res) => {
  const videoDetails = req.body;

  // Ensure the category field is present
  const category = videoDetails.category;
  if (!category) {
    return res.status(400).send('Category is required');
  }

  videoData.push(videoDetails); // Store the received video details
  console.log('Received video details:', videoDetails);
  res.status(200).send('Video details received');
});

// Endpoint to retrieve video data
app.get('/api/videos', (req, res) => {
  res.json(videoData);
});

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});