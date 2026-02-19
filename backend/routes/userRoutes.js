const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMe, updateMe, getDashboard, addXP } = require('../controllers/userController');

// @route   GET /api/v1/users/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/v1/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', protect, updateMe);

// @route   GET /api/v1/users/dashboard
// @desc    Get user dashboard stats
// @access  Private
router.get('/dashboard', protect, getDashboard);

// @route   POST /api/v1/users/add-xp
// @desc    Add XP to user
// @access  Private
router.post('/add-xp', protect, addXP);

module.exports = router;
