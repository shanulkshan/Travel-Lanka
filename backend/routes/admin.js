const express = require('express');
const router = express.Router();
const { 
  getDashboardStats,
  createOwnerWithHotel,
  createOwnerWithRestaurant,
  createOwnerWithTransport,
  createOwner,
  getAllOwners,
  getAllListings,
  updateListingStatus,
  deleteListing
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Admin dashboard routes
router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);

// Owner creation routes
router.post('/owners/hotel', protect, adminOnly, createOwnerWithHotel);
router.post('/owners/restaurant', protect, adminOnly, createOwnerWithRestaurant);
router.post('/owners/transport', protect, adminOnly, createOwnerWithTransport);
router.post('/owners', protect, adminOnly, createOwner); // New simplified route

// Get all owners
router.get('/owners', protect, adminOnly, getAllOwners);

// Listings management
router.get('/listings', protect, adminOnly, getAllListings);
router.put('/listings/status', protect, adminOnly, updateListingStatus);
router.delete('/listings/:type/:id', protect, adminOnly, deleteListing);

module.exports = router;
