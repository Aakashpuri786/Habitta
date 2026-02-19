// Reward system for micro-games and achievements
const rewards = {
  // Daily login bonus
  dailyLogin: {
    xp: 5,
    rewards: 1
  },
  
  // Streak milestones
  streakMilestones: {
    7: { xp: 50, rewards: 10 },
    14: { xp: 100, rewards: 25 },
    30: { xp: 250, rewards: 50 },
    60: { xp: 500, rewards: 100 },
    100: { xp: 1000, rewards: 200 },
    365: { xp: 5000, rewards: 1000 }
  },
  
  // Level up rewards
  levelUp: {
    baseXP: 100,
    multiplier: 1.5
  },
  
  // Challenge completion bonuses
  challengeBonuses: {
    easy: 10,
    medium: 25,
    hard: 50,
    extreme: 100
  },
  
  // Habit completion streak bonuses
  habitStreakBonuses: {
    7: 25,
    14: 50,
    30: 100,
    60: 200,
    100: 500
  }
};

// Calculate daily rewards
exports.calculateDailyRewards = (streak) => {
  const baseReward = rewards.dailyLogin.rewards;
  const streakBonus = Math.min(streak * 0.5, 10); // Max 10 extra per day
  return Math.floor(baseReward + streakBonus);
};

// Calculate XP for level up
exports.calculateXPForLevel = (level) => {
  return Math.floor(rewards.levelUp.baseXP * Math.pow(rewards.levelUp.multiplier, level - 1));
};

// Get streak milestone reward
exports.getStreakMilestoneReward = (streak) => {
  const milestones = Object.keys(rewards.streakMilestones).map(Number).sort((a, b) => a - b);
  
  for (const milestone of milestones) {
    if (streak >= milestone) {
      const reward = rewards.streakMilestones[milestone];
      return {
        milestone,
        xp: reward.xp,
        rewards: reward.rewards,
        isNewMilestone: streak === milestone
      };
    }
  }
  
  return null;
};

// Calculate micro-game rewards
exports.calculateMicroGameReward = (score, gameType) => {
  const baseRewards = {
    clicker: { xp: 1, perScore: 1 },
    spinner: { xp: 10, flat: true },
    quiz: { xp: 15, perCorrect: 5 }
  };
  
  const game = baseRewards[gameType];
  if (!game) return { xp: 0, rewards: 0 };
  
  let xp = 0;
  let rewardsPoints = 0;
  
  if (game.flat) {
    xp = game.xp;
  } else if (gameType === 'clicker') {
    xp = Math.floor(score * game.xp);
    rewardsPoints = Math.floor(score * 0.1);
  } else if (gameType === 'quiz') {
    xp = game.xp + (score * game.perCorrect);
    rewardsPoints = Math.floor(xp * 0.1);
  }
  
  return { xp, rewards: rewardsPoints };
};

// Spin wheel configuration
exports.spinWheelPrizes = [
  { type: 'xp', value: 10, weight: 30 },
  { type: 'xp', value: 25, weight: 25 },
  { type: 'xp', value: 50, weight: 15 },
  { type: 'xp', value: 100, weight: 5 },
  { type: 'rewards', value: 5, weight: 15 },
  { type: 'rewards', value: 10, weight: 7 },
  { type: 'nothing', value: 0, weight: 3 }
];

// Get random spin wheel prize
exports.getSpinWheelPrize = () => {
  const totalWeight = exports.spinWheelPrizes.reduce((sum, prize) => sum + prize.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const prize of exports.spinWheelPrizes) {
    random -= prize.weight;
    if (random <= 0) {
      return prize;
    }
  }
  
  return exports.spinWheelPrizes[0];
};

module.exports = rewards;
