const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a challenge title'],
    trim: true,
    maxlength: [100, 'Challenge title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  category: {
    type: String,
    enum: ['health', 'fitness', 'mindset', 'productivity', 'social', 'challenge'],
    default: 'challenge'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  xpReward: {
    type: Number,
    default: 25
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  isDaily: {
    type: Boolean,
    default: true
  },
  generatedDate: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mark challenge as complete
challengeSchema.methods.markComplete = async function() {
  if (this.isCompleted) {
    return { success: false, message: 'Already completed' };
  }
  
  this.isCompleted = true;
  this.completedAt = new Date();
  
  await this.save();
  
  return { 
    success: true, 
    xpEarned: this.xpReward
  };
};

module.exports = mongoose.model('Challenge', challengeSchema);
