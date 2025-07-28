const express = require('express');
const router = express.Router();
const {
  getAllDestinations,
  getDestinationById,
  incrementViews
} = require('../controllers/destinationController');

router.get('/', getAllDestinations);           // GET /api/destinations
router.get('/:id', getDestinationById);        // GET /api/destinations/:id
router.patch('/:id/views', incrementViews);    // PATCH /api/destinations/:id/views

module.exports = router;
