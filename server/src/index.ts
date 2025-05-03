import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import firestoreRoutes from './routes/firestore-new';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/firestore', firestoreRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// MapTiler proxy endpoint
app.get('/api/maptiler/style', async (req, res) => {
  try {
    // Get the MapTiler API key from environment variables
    const apiKey = process.env.MAPTILER_API_KEY;

    if (!apiKey) {
      throw new Error('MapTiler API key not configured');
    }

    // Construct the MapTiler URL with the API key
    const url = `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;

    // Make the request to MapTiler
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'json'
    });

    // Send the response back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error proxying request to MapTiler:', error);
    res.status(500).json({ error: 'Error proxying request to MapTiler' });
  }
});

// Generic MapTiler proxy endpoint for other resources (tiles, etc.)
app.get('/api/maptiler/:path', async (req, res) => {
  try {
    // Get the MapTiler API key from environment variables
    const apiKey = process.env.MAPTILER_API_KEY;

    if (!apiKey) {
      throw new Error('MapTiler API key not configured');
    }

    // Extract the path from the request
    const pathParam = req.params.path;
    const url = `https://api.maptiler.com/${pathParam}`;

    // Add the API key to the query parameters
    const params = new URLSearchParams(req.query as Record<string, string>);
    params.append('key', apiKey);

    // Make the request to MapTiler
    const response = await axios({
      method: req.method,
      url: `${url}?${params.toString()}`,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'User-Agent': req.headers['user-agent'] || 'KaspaTaxi-App',
      },
      responseType: 'arraybuffer'
    });

    // Set the response headers
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        res.set(key, value);
      }
    });

    // Send the response
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error proxying request to MapTiler:', error);
    res.status(500).send('Error proxying request to MapTiler');
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../dist');
  app.use(express.static(distPath));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
