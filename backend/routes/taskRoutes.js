const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask, 
  completeTask,
  getTaskStats 
} = require('../controllers/taskController');

// @route   GET /api/v1/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', protect, getTasks);

// @route   GET /api/v1/tasks/stats
// @desc    Get task stats
// @access  Private
router.get('/stats', protect, getTaskStats);

// @route   GET /api/v1/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', protect, getTask);

// @route   POST /api/v1/tasks
// @desc    Create new task
// @access  Private
router.post('/', protect, createTask);

// @route   PUT /api/v1/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', protect, updateTask);

// @route   DELETE /api/v1/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', protect, deleteTask);

// @route   POST /api/v1/tasks/:id/complete
// @desc    Mark task as complete
// @access  Private
router.post('/:id/complete', protect, completeTask);

module.exports = router;
