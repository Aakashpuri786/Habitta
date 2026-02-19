<template>
  <div class="min-h-screen bg-dark pt-20 lg:pl-64">
    <Navbar />
    
    <main class="p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Daily Challenges</h1>
          <p class="text-dark-400">Complete challenges to earn bonus XP</p>
        </div>
        <Button variant="primary" class="mt-4 md:mt-0" @click="refreshChallenges" :loading="refreshing">
          <svg class="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Challenges
        </Button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div class="text-center">
            <p class="text-dark-400 text-sm">Completed Today</p>
            <p class="text-3xl font-bold text-success">{{ completedCount }}</p>
          </div>
        </Card>
        <Card>
          <div class="text-center">
            <p class="text-dark-400 text-sm">Total Challenges</p>
            <p class="text-3xl font-bold text-primary">{{ challenges.length }}</p>
          </div>
        </Card>
        <Card>
          <div class="text-center">
            <p class="text-dark-400 text-sm">XP Earned</p>
            <p class="text-3xl font-bold text-warning">{{ totalXP }}</p>
          </div>
        </Card>
      </div>

      <!-- Challenges List -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>

      <div v-else-if="challenges.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">⚡</div>
        <h3 class="text-xl font-semibold text-white mb-2">No challenges available</h3>
        <p class="text-dark-400 mb-4">Check back later for new challenges!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="challenge in challenges" 
          :key="challenge._id"
          class="relative overflow-hidden"
          :class="{ 'border-2 border-success': challenge.completed }"
        >
          <!-- Completed Badge -->
          <div v-if="challenge.completed" class="absolute top-0 right-0">
            <div class="bg-success text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              ✓ COMPLETED
            </div>
          </div>

          <!-- Challenge Icon -->
          <div class="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4"
            :class="challenge.completed ? 'bg-success/20' : 'bg-warning/20'"
          >
            <span class="text-3xl">{{ challenge.icon || '⚡' }}</span>
          </div>

          <!-- Challenge Info -->
          <div class="text-center mb-4">
            <h3 class="text-lg font-semibold text-white mb-1">{{ challenge.title }}</h3>
            <p class="text-dark-400 text-sm">{{ challenge.description }}</p>
          </div>

          <!-- XP Reward -->
          <div class="flex items-center justify-center mb-4">
            <span class="text-warning font-bold text-xl">+{{ challenge.xp }} XP</span>
          </div>

          <!-- Complete Button -->
          <Button 
            v-if="!challenge.completed"
            variant="primary" 
            class="w-full"
            @click="completeChallenge(challenge)"
            :loading="completing === challenge._id"
          >
            Mark as Complete
          </Button>
          <div v-else class="text-center text-success font-medium">
            Challenge Completed! 🎉
          </div>
        </Card>
      </div>

      <!-- Challenge Completed Modal -->
      <Modal :show="showSuccessModal" title="" @close="showSuccessModal = false">
        <div class="text-center">
          <div class="text-8xl mb-4 animate-bounce-gentle">🎉</div>
          <h3 class="text-2xl font-bold text-white mb-2">Challenge Complete!</h3>
          <p class="text-warning text-3xl font-bold mb-4">+{{ earnedXP }} XP</p>
          <Button variant="primary" @click="showSuccessModal = false">Awesome!</Button>
        </div>
      </Modal>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChallengesStore } from '../store/challenges'
import { useUserStore } from '../store/user'
import Navbar from '../components/layout/Navbar.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Modal from '../components/ui/Modal.vue'

const challengesStore = useChallengesStore()
const userStore = useUserStore()

const challenges = computed(() => challengesStore.challenges)
const loading = computed(() => challengesStore.loading)
const completedCount = computed(() => challengesStore.completedCount)

const refreshing = ref(false)
const completing = ref(null)
const showSuccessModal = ref(false)
const earnedXP = ref(0)

const totalXP = computed(() => {
  return challenges.value.reduce((sum, c) => sum + (c.completed ? c.xp : 0), 0)
})

const refreshChallenges = async () => {
  refreshing.value = true
  try {
    await challengesStore.refreshChallenges()
  } finally {
    refreshing.value = false
  }
}

const completeChallenge = async (challenge) => {
  completing.value = challenge._id
  try {
    const result = await challengesStore.completeChallenge(challenge._id)
    if (result.success) {
      earnedXP.value = result.xp
      showSuccessModal.value = true
      await userStore.fetchUser()
    }
  } finally {
    completing.value = null
  }
}

onMounted(() => {
  challengesStore.fetchChallenges()
})
</script>
