const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Task title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['personal', 'work', 'health', 'learning', 'shopping', 'other'],
    default: 'personal'
  },
  dueDate: {
    type: Date,
    default: null
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  xpReward: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mark task as complete
taskSchema.methods.markComplete = async function() {
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

module.exports = mongoose.model('Task', taskSchema);
