const express = require('express');
const router = express.Router();

// Simulated In-Memory Database
let deliveries = [];
let assignments = [];
let statusUpdates = [];

// Allowed State Machine Transitions
const ALLOWED_TRANSITIONS = {
  REQUESTED: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: []
};

// --- ROUTES ---

// 1. Create a new delivery
router.post('/deliveries', (req, res) => {
  const { pickup_address, dropoff_address, details } = req.body;
  const newDelivery = {
    id: String(deliveries.length + 1),
    status: 'REQUESTED',
    pickup_address,
    dropoff_address,
    details,
    created_at: new Date()
  };

  deliveries.push(newDelivery);
  statusUpdates.push({
    id: String(statusUpdates.length + 1),
    delivery_id: newDelivery.id,
    status: 'REQUESTED',
    timestamp: new Date()
  });

  res.status(201).json(newDelivery);
});

// 2. Get all deliveries
router.get('/deliveries', (req, res) => {
  res.json(deliveries);
});

// 3. Get open (unassigned) deliveries
router.get('/deliveries/open', (req, res) => {
  const openDeliveries = deliveries.filter(d => d.status === 'REQUESTED');
  res.json(openDeliveries);
});

// 4. Get available riders
router.get('/riders/available', (req, res) => {
  res.json([
    { id: 'rider_1', name: 'David' },
    { id: 'rider_2', name: 'Sarah' }
  ]);
});

// 5. Get delivery by ID
router.get('/deliveries/:id', (req, res) => {
  const delivery = deliveries.find(d => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
  res.json(delivery);
});

// 6. Assign rider to delivery (Database Transaction simulation)
router.post('/deliveries/:id/assign', (req, res) => {
  const { rider_id } = req.body;
  const delivery = deliveries.find(d => d.id === req.params.id);

  if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

  // State Machine Check
  const allowedNext = ALLOWED_TRANSITIONS[delivery.status];
  if (!allowedNext.includes('ASSIGNED')) {
    return res.status(400).json({ 
      error: `Invalid status transition from ${delivery.status} to ASSIGNED` 
    });
  }

  // Transaction: Update delivery status + create assignment + add status history
  delivery.status = 'ASSIGNED';
  
  const newAssignment = {
    id: String(assignments.length + 1),
    delivery_id: delivery.id,
    rider_id,
    assigned_at: new Date()
  };
  assignments.push(newAssignment);

  statusUpdates.push({
    id: String(statusUpdates.length + 1),
    delivery_id: delivery.id,
    status: 'ASSIGNED',
    timestamp: new Date()
  });

  res.json({ message: 'Rider assigned successfully', delivery, assignment: newAssignment });
});

// 7. Update status (Enforces State Machine)
router.post('/deliveries/:id/status', (req, res) => {
  const { status } = req.body;
  const delivery = deliveries.find(d => d.id === req.params.id);

  if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

  // Validate State Machine Transition
  const allowed = ALLOWED_TRANSITIONS[delivery.status];
  if (!allowed || !allowed.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid transition: Cannot jump from ${delivery.status} to ${status}` 
    });
  }

  // Update Status & Log History
  delivery.status = status;
  statusUpdates.push({
    id: String(statusUpdates.length + 1),
    delivery_id: delivery.id,
    status,
    timestamp: new Date()
  });

  res.json({ message: `Status updated to ${status}`, delivery });
});

// 8. Cancel delivery
router.post('/deliveries/:id/cancel', (req, res) => {
  const delivery = deliveries.find(d => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

  const allowed = ALLOWED_TRANSITIONS[delivery.status];
  if (!allowed || !allowed.includes('CANCELLED')) {
    return res.status(400).json({ error: `Cannot cancel delivery in status ${delivery.status}` });
  }

  delivery.status = 'CANCELLED';
  statusUpdates.push({
    id: String(statusUpdates.length + 1),
    delivery_id: delivery.id,
    status: 'CANCELLED',
    timestamp: new Date()
  });

  res.json({ message: 'Delivery cancelled', delivery });
});

// 9. Get full history for a delivery
router.get('/deliveries/:id/history', (req, res) => {
  const deliveryId = req.params.id;
  const history = statusUpdates.filter(s => s.delivery_id === deliveryId);
  const deliveryAssignments = assignments.filter(a => a.delivery_id === deliveryId);

  res.json({
    delivery_id: deliveryId,
    status_history: history,
    assignment_history: deliveryAssignments
  });
});

module.exports = router;