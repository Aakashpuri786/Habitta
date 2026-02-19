const User = require('../models/User');

// @desc    Get current user
// @route   GET /api/v1/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        longestStreak: user.longestStreak,
        rewards: user.rewards,
        theme: user.theme,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/me
// @access  Private
exports.updateMe = async (req, res) => {
  try {
    const { name, bio, avatar, theme } = req.body;
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (theme) updateFields.theme = theme;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/v1/users/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if user was active yesterday for streak calculation
    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
      
      // If more than 1 day has passed, reset streak
      if (daysDiff > 1) {
        user.streak = 0;
        await user.save();
      }
    }
    
    // Calculate XP to next level
    const xpForCurrentLevel = (user.level - 1) * (user.level) * 50;
    const xpForNextLevel = user.level * (user.level + 1) * 50;
    const xpProgress = user.xp - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const levelProgress = Math.round((xpProgress / xpNeeded) * 100);
    
    res.json({
      success: true,
      stats: {
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        longestStreak: user.longestStreak,
        rewards: user.rewards,
        xpProgress,
        xpNeeded,
        levelProgress,
        completedHabitsToday: user.completedHabitsToday || 0,
        completedChallengesToday: user.completedChallengesToday || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard',
      error: error.message
    });
  }
};

// @desc    Add XP to user
// @route   POST /api/v1/users/add-xp
// @access  Private
exports.addXP = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid XP amount'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    user.xp += amount;
    
    // Calculate new level
    let newLevel = 1;
    let xpRequired = 0;
    let totalXP = user.xp;
    
    while (totalXP >= xpRequired + (100 * newLevel)) {
      xpRequired += 100 * newLevel;
      newLevel++;
    }
    
    user.level = newLevel;
    
    // Update streak if not updated today
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
      // If daysDiff === 0, already counted today
    } else {
      user.streak = 1;
    }
    
    user.lastActiveDate = today;
    
    await user.save();
    
    res.json({
      success: true,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      longestStreak: user.longestStreak
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding XP',
      error: error.message
    });
  }
};
