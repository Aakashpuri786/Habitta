const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all tasks for user
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { filter } = req.query;
    let query = { user: req.user.id };
    
    if (filter === 'completed') {
      query.isCompleted = true;
    } else if (filter === 'pending') {
      query.isCompleted = false;
    }
    
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      tasks: tasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        isCompleted: task.isCompleted,
        completedAt: task.completedAt,
        xpReward: task.xpReward,
        createdAt: task.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;
    
    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      priority,
      category,
      dueDate
    });
    
    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate, isCompleted } = req.body;
    
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (priority) updateFields.priority = priority;
    if (category) updateFields.category = category;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (isCompleted !== undefined) {
      updateFields.isCompleted = isCompleted;
      if (isCompleted) {
        updateFields.completedAt = new Date();
      } else {
        updateFields.completedAt = null;
      }
    }
    
    task = await Task.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Task deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

// @desc    Mark task as complete
// @route   POST /api/v1/tasks/:id/complete
// @access  Private
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    if (task.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Task already completed'
      });
    }
    
    task.isCompleted = true;
    task.completedAt = new Date();
    await task.save();
    
    // Add XP to user
    const user = await User.findById(req.user.id);
    user.xp += task.xpReward;
    
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
      message: 'Task completed!',
      xpEarned: task.xpReward,
      userXP: user.xp,
      userLevel: user.level
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing task',
      error: error.message
    });
  }
};

// @desc    Get task stats
// @route   GET /api/v1/tasks/stats
// @access  Private
exports.getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const pendingTasks = tasks.filter(t => !t.isCompleted).length;
    
    // Get tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasksDueToday = tasks.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime() && !t.isCompleted;
    }).length;
    
    // Get overdue tasks
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.isCompleted) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() < today.getTime();
    }).length;
    
    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        tasksDueToday,
        overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task stats',
      error: error.message
    });
  }
};
