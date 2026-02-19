import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

export const useHabitsStore = defineStore('habits', {
  state: () => ({
    habits: [],
    loading: false,
    error: null
  }),
  
  getters: {
    completedHabits: (state) => state.habits.filter(h => h.completedToday),
    pendingHabits: (state) => state.habits.filter(h => !h.completedToday),
    totalHabits: (state) => state.habits.length,
    completedCount: (state) => state.habits.filter(h => h.completedToday).length
  },
  
  actions: {
    async fetchHabits() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const response = await axios.get(`${API_URL}/habits`)
        this.habits = response.data.habits
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch habits'
      } finally {
        this.loading = false
      }
    },
    
    async createHabit(habitData) {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const response = await axios.post(`${API_URL}/habits`, habitData)
        this.habits.push(response.data.habit)
        return { success: true, habit: response.data.habit }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create habit'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async updateHabit(habitId, habitData) {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const response = await axios.put(`${API_URL}/habits/${habitId}`, habitData)
        const index = this.habits.findIndex(h => h._id === habitId)
        if (index !== -1) {
          this.habits[index] = response.data.habit
        }
        return { success: true, habit: response.data.habit }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update habit'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async deleteHabit(habitId) {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        await axios.delete(`${API_URL}/habits/${habitId}`)
        this.habits = this.habits.filter(h => h._id !== habitId)
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete habit'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async completeHabit(habitId, reflection = '') {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const response = await axios.post(`${API_URL}/habits/${habitId}/complete`, {
          reflection
        })
        const index = this.habits.findIndex(h => h._id === habitId)
        if (index !== -1) {
          this.habits[index] = response.data.habit
        }
        return { success: true, habit: response.data.habit, xp: response.data.xp }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to complete habit'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})
