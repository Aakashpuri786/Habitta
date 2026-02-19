const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a habit name'],
    trim: true,
    maxlength: [100, 'Habit name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  category: {
    type: String,
    enum: ['health', 'fitness', 'mindset', 'learning', 'productivity', 'social', 'creative', 'other'],
    default: 'other'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'extreme'],
    default: 'medium'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  targetDays: {
    type: [Number],
    default: [0, 1, 2, 3, 4, 5, 6]
  },
  xpReward: {
    type: Number,
    default: 10
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  lastCompleted: {
    type: Date,
    default: null
  },
  completedDates: [{
    date: {
      type: Date,
      required: true
    },
    reflection: {
      type: String,
      maxlength: 500,
      default: ''
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#8B5CF6'
  },
  icon: {
    type: String,
    default: 'star'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate XP reward based on difficulty
habitSchema.methods.calculateXPReward = function() {
  const baseXP = {
    easy: 10,
    medium: 20,
    hard: 35,
    extreme: 50
  };
  
  const streakBonus = Math.min(this.currentStreak * 2, 20);
  
  return baseXP[this.difficulty] + streakBonus;
};

// Mark habit as complete
habitSchema.methods.markComplete = async function(reflection = '') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const alreadyCompleted = this.completedDates.some(completed => {
    const completedDate = new Date(completed.date);
    completedDate.setHours(0, 0, 0, 0);
    return completedDate.getTime() === today.getTime();
  });
  
  if (alreadyCompleted) {
    return { success: false, message: 'Already completed today' };
  }
  
  const dayOfWeek = today.getDay();
  if (!this.targetDays.includes(dayOfWeek)) {
    return { success: false, message: 'Not scheduled for today' };
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (this.lastCompleted) {
    const lastCompletedDate = new Date(this.lastCompleted);
    lastCompletedDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - lastCompletedDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      this.currentStreak += 1;
    } else if (diffDays > 1) {
      this.currentStreak = 1;
    }
  } else {
    this.currentStreak = 1;
  }
  
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  this.completedDates.push({
    date: today,
    reflection
  });
  
  this.lastCompleted = today;
  this.totalCompletions += 1;
  
  await this.save();
  
  const xpEarned = this.calculateXPReward();
  
  return { 
    success: true, 
    xpEarned,
    streak: this.currentStreak,
    longestStreak: this.longestStreak
  };
};

module.exports = mongoose.model('Habit', habitSchema);
