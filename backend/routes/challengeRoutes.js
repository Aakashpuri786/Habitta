const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getChallenges, 
  getChallenge, 
  completeChallenge,
  getChallengeStats 
} = require('../controllers/challengeController');

// @route   GET /api/v1/challenges
// @desc    Get all challenges (daily)
// @access  Private
router.get('/', protect, getChallenges);

// @route   GET /api/v1/challenges/stats
// @desc    Get challenge stats
// @access  Private
router.get('/stats', protect, getChallengeStats);

// @route   GET /api/v1/challenges/:id
// @desc    Get single challenge
// @access  Private
router.get('/:id', protect, getChallenge);

// @route   POST /api/v1/challenges/:id/complete
// @desc    Mark challenge as complete
// @access  Private
router.post('/:id/complete', protect, completeChallenge);

module.exports = router;
