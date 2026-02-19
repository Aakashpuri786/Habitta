<template>
  <nav class="fixed top-0 left-0 right-0 z-40 bg-dark/90 backdrop-blur-lg border-b border-dark-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span class="text-white font-bold text-xl">H</span>
            </div>
            <span class="text-xl font-bold gradient-text">Habitta</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path"
              class="px-3 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-100 transition-all"
              active-class="text-primary bg-primary/10"
            >
              {{ item.name }}
            </router-link>
          </template>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <!-- XP Display -->
            <div class="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-dark-100 rounded-lg">
              <svg class="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-warning font-medium">{{ user?.xp || 0 }}</span>
            </div>

            <!-- Level Badge -->
            <div class="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-primary/20 rounded-lg">
              <span class="text-primary font-medium">Lv.{{ user?.level || 1 }}</span>
            </div>

            <!-- User Avatar -->
            <div class="relative" ref="userMenuRef">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 p-1 rounded-lg hover:bg-dark-100 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span class="text-white font-medium text-sm">{{ userInitials }}</span>
                </div>
              </button>

              <!-- Dropdown Menu -->
              <transition name="dropdown">
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-dark-50 rounded-xl shadow-lg border border-dark-100 py-2">
                  <router-link 
                    to="/settings"
                    class="flex items-center px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-100 transition-colors"
                    @click="showUserMenu = false"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </router-link>
                  <button 
                    @click="handleLogout"
                    class="flex items-center w-full px-4 py-2 text-danger hover:bg-dark-100 transition-colors"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </transition>
            </div>
          </template>

          <template v-else>
            <router-link to="/login" class="btn-ghost">Login</router-link>
            <router-link to="/signup" class="btn-primary">Get Started</router-link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-100"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide">
      <div v-if="showMobileMenu" class="md:hidden bg-dark-50 border-b border-dark-100">
        <div class="px-4 py-3 space-y-2">
          <template v-if="isAuthenticated">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path"
              class="block px-4 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-100 transition-colors"
              active-class="text-primary bg-primary/10"
              @click="showMobileMenu = false"
            >
              {{ item.name }}
            </router-link>
            <button 
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 rounded-lg text-danger hover:bg-dark-100 transition-colors"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link 
              to="/login"
              class="block px-4 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-100"
              @click="showMobileMenu = false"
            >
              Login
            </router-link>
            <router-link 
              to="/signup"
              class="block px-4 py-2 rounded-lg text-primary hover:bg-dark-100"
              @click="showMobileMenu = false"
            >
              Get Started
            </router-link>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../store/user'
import { useAuth } from '../../composables/useAuth'

const userStore = useUserStore()
const { logout } = useAuth()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const isAuthenticated = computed(() => userStore.isAuthenticated)
const user = computed(() => userStore.currentUser)

const userInitials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Habits', path: '/habits' },
  { name: 'Tasks', path: '/tasks' },
  { name: 'Challenges', path: '/challenges' },
  { name: 'Rewards', path: '/rewards' }
]

const handleLogout = () => {
  showUserMenu.value = false
  showMobileMenu.value = false
  logout()
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
