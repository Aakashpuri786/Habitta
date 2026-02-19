import { ref, computed } from 'vue'

export function useStreaks() {
  const calculateCurrentStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) {
      return 0
    }

    // Sort dates in descending order
    const sortedDates = completedDates
      .map(d => new Date(d.date))
      .sort((a, b) => b - a)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const mostRecentDate = new Date(sortedDates[0])
    mostRecentDate.setHours(0, 0, 0, 0)

    // If most recent completion is not today or yesterday, streak is broken
    if (mostRecentDate.getTime() !== today.getTime() && 
        mostRecentDate.getTime() !== yesterday.getTime()) {
      return 0
    }

    let streak = 1
    let currentDate = mostRecentDate

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i])
      prevDate.setHours(0, 0, 0, 0)

      const expectedPrevDate = new Date(currentDate)
      expectedPrevDate.setDate(expectedPrevDate.getDate() - 1)

      if (prevDate.getTime() === expectedPrevDate.getTime()) {
        streak++
        currentDate = prevDate
      } else if (prevDate.getTime() !== currentDate.getTime()) {
        break
      }
    }

    return streak
  }

  const calculateLongestStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) {
      return 0
    }

    const sortedDates = [...completedDates]
      .map(d => new Date(d.date))
      .sort((a, b) => a - b)

    const uniqueDates = []
    for (const date of sortedDates) {
      const dateOnly = new Date(date)
      dateOnly.setHours(0, 0, 0, 0)

      const lastUnique = uniqueDates[uniqueDates.length - 1]
      if (!lastUnique || lastUnique.getTime() !== dateOnly.getTime()) {
        uniqueDates.push(dateOnly)
      }
    }

    let longestStreak = 1
    let currentStreak = 1

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1])
      const currDate = new Date(uniqueDates[i])

      const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else if (diffDays > 1) {
        currentStreak = 1
      }
    }

    return longestStreak
  }

  const getStreakMultiplier = (streak) => {
    if (streak >= 30) return 2.0
    if (streak >= 14) return 1.5
    if (streak >= 7) return 1.25
    if (streak >= 3) return 1.1
    return 1.0
  }

  const getStreakMessage = (streak) => {
    if (streak === 0) {
      return "Start your streak today!"
    } else if (streak < 7) {
      return "Great start! Keep building your streak!"
    } else if (streak < 14) {
      return "You're on fire! One week strong!"
    } else if (streak < 30) {
      return "Amazing dedication! Two weeks strong!"
    } else if (streak < 60) {
      return "Incredible! A whole month!"
    } else if (streak < 100) {
      return "Legendary! Over 60 days!"
    } else {
      return "UNSTOPPABLE! You're a habit master!"
    }
  }

  const getDaysToNextMilestone = (streak) => {
    const milestones = [7, 14, 30, 60, 100, 365]

    for (const milestone of milestones) {
      if (streak < milestone) {
        return milestone - streak
      }
    }

    return null
  }

  return {
    calculateCurrentStreak,
    calculateLongestStreak,
    getStreakMultiplier,
    getStreakMessage,
    getDaysToNextMilestone
  }
}
