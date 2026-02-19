import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import router from './router'
import App from './App.vue'
import { useUserStore } from './store/user'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const userStore = useUserStore(pinia)
if (userStore.token) {
  axios.defaults.headers.common.Authorization = `Bearer ${userStore.token}`
  userStore.fetchUser()
}

app.mount('#app')
