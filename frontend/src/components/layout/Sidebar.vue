<template>
  <aside class="fixed left-0 top-16 bottom-0 w-64 bg-dark-50 border-r border-dark-100 hidden lg:flex flex-col">
    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <router-link 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path"
        class="flex items-center space-x-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-100 transition-all"
        active-class="text-primary bg-primary/10 hover:bg-primary/20"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Stats Footer -->
    <div class="px-4 py-4 border-t border-dark-100">
      <div class="bg-dark-100 rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-dark-400 text-sm">Streak</span>
          <div class="flex items-center space-x-1">
            <span class="text-warning">🔥</span>
            <span class="text-warning font-bold">{{ user?.streak || 0 }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-dark-400 text-sm">Level</span>
          <span class="text-primary font-bold">{{ user?.level || 1 }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-dark-400 text-sm">XP</span>
          <span class="text-warning font-bold">{{ user?.xp || 0 }}</span>
        </div>
        
        <!-- Mini Progress Bar -->
        <div class="mt-2">
          <div class="flex justify-between text-xs text-dark-400 mb-1">
            <span>Level {{ user?.level || 1 }}</span>
            <span>Level {{ (user?.level || 1) + 1 }}</span>
          </div>
          <div class="w-full bg-dark-200 rounded-full h-1.5">
            <div 
              class="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full transition-all"
              :style="{ width: `${xpProgress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, h } from 'vue'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()
const user = computed(() => userStore.currentUser)

// XP needed for next level: level * 100
const xpForNextLevel = computed(() => (user.value?.level || 1) * 100)
const currentLevelXp = computed(() => user.value?.xp || 0)
const xpProgress = computed(() => {
  return Math.min((currentLevelXp.value / xpForNextLevel.value) * 100, 100)
})

// Icon components
const DashboardIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
  ])
}

const HabitsIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

const TasksIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' })
  ])
}

const ChallengesIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
  ])
}

const RewardsIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' })
  ])
}

const SettingsIcon = {
  render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
  ])
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { name: 'Habits', path: '/habits', icon: HabitsIcon },
  { name: 'Tasks', path: '/tasks', icon: TasksIcon },
  { name: 'Challenges', path: '/challenges', icon: ChallengesIcon },
  { name: 'Rewards', path: '/rewards', icon: RewardsIcon },
  { name: 'Settings', path: '/settings', icon: SettingsIcon }
]
</script>
