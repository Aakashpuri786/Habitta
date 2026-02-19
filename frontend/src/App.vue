<template>
  <div :class="{ 'dark': isDark }" class="min-h-screen">
    <div class="min-h-screen bg-dark text-white">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from './store/user'

const userStore = useUserStore()

const isDark = computed(() => userStore.theme === 'dark')

onMounted(() => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('habitta-theme')
  if (savedTheme) {
    userStore.setTheme(savedTheme)
  }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
