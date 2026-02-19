const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getHabits, 
  getHabit, 
  createHabit, 
  updateHabit, 
  deleteHabit, 
  completeHabit,
  getHabitStats 
} = require('../controllers/habitController');

// @route   GET /api/v1/habits
// @desc    Get all habits
// @access  Private
router.get('/', protect, getHabits);

// @route   GET /api/v1/habits/stats
// @desc    Get habit stats
// @access  Private
router.get('/stats', protect, getHabitStats);

// @route   GET /api/v1/habits/:id
// @desc    Get single habit
// @access  Private
router.get('/:id', protect, getHabit);

// @route   POST /api/v1/habits
// @desc    Create new habit
// @access  Private
router.post('/', protect, createHabit);

// @route   PUT /api/v1/habits/:id
// @desc    Update habit
// @access  Private
router.put('/:id', protect, updateHabit);

// @route   DELETE /api/v1/habits/:id
// @desc    Delete habit
// @access  Private
router.delete('/:id', protect, deleteHabit);

// @route   POST /api/v1/habits/:id/complete
// @desc    Mark habit as complete
// @access  Private
router.post('/:id/complete', protect, completeHabit);

module.exports = router;
