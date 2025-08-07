const express = require('express');
const router = express.Router();
const {
  getOwnerBusiness,
  updateOwnerBusiness,
  completeBusiness,
  getBusinessProgress,
  getBusinessRequirements
} = require('../controllers/ownerController');
const { protect, ownerOnly } = require('../middleware/auth');

// All routes require authentication and owner role
router.use(protect);
router.use(ownerOnly);

// Get owner's business details
router.get('/business', getOwnerBusiness);

// Update owner's business details
router.put('/business', updateOwnerBusiness);

// Complete business setup and activate
router.post('/business/complete', completeBusiness);

// Get business completion progress
router.get('/business/progress', getBusinessProgress);

// Get business requirements based on type
router.get('/business/requirements', getBusinessRequirements);

module.exports = router;