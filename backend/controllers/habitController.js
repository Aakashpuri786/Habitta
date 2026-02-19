const Habit = require('../models/Habit');
const User = require('../models/User');

// @desc    Get all habits for user
// @route   GET /api/v1/habits
// @access  Private
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id, isActive: true }).sort({ createdAt: -1 });
    
    // Get today's day of week
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Check which habits are completed today
    const habitsWithStatus = habits.map(habit => {
      const isCompletedToday = habit.completedDates.some(completed => {
        const completedDate = new Date(completed.date);
        completedDate.setHours(0, 0, 0, 0);
        const todayDate = new Date(today);
        todayDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === todayDate.getTime();
      });
      
      return {
        id: habit._id,
        name: habit.name,
        description: habit.description,
        category: habit.category,
        difficulty: habit.difficulty,
        frequency: habit.frequency,
        targetDays: habit.targetDays,
        xpReward: habit.xpReward,
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        totalCompletions: habit.totalCompletions,
        isCompletedToday,
        isScheduledToday: habit.targetDays.includes(dayOfWeek),
        color: habit.color,
        icon: habit.icon,
        createdAt: habit.createdAt
      };
    });
    
    res.json({
      success: true,
      habits: habitsWithStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching habits',
      error: error.message
    });
  }
};

// @desc    Get single habit
// @route   GET /api/v1/habits/:id
// @access  Private
exports.getHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }
    
    res.json({
      success: true,
      habit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching habit',
      error: error.message
    });
  }
};

// @desc    Create new habit
// @route   POST /api/v1/habits
// @access  Private
exports.createHabit = async (req, res) => {
  try {
    const { name, description, category, difficulty, frequency, targetDays, color, icon } = req.body;
    
    const habit = await Habit.create({
      user: req.user.id,
      name,
      description,
      category,
      difficulty,
      frequency,
      targetDays: targetDays || [0, 1, 2, 3, 4, 5, 6],
      color: color || '#8B5CF6',
      icon: icon || 'star'
    });
    
    res.status(201).json({
      success: true,
      habit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating habit',
      error: error.message
    });
  }
};

// @desc    Update habit
// @route   PUT /api/v1/habits/:id
// @access  Private
exports.updateHabit = async (req, res) => {
  try {
    const { name, description, category, difficulty, frequency, targetDays, color, icon, isActive } = req.body;
    
    let habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (category) updateFields.category = category;
    if (difficulty) updateFields.difficulty = difficulty;
    if (frequency) updateFields.frequency = frequency;
    if (targetDays) updateFields.targetDays = targetDays;
    if (color) updateFields.color = color;
    if (icon) updateFields.icon = icon;
    if (isActive !== undefined) updateFields.isActive = isActive;
    
    habit = await Habit.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      habit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating habit',
      error: error.message
    });
  }
};

// @desc    Delete habit
// @route   DELETE /api/v1/habits/:id
// @access  Private
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }
    
    // Soft delete - just set isActive to false
    habit.isActive = false;
    await habit.save();
    
    res.json({
      success: true,
      message: 'Habit deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting habit',
      error: error.message
    });
  }
};

// @desc    Mark habit as complete
// @route   POST /api/v1/habits/:id/complete
// @access  Private
exports.completeHabit = async (req, res) => {
  try {
    const { reflection } = req.body;
    
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }
    
    const result = await habit.markComplete(reflection || '');
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
    // Add XP to user
    const user = await User.findById(req.user.id);
    user.xp += result.xpEarned;
    
    // Update user streak
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
    user.completedHabitsToday = (user.completedHabitsToday || 0) + 1;
    
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
      message: 'Habit completed!',
      xpEarned: result.xpEarned,
      streak: result.streak,
      longestStreak: result.longestStreak,
      userXP: user.xp,
      userLevel: user.level,
      userStreak: user.streak
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing habit',
      error: error.message
    });
  }
};

// @desc    Get habit stats
// @route   GET /api/v1/habits/stats
// @access  Private
exports.getHabitStats = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id, isActive: true });
    
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
    const totalStreakDays = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
    const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
    
    // Get last 7 days completion data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayCompletions = habits.reduce((sum, habit) => {
        const completed = habit.completedDates.some(completed => {
          const completedDate = new Date(completed.date);
          completedDate.setHours(0, 0, 0, 0);
          return completedDate.getTime() === date.getTime();
        });
        return sum + (completed ? 1 : 0);
      }, 0);
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        completions: dayCompletions
      });
    }
    
    res.json({
      success: true,
      stats: {
        totalHabits,
        totalCompletions,
        totalStreakDays,
        longestStreak,
        last7Days
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching habit stats',
      error: error.message
    });
  }
};
