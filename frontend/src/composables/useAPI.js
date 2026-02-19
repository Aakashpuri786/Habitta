import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('habitta-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('habitta-token')
      localStorage.removeItem('habitta-user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function useAPI() {
  const get = async (url, params = {}) => {
    try {
      const response = await api.get(url, { params })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Request failed' }
    }
  }

  const post = async (url, data = {}) => {
    try {
      const response = await api.post(url, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Request failed' }
    }
  }

  const put = async (url, data = {}) => {
    try {
      const response = await api.put(url, data)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Request failed' }
    }
  }

  const del = async (url) => {
    try {
      const response = await api.delete(url)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Request failed' }
    }
  }

  return {
    get,
    post,
    put,
    del,
    api
  }
}

export default api
