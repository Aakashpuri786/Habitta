import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

export const useChallengesStore = defineStore('challenges', {
  state: () => ({
    challenges: [],
    loading: false,
    error: null
  }),
  
  getters: {
    availableChallenges: (state) => state.challenges.filter(c => !c.completed),
    completedChallenges: (state) => state.challenges.filter(c => c.completed),
    totalChallenges: (state) => state.challenges.length,
    completedCount: (state) => state.challenges.filter(c => c.completed).length
  },
  
  actions: {
    async fetchChallenges() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const response = await axios.get(`${API_URL}/challenges`)
        this.challenges = response.data.challenges
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch challenges'
      } finally {
        this.loading = false
      }
    },
    
    async completeChallenge(challengeId) {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const response = await axios.post(`${API_URL}/challenges/${challengeId}/complete`)
        const index = this.challenges.findIndex(c => c._id === challengeId)
        if (index !== -1) {
          this.challenges[index] = response.data.challenge
        }
        return { success: true, challenge: response.data.challenge, xp: response.data.xp }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to complete challenge'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async refreshChallenges() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const response = await axios.post(`${API_URL}/challenges/refresh`)
        this.challenges = response.data.challenges
        return { success: true, challenges: response.data.challenges }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to refresh challenges'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})
