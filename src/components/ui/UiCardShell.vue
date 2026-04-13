<template>
  <div class="card-shell" :style="cardStyle" :class="{ interactive }">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  backgroundColor: {
    type: String,
    default: '',
  },
  interactive: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: String,
    default: '20px 24px',
  },
  radius: {
    type: String,
    default: '20px',
  },
})

const cardStyle = computed(() => {
  return {
    backgroundColor: props.backgroundColor || 'var(--color-surface)',
    padding: props.padding,
    borderRadius: props.radius,
  }
})
</script>

<style scoped>
.card-shell {
  border: 1px solid rgba(95, 72, 99, 0.08);
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base);
}

.card-shell.interactive:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
</style>
