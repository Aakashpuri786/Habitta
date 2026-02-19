const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// @route   POST /api/v1/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', signup);

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/v1/auth/me
// @desc    Get current user
// @access  Private
const { protect } = require('../middleware/authMiddleware');
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;
