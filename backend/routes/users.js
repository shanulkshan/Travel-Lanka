const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getUserStats
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Admin only routes
router.get('/stats', adminOnly, getUserStats);
router.get('/', adminOnly, getUsers);
router.get('/:id', adminOnly, getUser);
router.put('/:id', adminOnly, updateUser);
router.delete('/:id', adminOnly, deleteUser);
router.put('/:id/deactivate', adminOnly, deactivateUser);
router.put('/:id/activate', adminOnly, activateUser);

module.exports = router;
