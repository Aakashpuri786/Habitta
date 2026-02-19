// Daily challenge templates
const challengeTemplates = [
  { title: 'Morning Meditation', description: 'Start your day with 10 minutes of meditation', category: 'mindset', difficulty: 'easy', xpReward: 15 },
  { title: 'Drink 8 Glasses of Water', description: 'Stay hydrated throughout the day', category: 'health', difficulty: 'easy', xpReward: 10 },
  { title: 'No Social Media Day', description: 'Avoid all social media for the entire day', category: 'productivity', difficulty: 'hard', xpReward: 30 },
  { title: 'Read for 30 Minutes', description: 'Read a book or educational content for at least 30 minutes', category: 'learning', difficulty: 'medium', xpReward: 20 },
  { title: 'Exercise for 45 Minutes', description: 'Get moving with any form of exercise for 45 minutes', category: 'fitness', difficulty: 'medium', xpReward: 25 },
  { title: 'Learn Something New', description: 'Learn a new skill or fact today', category: 'learning', difficulty: 'medium', xpReward: 20 },
  { title: 'No Caffeine', description: 'Avoid caffeine for the entire day', category: 'health', difficulty: 'medium', xpReward: 15 },
  { title: 'Deep Work Session', description: 'Complete 2 hours of focused, deep work', category: 'productivity', difficulty: 'hard', xpReward: 35 },
  { title: 'Kindness Challenge', description: 'Do something kind for someone else', category: 'social', difficulty: 'easy', xpReward: 15 },
  { title: 'Gratitude Practice', description: 'Write down 3 things you are grateful for', category: 'mindset', difficulty: 'easy', xpReward: 10 },
  { title: 'Digital Detox', description: 'Stay away from screens for 2 hours before bed', category: 'health', difficulty: 'medium', xpReward: 20 },
  { title: 'Healthy Meal Prep', description: 'Prepare a healthy meal at home', category: 'health', difficulty: 'medium', xpReward: 20 },
  { title: 'Connect with Someone', description: 'Reach out to a friend or family member', category: 'social', difficulty: 'easy', xpReward: 15 },
  { title: 'Creative Time', description: 'Spend 30 minutes on a creative activity', category: 'creative', difficulty: 'easy', xpReward: 15 },
  { title: 'Sleep Early', description: 'Go to bed by 10 PM', category: 'health', difficulty: 'hard', xpReward: 25 },
  { title: 'Cold Shower', description: 'Take a cold shower to boost alertness', category: 'health', difficulty: 'hard', xpReward: 20 },
  { title: 'No Complaints', description: 'Go an entire day without complaining', category: 'mindset', difficulty: 'extreme', xpReward: 40 },
  { title: 'Morning Walk', description: 'Go for a 20-minute walk in the morning', category: 'fitness', difficulty: 'easy', xpReward: 15 },
  { title: 'Practice Journaling', description: 'Write in your journal for 15 minutes', category: 'mindset', difficulty: 'easy', xpReward: 10 },
  { title: 'Declutter Space', description: 'Organize or clean one area of your home', category: 'productivity', difficulty: 'medium', xpReward: 20 }
];

const Challenge = require('../models/Challenge');

// Generate daily challenges for a user
exports.generateDailyChallenges = async (userId) => {
  // Shuffle and pick 3 random challenges
  const shuffled = [...challengeTemplates].sort(() => 0.5 - Math.random());
  const selectedChallenges = shuffled.slice(0, 3);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const challengesToCreate = selectedChallenges.map(template => ({
    user: userId,
    title: template.title,
    description: template.description,
    category: template.category,
    difficulty: template.difficulty,
    xpReward: template.xpReward,
    isDaily: true,
    generatedDate: today,
    expiresAt: tomorrow
  }));
  
  const challenges = await Challenge.insertMany(challengesToCreate);
  
  return challenges;
};

// Get random challenge
exports.getRandomChallenge = () => {
  const randomIndex = Math.floor(Math.random() * challengeTemplates.length);
  return challengeTemplates[randomIndex];
};
