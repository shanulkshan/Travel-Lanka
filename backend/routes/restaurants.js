const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addReview,
  getOwnerRestaurants
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurant);

// Protected routes
router.post('/', protect, authorize('owner', 'admin'), createRestaurant);
router.put('/:id', protect, authorize('owner', 'admin'), updateRestaurant);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteRestaurant);
router.post('/:id/reviews', protect, addReview);

// Owner routes
router.get('/owner/my-restaurants', protect, authorize('owner'), getOwnerRestaurants);

module.exports = router;
