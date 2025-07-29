const pool = require('../config/db');

// GET /api/destinations - Destinations με views του τελευταίου μήνα
const getAllDestinations = async (req, res) => {
  try {
    console.log('📍 Fetching all destinations...');
    
    // Πρώτα ελέγχω αν υπάρχει ο πίνακας destinations
    const destResult = await pool.query('SELECT * FROM destinations LIMIT 5');
    console.log(`Found ${destResult.rows.length} destinations`);
    
    // Ελέγχω αν υπάρχει ο πίνακας views
    const viewsTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'views'
      );
    `);
    
    const viewsTableExists = viewsTableCheck.rows[0].exists;
    console.log(`Views table exists: ${viewsTableExists}`);
    
    if (viewsTableExists) {
      // Αν υπάρχει ο πίνακας views, υπολογίζω τα monthly views
      const result = await pool.query(`
        SELECT 
          d.*,
          COALESCE(
            (SELECT SUM(v.views_count) 
             FROM views v 
             WHERE v.destination_id = d.id 
             AND v.viewed_at >= DATE_TRUNC('month', CURRENT_DATE)
             AND v.viewed_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
            ), 0
          ) as monthly_views
        FROM destinations d
        ORDER BY monthly_views DESC, d.rating DESC
      `);
      
      const destinations = result.rows.map(dest => ({
        ...dest,
        views: dest.monthly_views
      }));
      
      console.log(`Returning ${destinations.length} destinations with monthly views`);
      res.json(destinations);
    } else {
      // Αν δεν υπάρχει ο πίνακας views, επιστρέφω απλά τους προορισμούς
      const result = await pool.query(`
        SELECT *, COALESCE(views, 0) as views 
        FROM destinations 
        ORDER BY views DESC, rating DESC
      `);
      
      console.log(`Returning ${result.rows.length} destinations without views table`);
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// GET /api/destinations/:id - Destination με views του τελευταίου μήνα
const getDestinationById = async (req, res) => {
  const { id } = req.params;
  try {
    // Πάρε destination με τα views του τελευταίου μήνα
    const result = await pool.query(`
      SELECT 
        d.*,
        COALESCE(
          (SELECT SUM(v.views_count) 
           FROM views v 
           WHERE v.destination_id = d.id 
           AND v.viewed_at >= DATE_TRUNC('month', CURRENT_DATE)
           AND v.viewed_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
          ), 0
        ) as monthly_views
      FROM destinations d
      WHERE d.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    // Rename the field to "views" for frontend compatibility
    const destination = {
      ...result.rows[0],
      views: result.rows[0].monthly_views
    };
    
    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/destinations/:id/views - Αποθήκευση νέου view
const incrementViews = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Ελέγχω αν υπάρχει ο προορισμός
    const destCheck = await pool.query('SELECT id FROM destinations WHERE id = $1', [id]);
    if (destCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    // Αποθηκεύω νέο view στον πίνακα views
    await pool.query(`
      INSERT INTO views (destination_id, views_count, viewed_at) 
      VALUES ($1, 1, NOW())
    `, [id]);

    // Πάρε τα συνολικά views του τελευταίου μήνα για αυτόν τον προορισμό
    const monthlyViewsResult = await pool.query(`
      SELECT COALESCE(SUM(views_count), 0) as monthly_views
      FROM views 
      WHERE destination_id = $1 
      AND viewed_at >= DATE_TRUNC('month', CURRENT_DATE)
      AND viewed_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    `, [id]);

    const monthlyViews = parseInt(monthlyViewsResult.rows[0].monthly_views) || 0;

    res.json({ 
      views: monthlyViews,
      message: 'View recorded (monthly count)'
    });
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
