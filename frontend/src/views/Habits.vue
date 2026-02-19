<template>
  <div class="min-h-screen bg-dark pt-20 lg:pl-64">
    <Navbar />
    
    <main class="p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Habits</h1>
          <p class="text-dark-400">Track and manage your daily habits</p>
        </div>
        <Button variant="primary" class="mt-4 md:mt-0" @click="showAddModal = true">
          <svg class="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Habit
        </Button>
      </div>

      <!-- Progress Summary -->
      <Card class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-dark-400 text-sm">Today's Progress</p>
            <p class="text-2xl font-bold text-white">
              {{ completedCount }} / {{ totalHabits }} habits completed
            </p>
          </div>
          <ProgressBar 
            :percentage="completionPercentage" 
            variant="primary"
            size="lg"
          />
        </div>
      </Card>

      <!-- Habits List -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>

      <div v-else-if="habits.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-xl font-semibold text-white mb-2">No habits yet</h3>
        <p class="text-dark-400 mb-4">Start building better habits today!</p>
        <Button variant="primary" @click="showAddModal = true">Create Your First Habit</Button>
      </div>

      <div v-else class="space-y-4">
        <Card 
          v-for="habit in habits" 
          :key="habit._id"
          class="hover:border-primary/50 transition-colors"
          :class="{ 'border-l-4 border-l-success': habit.completedToday }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button 
                @click="toggleHabit(habit)"
                class="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                :class="habit.completedToday ? 'bg-success' : 'bg-dark-100 hover:bg-primary/20'"
              >
                <svg v-if="habit.completedToday" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else class="text-dark-400">{{ habit.difficulty === 'hard' ? '💎' : habit.difficulty === 'medium' ? '⭐' : '🌱' }}</span>
              </button>
              <div>
                <h3 class="font-semibold text-white" :class="{ 'line-through text-dark-400': habit.completedToday }">
                  {{ habit.name }}
                </h3>
                <p class="text-dark-400 text-sm">{{ habit.description || 'No description' }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-xs px-2 py-0.5 rounded-full"
                    :class="{
                      'bg-success/20 text-success': habit.completedToday,
                      'bg-dark-200 text-dark-400': !habit.completedToday
                    }"
                  >
                    {{ habit.completedToday ? 'Completed' : `${habit.streak} day streak` }}
                  </span>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    +{{ habit.xp }} XP
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="editHabit(habit)"
                class="p-2 text-dark-400 hover:text-white hover:bg-dark-100 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click="deleteHabit(habit._id)"
                class="p-2 text-dark-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </main>

    <!-- Add/Edit Habit Modal -->
    <Modal :show="showAddModal || showEditModal" @close="closeModals" :title="showEditModal ? 'Edit Habit' : 'Add New Habit'">
      <form @submit.prevent="submitHabit" class="space-y-4">
        <div>
          <label class="label">Habit Name</label>
          <input v-model="form.name" type="text" class="input" placeholder="e.g., Morning meditation" required />
        </div>
        
        <div>
          <label class="label">Description (optional)</label>
          <textarea v-model="form.description" class="input" rows="2" placeholder="Add some details..."></textarea>
        </div>
        
        <div>
          <label class="label">Difficulty</label>
          <div class="grid grid-cols-3 gap-3">
            <button 
              type="button"
              @click="form.difficulty = 'easy'"
              class="p-3 rounded-lg border transition-all"
              :class="form.difficulty === 'easy' ? 'border-success bg-success/10 text-success' : 'border-dark-200 text-dark-400 hover:border-dark-300'"
            >
              <span class="text-2xl">🌱</span>
              <p class="text-sm mt-1">Easy</p>
              <p class="text-xs">+10 XP</p>
            </button>
            <button 
              type="button"
              @click="form.difficulty = 'medium'"
              class="p-3 rounded-lg border transition-all"
              :class="form.difficulty === 'medium' ? 'border-warning bg-warning/10 text-warning' : 'border-dark-200 text-dark-400 hover:border-dark-300'"
            >
              <span class="text-2xl">⭐</span>
              <p class="text-sm mt-1">Medium</p>
              <p class="text-xs">+20 XP</p>
            </button>
            <button 
              type="button"
              @click="form.difficulty = 'hard'"
              class="p-3 rounded-lg border transition-all"
              :class="form.difficulty === 'hard' ? 'border-primary bg-primary/10 text-primary' : 'border-dark-200 text-dark-400 hover:border-dark-300'"
            >
              <span class="text-2xl">💎</span>
              <p class="text-sm mt-1">Hard</p>
              <p class="text-xs">+30 XP</p>
            </button>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <Button variant="ghost" type="button" @click="closeModals">Cancel</Button>
          <Button variant="primary" type="submit" :loading="submitting">
            {{ showEditModal ? 'Save Changes' : 'Create Habit' }}
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Reflection Modal -->
    <Modal :show="showReflectionModal" title="Great job!" @close="showReflectionModal = false">
      <div class="text-center">
        <div class="text-6xl mb-4">🎉</div>
        <p class="text-white text-lg mb-2">Habit completed!</p>
        <p class="text-warning font-bold text-2xl mb-4">+{{ lastEarnedXP }} XP</p>
        <div class="mb-4">
          <label class="label">How did you feel?</label>
          <textarea 
            v-model="reflection" 
            class="input" 
            rows="3" 
            placeholder="Share your thoughts..."
          ></textarea>
        </div>
        <Button variant="primary" @click="submitReflection">Continue</Button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitsStore } from '../store/habits'
import { useUserStore } from '../store/user'
import Navbar from '../components/layout/Navbar.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Modal from '../components/ui/Modal.vue'
import ProgressBar from '../components/ui/ProgressBar.vue'

const habitsStore = useHabitsStore()
const userStore = useUserStore()

const habits = computed(() => habitsStore.habits)
const loading = computed(() => habitsStore.loading)
const totalHabits = computed(() => habitsStore.totalHabits)
const completedCount = computed(() => habitsStore.completedCount)
const completionPercentage = computed(() => totalHabits.value === 0 ? 0 : (completedCount.value / totalHabits.value) * 100)

const showAddModal = ref(false)
const showEditModal = ref(false)
const showReflectionModal = ref(false)
const submitting = ref(false)
const editingId = ref(null)
const lastEarnedXP = ref(0)
const reflection = ref('')

const form = ref({
  name: '',
  description: '',
  difficulty: 'easy'
})

const difficultyXP = {
  easy: 10,
  medium: 20,
  hard: 30
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = { name: '', description: '', difficulty: 'easy' }
  editingId.value = null
}

const editHabit = (habit) => {
  editingId.value = habit._id
  form.value = {
    name: habit.name,
    description: habit.description || '',
    difficulty: habit.difficulty
  }
  showEditModal.value = true
}

const submitHabit = async () => {
  submitting.value = true
  try {
    if (showEditModal.value) {
      await habitsStore.updateHabit(editingId.value, form.value)
    } else {
      await habitsStore.createHabit(form.value)
    }
    closeModals()
  } finally {
    submitting.value = false
  }
}

const toggleHabit = async (habit) => {
  if (!habit.completedToday) {
    const result = await habitsStore.completeHabit(habit._id, '')
    if (result.success) {
      lastEarnedXP.value = result.xp || difficultyXP[habit.difficulty]
      showReflectionModal.value = true
      // Refresh user data
      await userStore.fetchUser()
    }
  }
}

const submitReflection = async () => {
  if (editingId.value) {
    await habitsStore.completeHabit(editingId.value, reflection.value)
  }
  showReflectionModal.value = false
  reflection.value = ''
}

const deleteHabit = async (id) => {
  if (confirm('Are you sure you want to delete this habit?')) {
    await habitsStore.deleteHabit(id)
  }
}

onMounted(() => {
  habitsStore.fetchHabits()
})
</script>
