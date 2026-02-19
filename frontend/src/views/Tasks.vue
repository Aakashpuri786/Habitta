<template>
  <div class="min-h-screen bg-dark pt-20 lg:pl-64">
    <Navbar />
    
    <main class="p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p class="text-dark-400">Manage your daily to-do list</p>
        </div>
        <Button variant="primary" class="mt-4 md:mt-0" @click="showAddModal = true">
          <svg class="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </Button>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-2 mb-6">
        <button 
          @click="activeTab = 'all'"
          class="px-4 py-2 rounded-lg transition-all"
          :class="activeTab === 'all' ? 'bg-primary text-white' : 'text-dark-400 hover:text-white hover:bg-dark-100'"
        >
          All ({{ tasks.length }})
        </button>
        <button 
          @click="activeTab = 'pending'"
          class="px-4 py-2 rounded-lg transition-all"
          :class="activeTab === 'pending' ? 'bg-primary text-white' : 'text-dark-400 hover:text-white hover:bg-dark-100'"
        >
          Pending ({{ pendingTasks.length }})
        </button>
        <button 
          @click="activeTab = 'completed'"
          class="px-4 py-2 rounded-lg transition-all"
          :class="activeTab === 'completed' ? 'bg-primary text-white' : 'text-dark-400 hover:text-white hover:bg-dark-100'"
        >
          Completed ({{ completedTasks.length }})
        </button>
      </div>

      <!-- Tasks List -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📋</div>
        <h3 class="text-xl font-semibold text-white mb-2">No tasks found</h3>
        <p class="text-dark-400 mb-4">{{ activeTab === 'all' ? 'Create your first task to get started!' : `No ${activeTab} tasks` }}</p>
        <Button v-if="activeTab === 'all'" variant="primary" @click="showAddModal = true">Create Task</Button>
      </div>

      <div v-else class="space-y-3">
        <Card 
          v-for="task in filteredTasks" 
          :key="task._id"
          class="hover:border-accent/50 transition-colors"
          :class="{ 'opacity-60': task.completed }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button 
                @click="toggleTask(task)"
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                :class="task.completed ? 'bg-success border-success' : 'border-dark-300 hover:border-primary'"
              >
                <svg v-if="task.completed" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <div>
                <h3 class="font-semibold text-white" :class="{ 'line-through text-dark-400': task.completed }">
                  {{ task.title }}
                </h3>
                <p v-if="task.description" class="text-dark-400 text-sm">{{ task.description }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <span v-if="task.dueDate" class="text-xs text-dark-400">
                    Due: {{ formatDate(task.dueDate) }}
                  </span>
                  <span class="text-xs text-warning">+5 XP</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="editTask(task)"
                class="p-2 text-dark-400 hover:text-white hover:bg-dark-100 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click="deleteTask(task._id)"
                class="p-2 text-dark-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </main>

    <!-- Add/Edit Task Modal -->
    <Modal :show="showAddModal || showEditModal" @close="closeModals" :title="showEditModal ? 'Edit Task' : 'Add New Task'">
      <form @submit.prevent="submitTask" class="space-y-4">
        <div>
          <label class="label">Task Title</label>
          <input v-model="form.title" type="text" class="input" placeholder="e.g., Complete project report" required />
        </div>
        
        <div>
          <label class="label">Description (optional)</label>
          <textarea v-model="form.description" class="input" rows="2" placeholder="Add some details..."></textarea>
        </div>
        
        <div>
          <label class="label">Due Date (optional)</label>
          <input v-model="form.dueDate" type="date" class="input" />
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <Button variant="ghost" type="button" @click="closeModals">Cancel</Button>
          <Button variant="primary" type="submit" :loading="submitting">
            {{ showEditModal ? 'Save Changes' : 'Create Task' }}
          </Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '../store/tasks'
import { useUserStore } from '../store/user'
import Navbar from '../components/layout/Navbar.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Modal from '../components/ui/Modal.vue'

const tasksStore = useTasksStore()
const userStore = useUserStore()

const tasks = computed(() => tasksStore.tasks)
const loading = computed(() => tasksStore.loading)
const pendingTasks = computed(() => tasksStore.pendingTasks)
const completedTasks = computed(() => tasksStore.completedTasks)

const activeTab = ref('all')
const showAddModal = ref(false)
const showEditModal = ref(false)
const submitting = ref(false)
const editingId = ref(null)

const form = ref({
  title: '',
  description: '',
  dueDate: ''
})

const filteredTasks = computed(() => {
  if (activeTab.value === 'pending') return pendingTasks.value
  if (activeTab.value === 'completed') return completedTasks.value
  return tasks.value
})

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = { title: '', description: '', dueDate: '' }
  editingId.value = null
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const editTask = (task) => {
  editingId.value = task._id
  form.value = {
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
  }
  showEditModal.value = true
}

const submitTask = async () => {
  submitting.value = true
  try {
    const taskData = {
      ...form.value,
      dueDate: form.value.dueDate ? new Date(form.value.dueDate).toISOString() : null
    }
    
    if (showEditModal.value) {
      await tasksStore.updateTask(editingId.value, taskData)
    } else {
      await tasksStore.createTask(taskData)
    }
    closeModals()
  } finally {
    submitting.value = false
  }
}

const toggleTask = async (task) => {
  await tasksStore.toggleTask(task._id)
  // Refresh user data if task was completed
  if (!task.completed) {
    await userStore.fetchUser()
  }
}

const deleteTask = async (id) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await tasksStore.deleteTask(id)
  }
}

onMounted(() => {
  tasksStore.fetchTasks()
})
</script>
