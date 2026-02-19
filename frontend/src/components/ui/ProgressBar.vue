<template>
  <div class="w-full">
    <div v-if="showLabel" class="flex justify-between mb-1">
      <span class="text-sm font-medium text-dark-300">{{ label }}</span>
      <span class="text-sm font-medium text-primary">{{ Math.round(percentage) }}%</span>
    </div>
    <div 
      class="w-full bg-dark-200 rounded-full h-2.5 overflow-hidden"
      :class="{ 'h-1': size === 'sm', 'h-2.5': size === 'md', 'h-4': size === 'lg' }"
    >
      <div 
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="[gradientClass, { 'animate-pulse': animated }]"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
    <div v-if="showSubLabel" class="flex justify-between mt-1">
      <span class="text-xs text-dark-400">{{ current }} / {{ max }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  label: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  showSubLabel: {
    type: Boolean,
    default: false
  },
  current: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'accent', 'success', 'warning', 'danger'].includes(value)
  },
  animated: {
    type: Boolean,
    default: true
  }
})

const gradientClass = computed(() => {
  const gradients = {
    primary: 'bg-gradient-to-r from-primary-400 to-primary-600',
    accent: 'bg-gradient-to-r from-accent-light to-accent',
    success: 'bg-gradient-to-r from-green-400 to-success',
    warning: 'bg-gradient-to-r from-yellow-400 to-warning',
    danger: 'bg-gradient-to-r from-red-400 to-danger'
  }
  return gradients[props.variant]
})
</script>
