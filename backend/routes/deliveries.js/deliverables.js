const express = require('express');
const router = express.Router();

// Get all deliveries
router.get('/', (req, res) => {
  res.json({ message: 'Fetch all deliveries route' });
});

// Create a new delivery
router.post('/', (req, res) => {
  res.json({ message: 'Create delivery route' });
});

// Get single delivery by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Fetch delivery ${req.params.id}` });
});

module.exports = router;