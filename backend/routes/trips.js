const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/trips/saved - Λήψη saved destinations
router.get('/saved', async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';
    
    const query = `
      SELECT ut.id as trip_id, ut.date_added, d.* 
      FROM user_trips ut
      JOIN destinations d ON ut.destination_id = d.id
      WHERE ut.user_id = $1
      ORDER BY ut.id DESC  -- Άλλαξε από ut.date_added DESC
    `;
    
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching saved trips:', error);
    res.status(500).json({ error: 'Failed to fetch saved trips' });
  }
});

// POST /api/trips/saved - Προσθήκη destination στα saved
router.post('/saved', async (req, res) => {
  try {
    const { destinationId, userId = 'default_user' } = req.body;
    
    
    const existing = await pool.query(
      'SELECT id FROM user_trips WHERE destination_id = $1 AND user_id = $2',
      [destinationId, userId]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Already saved' });
    }
    
    const result = await pool.query(
      'INSERT INTO user_trips (destination_id, user_id) VALUES ($1, $2) RETURNING *',
      [destinationId, userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving trip:', error);
    res.status(500).json({ error: 'Failed to save trip' });
  }
});

// DELETE /api/trips/saved/:id - Διαγραφή saved destination
router.delete('/saved/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId || 'default_user';
    
    const result = await pool.query(
      'DELETE FROM user_trips WHERE destination_id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Saved trip not found' });
    }
    
    res.json({ message: 'Saved trip removed successfully' });
  } catch (error) {
    console.error('Error removing saved trip:', error);
    res.status(500).json({ error: 'Failed to remove saved trip' });
  }
});

// GET /api/trips/planned - Λήψη planned trips
router.get('/planned', async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';
    
    const result = await pool.query(
      `SELECT id, title, 
       departure_date::date as departure_date,  -- Force date-only format
       return_date::date as return_date,        -- Force date-only format
       status, destinations, user_id
       FROM planned_trips 
       WHERE user_id = $1 
       ORDER BY id DESC`,
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching planned trips:', error);
    res.status(500).json({ error: 'Failed to fetch planned trips' });
  }
});

// POST /api/trips/planned - Προσθήκη planned trip
router.post('/planned', async (req, res) => {
  try {
    const { title, departureDate, returnDate, status, destinations, userId = 'default_user' } = req.body;
    
    const result = await pool.query(
      'INSERT INTO planned_trips (title, departure_date, return_date, status, destinations, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, departureDate, returnDate, status || 'Planning', destinations, userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating planned trip:', error);
    res.status(500).json({ error: 'Failed to create planned trip' });
  }
});

// PUT /api/trips/planned/:id - Ενημέρωση planned trip
router.put('/planned/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, departureDate, returnDate, status, destinations } = req.body;
    
    const result = await pool.query(
      'UPDATE planned_trips SET title = $1, departure_date = $2, return_date = $3, status = $4, destinations = $5 WHERE id = $6 RETURNING *',
      [title, departureDate, returnDate, status, destinations, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Planned trip not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating planned trip:', error);
    res.status(500).json({ error: 'Failed to update planned trip' });
  }
});

// DELETE /api/trips/planned/:id - Διαγραφή planned trip
router.delete('/planned/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM planned_trips WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Planned trip not found' });
    }
    
    res.json({ message: 'Planned trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting planned trip:', error);
    res.status(500).json({ error: 'Failed to delete planned trip' });
  }
});

module.exports = router;