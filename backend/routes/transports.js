const express = require('express');
const router = express.Router();
const {
  getAllTransports,
  getTransport,
  createTransport,
  updateTransport,
  deleteTransport,
  addReview,
  getOwnerTransports
} = require('../controllers/transportController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllTransports);
router.get('/:id', getTransport);

// Protected routes
router.post('/', protect, authorize('owner', 'admin'), createTransport);
router.put('/:id', protect, authorize('owner', 'admin'), updateTransport);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteTransport);
router.post('/:id/reviews', protect, addReview);

// Owner routes
router.get('/owner/my-transports', protect, authorize('owner'), getOwnerTransports);

module.exports = router;
