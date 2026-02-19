import { ref, computed } from 'vue'
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'

export function useAuth() {
  const userStore = useUserStore()
  const router = useRouter()
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => userStore.isAuthenticated)
  const currentUser = computed(() => userStore.currentUser)

  const signup = async (name, email, password) => {
    loading.value = true
    error.value = null
    
    const result = await userStore.signup(name, email, password)
    
    loading.value = false
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error
    }
    
    return result
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    
    const result = await userStore.login(email, password)
    
    loading.value = false
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error
    }
    
    return result
  }

  const logout = () => {
    userStore.logout()
    router.push('/login')
  }

  const fetchUser = async () => {
    loading.value = true
    await userStore.fetchUser()
    loading.value = false
  }

  return {
    loading,
    error,
    isAuthenticated,
    currentUser,
    signup,
    login,
    logout,
    fetchUser
  }
}
