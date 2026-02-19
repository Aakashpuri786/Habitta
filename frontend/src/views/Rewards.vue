<template>
  <div class="min-h-screen bg-dark pt-20 lg:pl-64">
    <Navbar />
    
    <main class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Rewards & Games</h1>
        <p class="text-dark-400">Play games and earn bonus XP!</p>
      </div>

      <!-- Spin the Wheel Game -->
      <Card class="mb-8">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-white mb-6">🎰 Lucky Spin</h2>
          
          <div class="relative w-72 h-72 mx-auto mb-6">
            <!-- Wheel -->
            <div 
              class="w-full h-full rounded-full border-8 border-primary relative overflow-hidden"
              :style="{ transform: `rotate(${rotation}deg)` }"
            >
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-full h-full grid grid-cols-6">
                  <div v-for="(segment, index) in wheelSegments" :key="index"
                    class="flex items-center justify-center text-white font-bold text-xs"
                    :style="{ 
                      backgroundColor: segment.color,
                      transform: `rotate(${index * 60}deg)`,
                      transformOrigin: 'center'
                    }"
                  >
                    <span :style="{ transform: `rotate(${index * 60 + 30}deg)` }">
                      {{ segment.value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pointer -->
            <div class="absolute -top-2 left-1/2 -translate-x-1/2">
              <div class="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-16 border-t-warning"></div>
            </div>
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            @click="spinWheel"
            :loading="spinning"
            :disabled="spinsRemaining <= 0"
          >
            Spin the Wheel! ({{ spinsRemaining }} spins left today)
          </Button>

          <p v-if="spinsRemaining <= 0" class="text-dark-400 mt-2">
            Come back tomorrow for more spins!
          </p>
        </div>
      </Card>

      <!-- Tap Game -->
      <Card class="mb-8">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-white mb-2">👆 Tap Rush</h2>
          <p class="text-dark-400 mb-4">Tap as fast as you can in 5 seconds!</p>
          
          <!-- Score Display -->
          <div class="mb-6">
            <p class="text-4xl font-bold text-warning">{{ tapScore }}</p>
            <p class="text-dark-400">points</p>
          </div>

          <!-- Timer -->
          <div class="mb-4">
            <div class="w-full bg-dark-200 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-warning to-danger h-2 rounded-full transition-all"
                :style="{ width: `${(tapTimeLeft / 5) * 100}%` }"
              ></div>
            </div>
            <p class="text-dark-400 text-sm mt-1">{{ tapTimeLeft }}s</p>
          </div>

          <!-- Tap Button -->
          <Button 
            variant="accent" 
            size="lg" 
            @click="tap"
            :disabled="!tapGameActive || tapTimeLeft <= 0"
            class="w-48 h-48 rounded-full text-2xl"
          >
            {{ tapGameActive ? 'TAP!' : tapTimeLeft <= 0 && tapScore > 0 ? 'Play Again' : 'Start' }}
          </Button>

          <!-- XP Reward -->
          <div v-if="tapXP > 0" class="mt-4">
            <p class="text-warning text-2xl font-bold animate-bounce-gentle">+{{ tapXP }} XP!</p>
          </div>
        </div>
      </Card>

      <!-- Daily Bonus -->
      <Card class="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white">🎁 Daily Bonus</h3>
            <p class="text-dark-400">Claim your free XP bonus every day!</p>
          </div>
          <Button 
            variant="primary" 
            @click="claimDailyBonus"
            :disabled="dailyBonusClaimed"
          >
            {{ dailyBonusClaimed ? 'Claimed!' : 'Claim Now!' }}
          </Button>
        </div>
      </Card>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../store/user'
import Navbar from '../components/layout/Navbar.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

const userStore = useUserStore()

// Spin Wheel
const spinning = ref(false)
const rotation = ref(0)
const spinsRemaining = ref(3)

const wheelSegments = [
  { value: '+5 XP', color: '#8B5CF6' },
  { value: '+10 XP', color: '#14B8A6' },
  { value: '+15 XP', color: '#F59E0B' },
  { value: '+20 XP', color: '#EF4444' },
  { value: '+25 XP', color: '#10B981' },
  { value: '+50 XP', color: '#EC4899' }
]

const spinWheel = () => {
  if (spinning.value || spinsRemaining.value <= 0) return
  
  spinning.value = true
  const randomRotation = Math.floor(Math.random() * 360) + 720 // At least 2 full rotations
  rotation.value += randomRotation
  
  setTimeout(() => {
    spinning.value = false
    spinsRemaining.value--
    
    // Calculate reward based on final angle
    const segmentIndex = Math.floor(((rotation.value % 360) / 60)) % 6
    const reward = [5, 10, 15, 20, 25, 50][segmentIndex]
    
    // Add XP to user (in real app, this would call API)
    console.log(`Won ${reward} XP!`)
  }, 3000)
}

// Tap Game
const tapScore = ref(0)
const tapTimeLeft = ref(5)
const tapGameActive = ref(false)
const tapXP = ref(0)
let tapTimer = null

const tap = () => {
  if (!tapGameActive.value) {
    // Start the game
    tapGameActive.value = true
    tapScore.value = 0
    tapXP.value = 0
    tapTimeLeft.value = 5
    
    tapTimer = setInterval(() => {
      tapTimeLeft.value--
      if (tapTimeLeft.value <= 0) {
        clearInterval(tapTimer)
        tapGameActive.value = false
        // Calculate XP (1 XP per 10 taps)
        tapXP.value = Math.floor(tapScore.value / 10)
      }
    }, 1000)
  } else {
    tapScore.value++
  }
}

// Daily Bonus
const dailyBonusClaimed = ref(false)

const claimDailyBonus = () => {
  dailyBonusClaimed.value = true
  // In real app, this would call API
  console.log('Daily bonus claimed! +50 XP')
}

onMounted(() => {
  // Check if user has spins remaining (from API)
  // For now, set default
  spinsRemaining.value = 3
  
  // Check if daily bonus was claimed (from localStorage)
  const lastClaim = localStorage.getItem('habitta-daily-bonus')
  if (lastClaim) {
    const lastClaimDate = new Date(lastClaim)
    const today = new Date()
    if (lastClaimDate.toDateString() === today.toDateString()) {
      dailyBonusClaimed.value = true
    }
  }
})

onUnmounted(() => {
  if (tapTimer) {
    clearInterval(tapTimer)
  }
})
</script>
