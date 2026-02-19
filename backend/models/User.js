const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot be more than 200 characters'],
    default: ''
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: null
  },
  completedHabitsToday: {
    type: Number,
    default: 0
  },
  completedChallengesToday: {
    type: Number,
    default: 0
  },
  rewards: {
    type: Number,
    default: 0
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate level from XP
userSchema.methods.calculateLevel = function() {
  // Level formula: each level requires 100 * level XP
  // Level 1: 0-99, Level 2: 100-299, Level 3: 300-599, etc.
  let level = 1;
  let xpRequired = 0;
  let totalXP = this.xp;
  
  while (totalXP >= xpRequired + (100 * level)) {
    xpRequired += 100 * level;
    level++;
  }
  
  return level;
};

// Add XP and update level
userSchema.methods.addXP = async function(amount) {
  this.xp += amount;
  const newLevel = this.calculateLevel();
  
  if (newLevel > this.level) {
    this.level = newLevel;
  }
  
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
