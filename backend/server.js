const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Tourism API Server is running!' });
});

// Health check route
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Destinations routes (example)
app.get('/api/destinations', async (req, res) => {
  try {
    // For now, return mock data since we don't have database tables set up
    const mockDestinations = [
      {
        id: "paris",
        name: "Paris, France",
        rating: 4.8,
        description: "The City of Light offers romance, culture, and incredible cuisine."
      },
      {
        id: "tokyo", 
        name: "Tokyo, Japan",
        rating: 4.7,
        description: "Modern metropolis blending tradition with cutting-edge technology."
      }
    ];
    res.json(mockDestinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Tourism API server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
