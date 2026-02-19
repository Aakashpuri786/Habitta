<template>
  <div class="min-h-screen bg-dark pt-20 lg:pl-64">
    <Navbar />
    
    <main class="p-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Settings</h1>
        <p class="text-dark-400">Manage your account and preferences</p>
      </div>

      <!-- Profile Section -->
      <Card class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold text-white">Profile</h2>
        </template>
        
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label class="label">Name</label>
            <input v-model="form.name" type="text" class="input" placeholder="Your name" />
          </div>
          
          <div>
            <label class="label">Email</label>
            <input v-model="form.email" type="email" class="input" placeholder="Your email" disabled />
            <p class="text-dark-400 text-xs mt-1">Email cannot be changed</p>
          </div>

          <div class="flex justify-end">
            <Button type="submit" variant="primary" :loading="saving">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <!-- Theme Section -->
      <Card class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold text-white">Appearance</h2>
        </template>
        
        <div class="space-y-4">
          <div>
            <label class="label">Theme</label>
            <div class="grid grid-cols-2 gap-4">
              <button 
                @click="setTheme('dark')"
                class="p-4 rounded-lg border-2 transition-all"
                :class="theme === 'dark' ? 'border-primary bg-primary/10' : 'border-dark-200 hover:border-dark-300'"
              >
                <div class="w-full h-20 bg-dark rounded-lg mb-2 flex items-center justify-center">
                  <span class="text-2xl">🌙</span>
                </div>
                <p class="text-white font-medium">Dark</p>
              </button>
              <button 
                @click="setTheme('light')"
                class="p-4 rounded-lg border-2 transition-all"
                :class="theme === 'light' ? 'border-primary bg-primary/10' : 'border-dark-200 hover:border-dark-300'"
              >
                <div class="w-full h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <span class="text-2xl">☀️</span>
                </div>
                <p class="text-white font-medium">Light</p>
              </button>
            </div>
          </div>
        </div>
      </Card>

      <!-- Notifications Section -->
      <Card class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold text-white">Notifications</h2>
        </template>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Daily Reminders</p>
              <p class="text-dark-400 text-sm">Get reminded to complete your habits</p>
            </div>
            <button 
              @click="notifications.dailyReminder = !notifications.dailyReminder"
              class="relative w-12 h-6 rounded-full transition-colors"
              :class="notifications.dailyReminder ? 'bg-primary' : 'bg-dark-200'"
            >
              <span 
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                :class="notifications.dailyReminder ? 'left-7' : 'left-1'"
              ></span>
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Streak Alerts</p>
              <p class="text-dark-400 text-sm">Get notified when your streak is at risk</p>
            </div>
            <button 
              @click="notifications.streakAlerts = !notifications.streakAlerts"
              class="relative w-12 h-6 rounded-full transition-colors"
              :class="notifications.streakAlerts ? 'bg-primary' : 'bg-dark-200'"
            >
              <span 
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                :class="notifications.streakAlerts ? 'left-7' : 'left-1'"
              ></span>
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Challenge Updates</p>
              <p class="text-dark-400 text-sm">Get notified about new challenges</p>
            </div>
            <button 
              @click="notifications.challengeUpdates = !notifications.challengeUpdates"
              class="relative w-12 h-6 rounded-full transition-colors"
              :class="notifications.challengeUpdates ? 'bg-primary' : 'bg-dark-200'"
            >
              <span 
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                :class="notifications.challengeUpdates ? 'left-7' : 'left-1'"
              ></span>
            </button>
          </div>
        </div>
      </Card>

      <!-- Danger Zone -->
      <Card class="border border-danger/30">
        <template #header>
          <h2 class="text-xl font-semibold text-danger">Danger Zone</h2>
        </template>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Delete Account</p>
              <p class="text-dark-400 text-sm">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" @click="showDeleteModal = true">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      <!-- Delete Account Modal -->
      <Modal :show="showDeleteModal" title="Delete Account" @close="showDeleteModal = false">
        <div class="text-center">
          <div class="text-6xl mb-4">⚠️</div>
          <p class="text-white mb-2">Are you sure you want to delete your account?</p>
          <p class="text-danger mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
          
          <div class="mb-4">
            <label class="label">Type "DELETE" to confirm</label>
            <input v-model="deleteConfirmation" type="text" class="input" placeholder="DELETE" />
          </div>
          
          <div class="flex justify-end space-x-3">
            <Button variant="ghost" @click="showDeleteModal = false">Cancel</Button>
            <Button variant="danger" @click="deleteAccount" :disabled="deleteConfirmation !== 'DELETE'">
              Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../store/user'
import { useAuth } from '../composables/useAuth'
import Navbar from '../components/layout/Navbar.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Modal from '../components/ui/Modal.vue'

const userStore = useUserStore()
const { logout } = useAuth()

const user = computed(() => userStore.currentUser)

const form = ref({
  name: '',
  email: ''
})

const theme = ref('dark')
const saving = ref(false)
const showDeleteModal = ref(false)
const deleteConfirmation = ref('')

const notifications = ref({
  dailyReminder: true,
  streakAlerts: true,
  challengeUpdates: true
})

const setTheme = (newTheme) => {
  theme.value = newTheme
  userStore.setTheme(newTheme)
  // Apply theme to document
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const updateProfile = async () => {
  saving.value = true
  try {
    await userStore.updateProfile({ name: form.value.name })
  } finally {
    saving.value = false
  }
}

const deleteAccount = async () => {
  if (deleteConfirmation.value !== 'DELETE') return
  
  // In a real app, this would call an API to delete the account
  alert('Account deletion is not implemented in this demo.')
  showDeleteModal.value = false
}

onMounted(() => {
  if (user.value) {
    form.value.name = user.value.name || ''
    form.value.email = user.value.email || ''
    theme.value = user.value.theme || 'dark'
  }
})
</script>
