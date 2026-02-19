const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { generateDailyChallenges } = require('../utils/habitGenerator');

// @desc    Get daily challenges for user
// @route   GET /api/v1/challenges
// @access  Private
exports.getChallenges = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if user already has challenges for today
    let challenges = await Challenge.find({
      user: req.user.id,
      generatedDate: {
        $gte: today
      }
    });
    
    // If no challenges for today, generate new ones
    if (challenges.length === 0) {
      const newChallenges = await generateDailyChallenges(req.user.id);
      challenges = newChallenges;
    }
    
    res.json({
      success: true,
      challenges: challenges.map(challenge => ({
        id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        difficulty: challenge.difficulty,
        xpReward: challenge.xpReward,
        isCompleted: challenge.isCompleted,
        completedAt: challenge.completedAt,
        isDaily: challenge.isDaily,
        generatedDate: challenge.generatedDate,
        expiresAt: challenge.expiresAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching challenges',
      error: error.message
    });
  }
};

// @desc    Get single challenge
// @route   GET /api/v1/challenges/:id
// @access  Private
exports.getChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching challenge',
      error: error.message
    });
  }
};

// @desc    Mark challenge as complete
// @route   POST /api/v1/challenges/:id/complete
// @access  Private
exports.completeChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    if (challenge.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Challenge already completed'
      });
    }
    
    challenge.isCompleted = true;
    challenge.completedAt = new Date();
    await challenge.save();
    
    // Add XP to user
    const user = await User.findById(req.user.id);
    user.xp += challenge.xpReward;
    user.completedChallengesToday = (user.completedChallengesToday || 0) + 1;
    
    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        user.streak += 1;
        if (user.streak > user.longestStreak) {
          user.longestStreak = user.streak;
        }
      } else if (daysDiff > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
      user.longestStreak = 1;
    }
    
    user.lastActiveDate = today;
    
    // Calculate new level
    let newLevel = 1;
    let xpRequired = 0;
    let totalXP = user.xp;
    
    while (totalXP >= xpRequired + (100 * newLevel)) {
      xpRequired += 100 * newLevel;
      newLevel++;
    }
    
    user.level = newLevel;
    await user.save();
    
    res.json({
      success: true,
      message: 'Challenge completed!',
      xpEarned: challenge.xpReward,
      userXP: user.xp,
      userLevel: user.level,
      userStreak: user.streak
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing challenge',
      error: error.message
    });
  }
};

// @desc    Get challenge stats
// @route   GET /api/v1/challenges/stats
// @access  Private
exports.getChallengeStats = async (req, res) => {
  try {
    const challenges = await Challenge.find({ user: req.user.id });
    
    const totalChallenges = challenges.length;
    const completedChallenges = challenges.filter(c => c.isCompleted).length;
    
    // Get this week's challenges
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyChallenges = challenges.filter(c => {
      const generatedDate = new Date(c.generatedDate);
      return generatedDate >= weekAgo;
    });
    
    const weeklyCompleted = weeklyChallenges.filter(c => c.isCompleted).length;
    
    // Get total XP earned from challenges
    const totalXP = challenges
      .filter(c => c.isCompleted)
      .reduce((sum, c) => sum + c.xpReward, 0);
    
    res.json({
      success: true,
      stats: {
        totalChallenges,
        completedChallenges,
        weeklyChallenges: weeklyChallenges.length,
        weeklyCompleted,
        totalXP,
        completionRate: totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching challenge stats',
      error: error.message
    });
  }
};
