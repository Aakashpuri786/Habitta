<template>
  <div class="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
    <!-- Background Effects -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center space-x-2">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span class="text-white font-bold text-2xl">H</span>
          </div>
          <span class="text-2xl font-bold gradient-text">Habitta</span>
        </router-link>
      </div>

      <!-- Signup Card -->
      <div class="card animate-scale-in">
        <h2 class="text-2xl font-bold text-white mb-2">Start Your Journey</h2>
        <p class="text-dark-400 mb-6">Create an account to build better habits</p>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-danger/20 border border-danger/30 rounded-lg text-danger text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleSignup" class="space-y-4">
          <div>
            <label class="label">Name</label>
            <input 
              v-model="form.name"
              type="text" 
              class="input"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label class="label">Email</label>
            <input 
              v-model="form.email"
              type="email" 
              class="input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label class="label">Password</label>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'" 
                class="input pr-10"
                placeholder="Create a password"
                required
                minlength="6"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p class="text-dark-400 text-xs mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label class="label">Confirm Password</label>
            <input 
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'" 
              class="input"
              placeholder="Confirm your password"
              required
            />
            <p v-if="form.password !== form.confirmPassword && form.confirmPassword" class="text-danger text-xs mt-1">
              Passwords do not match
            </p>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            class="w-full"
            :loading="loading"
            :disabled="form.password !== form.confirmPassword"
          >
            Create Account
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-dark-400">
            Already have an account? 
            <router-link to="/login" class="text-primary hover:text-primary-400 font-medium">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import Button from '../components/ui/Button.vue'

const { signup, loading, error } = useAuth()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)

const handleSignup = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    return
  }
  await signup(form.value.name, form.value.email, form.value.password)
}
</script>
