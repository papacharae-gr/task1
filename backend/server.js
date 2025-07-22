const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); 
require('dotenv').config();




const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Tourism API Server is running!' });
});

// Health check
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

// Destination routes
const destinationRoutes = require('./routes/destinationRoutes');
app.use('/api/destinations', destinationRoutes);


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
  console.log(`✅ Tourism API server is running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
