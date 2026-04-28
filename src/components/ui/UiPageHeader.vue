<template>
  <div class="page-header">
    <div class="page-header-text">
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>

    <div v-if="$slots.actions || actionVisible" class="page-header-actions">
      <slot name="actions">
        <button class="action-btn" :disabled="actionDisabled" @click="$emit('action')">
          <img v-if="actionIcon" :src="plusIcon" alt="add" class="action-icon" />
          <span>{{ actionLabel }}</span>
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import plusIcon from '@/assets/pluse.svg'

defineEmits(['action'])

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  actionVisible: {
    type: Boolean,
    default: false,
  },
  actionLabel: {
    type: String,
    default: '',
  },
  actionIcon: {
    type: Boolean,
    default: true,
  },
  actionDisabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.page-header {
  min-height: 72px;
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.page-header-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-title {
  font-size: 30px;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.15;
}

.page-subtitle {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.page-header-actions {
  flex-shrink: 0;
}

.action-btn {
  min-height: 48px;
  padding: 0 18px;
  border-radius: 14px;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 800;
  transition:
    background-color var(--transition-base),
    color var(--transition-base),
    transform var(--transition-base);
}

.action-btn:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: #ffffff;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
