const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  verifyHotel,
  getMyHotels
} = require('../controllers/hotelController');
const { protect, adminOnly, ownerOnly, adminOrOwner } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getHotels);
router.get('/:id', getHotel);

// Protected routes
router.use(protect);

// Owner routes
router.get('/my/hotels', ownerOnly, getMyHotels);
router.post('/', ownerOnly, createHotel);
router.put('/:id', adminOrOwner, updateHotel);
router.delete('/:id', adminOrOwner, deleteHotel);

// Admin only routes
router.put('/:id/verify', adminOnly, verifyHotel);

module.exports = router;
