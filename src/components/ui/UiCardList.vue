<template>
  <div class="card-list" :style="listStyle">
    <slot v-if="!isEmpty"></slot>

    <div v-else class="empty-state">
      <slot name="empty">
        <div class="empty-state-text">{{ emptyText }}</div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isEmpty: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: 'Список пока пуст',
  },
  maxHeight: {
    type: String,
    default: '',
  },
})

const listStyle = computed(() => {
  return {
    maxHeight: props.maxHeight || undefined,
  }
})
</script>

<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 120px;
  overflow-y: auto;
  padding-right: 4px;
}

.empty-state {
  min-height: 140px;
  border-radius: 20px;
  border: 1px dashed var(--color-border);
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.empty-state-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-align: center;
}
</style>
