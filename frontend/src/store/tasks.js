import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null
  }),
  
  getters: {
    pendingTasks: (state) => state.tasks.filter(t => !t.completed),
    completedTasks: (state) => state.tasks.filter(t => t.completed),
    totalTasks: (state) => state.tasks.length,
    completedCount: (state) => state.tasks.filter(t => t.completed).length
  },
  
  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const response = await axios.get(`${API_URL}/tasks`)
        this.tasks = response.data.tasks
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch tasks'
      } finally {
        this.loading = false
      }
    },
    
    async createTask(taskData) {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const response = await axios.post(`${API_URL}/tasks`, taskData)
        this.tasks.push(response.data.task)
        return { success: true, task: response.data.task }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create task'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async updateTask(taskId, taskData) {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData)
        const index = this.tasks.findIndex(t => t._id === taskId)
        if (index !== -1) {
          this.tasks[index] = response.data.task
        }
        return { success: true, task: response.data.task }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update task'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async deleteTask(taskId) {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('habitta-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        await axios.delete(`${API_URL}/tasks/${taskId}`)
        this.tasks = this.tasks.filter(t => t._id !== taskId)
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete task'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async toggleTask(taskId) {
      const task = this.tasks.find(t => t._id === taskId)
      if (!task) return { success: false, error: 'Task not found' }
      
      return await this.updateTask(taskId, { completed: !task.completed })
    }
  }
})
