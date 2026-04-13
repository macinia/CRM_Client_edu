<template>
  <div class="tabs">
    <button
      v-for="item in items"
      :key="item.value"
      class="tab-btn"
      :class="{ active: modelValue === item.value }"
      :disabled="item.disabled"
      @click="selectTab(item.value)"
    >
      <span class="tab-label">{{ item.label }}</span>
      <span v-if="item.count !== undefined" class="tab-count">{{ item.count }}</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectTab = (value) => {
  if (value === props.modelValue) return

  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 10px;
  padding-bottom: 14px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
}

.tab-btn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  color: var(--color-text-muted);
  background-color: transparent;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

.tab-btn:hover:not(:disabled) {
  background-color: rgba(128, 46, 135, 0.06);
  color: var(--color-primary);
}

.tab-btn.active {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 800;
}

.tab-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-label {
  font-size: 15px;
  font-weight: 700;
}

.tab-count {
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background-color: rgba(128, 46, 135, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}
</style>
