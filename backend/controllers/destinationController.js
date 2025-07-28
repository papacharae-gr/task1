const pool = require('../config/db');

// GET /api/destinations
const getAllDestinations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM destinations');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/destinations/:id
const getDestinationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM destinations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/destinations/:id/views
const incrementViews = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE destinations SET views = COALESCE(views, 0) + 1 WHERE id = $1 RETURNING views',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json({ views: result.rows[0].views });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllDestinations,
  getDestinationById,
  incrementViews
};
