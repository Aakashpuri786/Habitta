import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('habitta-user')) || null,
    token: localStorage.getItem('habitta-token') || null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    theme: (state) => state.user?.theme || 'dark'
  },
  
  actions: {
    async signup(name, email, password) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/auth/signup`, {
          name,
          email,
          password
        })
        
        this.token = response.data.token
        this.user = response.data.user
        
        localStorage.setItem('habitta-token', this.token)
        localStorage.setItem('habitta-user', JSON.stringify(this.user))
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Signup failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password
        })
        
        this.token = response.data.token
        this.user = response.data.user
        
        localStorage.setItem('habitta-token', this.token)
        localStorage.setItem('habitta-user', JSON.stringify(this.user))
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('habitta-token')
      localStorage.removeItem('habitta-user')
      delete axios.defaults.headers.common['Authorization']
    },
    
    async fetchUser() {
      if (!this.token) return
      
      this.loading = true
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        const response = await axios.get(`${API_URL}/users/me`)
        this.user = response.data.user
        localStorage.setItem('habitta-user', JSON.stringify(this.user))
      } catch (error) {
        this.logout()
      } finally {
        this.loading = false
      }
    },
    
    async fetchDashboard() {
      if (!this.token) return null
      
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        const response = await axios.get(`${API_URL}/users/dashboard`)
        return response.data.stats
      } catch (error) {
        console.error('Error fetching dashboard:', error)
        return null
      }
    },
    
    async updateProfile(data) {
      this.loading = true
      this.error = null
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        const response = await axios.put(`${API_URL}/users/me`, data)
        this.user = response.data.user
        localStorage.setItem('habitta-user', JSON.stringify(this.user))
        
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Update failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    setTheme(theme) {
      if (this.user) {
        this.user.theme = theme
        localStorage.setItem('habitta-user', JSON.stringify(this.user))
      }
      localStorage.setItem('habitta-theme', theme)
    },
    
    updateUserStats(stats) {
      if (this.user) {
        this.user.xp = stats.xp
        this.user.level = stats.level
        this.user.streak = stats.streak
        localStorage.setItem('habitta-user', JSON.stringify(this.user))
      }
    }
  }
})
