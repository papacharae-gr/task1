const express = require('express');
const router = express.Router();
const {
  getAllDestinations,
  getDestinationById
} = require('../controllers/destinationController');

router.get('/', getAllDestinations);        // GET /api/destinations
router.get('/:id', getDestinationById);     // GET /api/destinations/:id

module.exports = router;
