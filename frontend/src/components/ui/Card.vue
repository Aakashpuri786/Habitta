<template>
  <div 
    :class="[
      'card',
      { 'card-hover': hoverable },
      { 'p-0 overflow-hidden': noPadding },
      className
    ]"
    @click="hoverable && $emit('click', $event)"
  >
    <div v-if="$slots.header" class="px-6 py-4 border-b border-dark-100">
      <slot name="header" />
    </div>
    <div :class="[noPadding ? '' : 'p-6']">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-dark-100">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  hoverable: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script>
