<template>
  <div class="min-h-screen bg-dark">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center animate-stagger">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <span class="mr-2">🚀</span>
            Start Building Better Habits Today
          </div>

          <!-- Main Heading -->
          <h1 class="text-5xl md:text-7xl font-bold mb-6">
            <span class="gradient-text">Build Better Habits,</span>
            <br />
            <span class="text-white">Transform Your Life</span>
          </h1>

          <!-- Subheading -->
          <p class="text-xl text-dark-300 max-w-2xl mx-auto mb-10">
            Habitta helps you build lasting habits with gamification, streaks, challenges, and rewards. 
            Track your progress, level up, and become the best version of yourself.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <router-link to="/signup" class="btn-primary text-lg px-8 py-4">
              Start Building Discipline
              <svg class="inline-block ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
            <router-link to="/login" class="btn-ghost text-lg px-8 py-4">
              Sign In
            </router-link>
          </div>
        </div>

        <!-- Stats Preview -->
        <div class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style="animation-delay: 0.3s;">
          <div class="text-center p-6 bg-dark-50/50 rounded-2xl backdrop-blur">
            <div class="text-4xl font-bold text-primary mb-2">100+</div>
            <div class="text-dark-400">Habits Tracked</div>
          </div>
          <div class="text-center p-6 bg-dark-50/50 rounded-2xl backdrop-blur">
            <div class="text-4xl font-bold text-accent mb-2">50k+</div>
            <div class="text-dark-400">Active Users</div>
          </div>
          <div class="text-center p-6 bg-dark-50/50 rounded-2xl backdrop-blur">
            <div class="text-4xl font-bold text-warning mb-2">1M+</div>
            <div class="text-dark-400">Streaks Maintained</div>
          </div>
          <div class="text-center p-6 bg-dark-50/50 rounded-2xl backdrop-blur">
            <div class="text-4xl font-bold text-success mb-2">98%</div>
            <div class="text-dark-400">Success Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-dark-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-white mb-4">
            Everything You Need to <span class="gradient-text">Succeed</span>
          </h2>
          <p class="text-dark-300 text-lg max-w-2xl mx-auto">
            Powerful features designed to keep you motivated and accountable
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card-hover group">
            <div class="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Habit Tracking</h3>
            <p class="text-dark-300">
              Track your daily habits with streaks and get notified when you're about to break them.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card-hover group">
            <div class="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Daily Challenges</h3>
            <p class="text-dark-300">
              Complete daily challenges to earn bonus XP and level up faster.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card-hover group">
            <div class="w-14 h-14 rounded-xl bg-warning/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Rewards & Leveling</h3>
            <p class="text-dark-300">
              Earn XP, level up, and unlock rewards as you build better habits.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote Section -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <div class="text-6xl text-primary/30 mb-4">"</div>
        <blockquote class="text-2xl md:text-3xl font-medium text-white mb-6">
          {{ currentQuote.text }}
        </blockquote>
        <cite class="text-dark-400">— {{ currentQuote.author }}</cite>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 border-t border-dark-100">
      <div class="max-w-7xl mx-auto px-4 text-center text-dark-400">
        <p>&copy; {{ new Date().getFullYear() }} Habitta. Build better habits, transform your life.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/layout/Navbar.vue'

const quotes = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" }
]

const currentQuote = ref(quotes[0])

onMounted(() => {
  // Rotate quotes every 10 seconds
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    currentQuote.value = quotes[randomIndex]
  }, 10000)
})
</script>
