<template>
  <div class="min-h-screen bg-dark pt-20 lg:pl-64">
    <Navbar />
    
    <main class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">
          Welcome back, {{ user?.name || 'Champion' }}! 👋
        </h1>
        <p class="text-dark-400">Here's your progress overview for today</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- XP Card -->
        <Card class="animate-slide-up">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Total XP</p>
              <p class="text-3xl font-bold text-warning">{{ stats?.xp || 0 }}</p>
            </div>
            <div class="w-14 h-14 rounded-xl bg-warning/20 flex items-center justify-center">
              <svg class="w-7 h-7 text-warning" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </Card>

        <!-- Level Card -->
        <Card class="animate-slide-up" style="animation-delay: 50ms;">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Current Level</p>
              <p class="text-3xl font-bold text-primary">Lv.{{ stats?.level || 1 }}</p>
            </div>
            <div class="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <ProgressBar 
              :percentage="xpPercentage" 
              :current="stats?.xp || 0"
              :max="xpNeeded"
              variant="primary"
              size="sm"
            />
            <p class="text-xs text-dark-400 mt-1">{{ xpNeeded - (stats?.xp || 0) }} XP to next level</p>
          </div>
        </Card>

        <!-- Streak Card -->
        <Card class="animate-slide-up" style="animation-delay: 100ms;">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Current Streak</p>
              <p class="text-3xl font-bold text-warning">🔥 {{ stats?.streak || 0 }}</p>
            </div>
            <div class="w-14 h-14 rounded-xl bg-warning/20 flex items-center justify-center">
              <svg class="w-7 h-7 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-dark-400 mt-2">{{ streakMessage }}</p>
        </Card>

        <!-- Tasks Card -->
        <Card class="animate-slide-up" style="animation-delay: 150ms;">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Today's Tasks</p>
              <p class="text-3xl font-bold text-accent">{{ stats?.completedTasks || 0 }}/{{ stats?.totalTasks || 0 }}</p>
            </div>
            <div class="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
              <svg class="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-dark-400 mt-2">
            {{ (stats?.totalTasks || 0) - (stats?.completedTasks || 0) }} tasks remaining
          </p>
        </Card>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <router-link to="/habits" class="card-hover group">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Habits</h3>
              <p class="text-sm text-dark-400">Track your daily habits</p>
            </div>
          </div>
        </router-link>

        <router-link to="/tasks" class="card-hover group">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Tasks</h3>
              <p class="text-sm text-dark-400">Manage your to-do list</p>
            </div>
          </div>
        </router-link>

        <router-link to="/challenges" class="card-hover group">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Challenges</h3>
              <p class="text-sm text-dark-400">Complete daily challenges</p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Motivational Quote -->
      <Card class="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <div class="flex items-start space-x-4">
          <div class="text-4xl">💪</div>
          <div>
            <p class="text-lg text-white italic">"{{ dailyQuote.text }}"</p>
            <p class="text-dark-400 mt-2">— {{ dailyQuote.author }}</p>
          </div>
        </div>
      </Card>

      <!-- Recent Activity -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold text-white">Recent Activity</h2>
        </template>
        
        <div v-if="recentActivity.length > 0" class="space-y-4">
          <div 
            v-for="activity in recentActivity" 
            :key="activity._id"
            class="flex items-center space-x-4 p-3 bg-dark-100 rounded-lg"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="activity.type === 'habit' ? 'bg-primary/20' : activity.type === 'task' ? 'bg-accent/20' : 'bg-warning/20'"
            >
              <span v-if="activity.type === 'habit'">✅</span>
              <span v-else-if="activity.type === 'task'">📋</span>
              <span v-else>⚡</span>
            </div>
            <div class="flex-1">
              <p class="text-white">{{ activity.title }}</p>
              <p class="text-dark-400 text-sm">{{ formatDate(activity.date) }}</p>
            </div>
            <div class="text-warning font-medium">+{{ activity.xp }} XP</div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-dark-400">
          <p>No recent activity. Start building habits to see your progress!</p>
        </div>
      </Card>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../store/user'
import Navbar from '../components/layout/Navbar.vue'
import Card from '../components/ui/Card.vue'
import ProgressBar from '../components/ui/ProgressBar.vue'

const userStore = useUserStore()
const user = computed(() => userStore.currentUser)

const stats = ref({
  xp: 0,
  level: 1,
  streak: 0,
  completedTasks: 0,
  totalTasks: 0,
  completedHabits: 0,
  totalHabits: 0
})

const recentActivity = ref([])

const quotes = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" }
]

const dailyQuote = ref(quotes[0])

const xpNeeded = computed(() => stats.value.level * 100)
const xpPercentage = computed(() => {
  return Math.min(((stats.value.xp || 0) / xpNeeded.value) * 100, 100)
})

const streakMessage = computed(() => {
  const streak = stats.value.streak
  if (streak === 0) return "Start your streak today!"
  if (streak < 7) return "Great start! Keep building!"
  if (streak < 14) return "One week strong! Amazing!"
  if (streak < 30) return "Two weeks strong! You're on fire!"
  return "Incredible dedication! Keep it up!"
})

const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24))
  
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff} days ago`
}

onMounted(async () => {
  // Set daily quote based on date
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  dailyQuote.value = quotes[dayOfYear % quotes.length]
  
  // Fetch dashboard stats
  const dashboardStats = await userStore.fetchDashboard()
  if (dashboardStats) {
    stats.value = dashboardStats
  }
})
</script>
