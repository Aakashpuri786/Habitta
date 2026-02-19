// Streak calculation utilities

// Calculate current streak from completed dates
exports.calculateCurrentStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) {
    return 0;
  }
  
  // Sort dates in descending order
  const sortedDates = completedDates
    .map(d => new Date(d.date))
    .sort((a, b) => b - a);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const mostRecentDate = new Date(sortedDates[0]);
  mostRecentDate.setHours(0, 0, 0, 0);
  
  // If most recent completion is not today or yesterday, streak is broken
  if (mostRecentDate.getTime() !== today.getTime() && 
      mostRecentDate.getTime() !== yesterday.getTime()) {
    return 0;
  }
  
  let streak = 1;
  let currentDate = mostRecentDate;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i]);
    prevDate.setHours(0, 0, 0, 0);
    
    const expectedPrevDate = new Date(currentDate);
    expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);
    
    if (prevDate.getTime() === expectedPrevDate.getTime()) {
      streak++;
      currentDate = prevDate;
    } else if (prevDate.getTime() !== currentDate.getTime()) {
      // Gap in dates, streak ends
      break;
    }
  }
  
  return streak;
};

// Calculate longest streak from completed dates
exports.calculateLongestStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) {
    return 0;
  }
  
  // Sort dates in ascending order
  const sortedDates = [...completedDates]
    .map(d => new Date(d.date))
    .sort((a, b) => a - b);
  
  // Remove duplicates (same day)
  const uniqueDates = [];
  for (const date of sortedDates) {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    const lastUnique = uniqueDates[uniqueDates.length - 1];
    if (!lastUnique || lastUnique.getTime() !== dateOnly.getTime()) {
      uniqueDates.push(dateOnly);
    }
  }
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    
    const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
};

// Check if streak should be reset
exports.shouldResetStreak = (lastActiveDate) => {
  if (!lastActiveDate) {
    return true;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = new Date(lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  
  // Reset if more than 1 day has passed
  return diffDays > 1;
};

// Calculate streak bonus XP
exports.calculateStreakBonus = (streak, baseXP) => {
  // Max bonus is 20 XP (10% of 200 base XP)
  const bonusPercentage = Math.min(streak * 2, 20);
  return Math.floor(baseXP * (bonusPercentage / 100));
};

// Get streak status message
exports.getStreakMessage = (streak) => {
  if (streak === 0) {
    return "Start your streak today!";
  } else if (streak < 7) {
    return "Great start! Keep building your streak!";
  } else if (streak < 14) {
    return "You're on fire! One week strong!";
  } else if (streak < 30) {
    return "Amazing dedication! Two weeks strong!";
  } else if (streak < 60) {
    return "Incredible! A whole month!";
  } else if (streak < 100) {
    return "Legendary! Over 60 days!";
  } else {
    return "UNSTOPPABLE! You're a habit master!";
  }
};
