const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Array to store video data
let videoData = [];

// Endpoint to receive video details
app.post('/api/videos', (req, res) => {
  const videoDetails = {
    ...req.body,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  videoData.push(videoDetails);
  console.log('Received video details:', videoDetails);
  res.status(200).json(videoDetails);
});

// Add this endpoint to serve video data
app.get('/api/videos', (req, res) => {
  res.json(videoData);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});